const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const userController = require("../../../controllers/user");
const User = require("../../../models/User");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockEnd = jest.fn();

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}));

const mockRes = { status: mockStatus };

describe("User controller", () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  describe("index", () => {
    it("should return users with a status code 200", async () => {
      const testUsers = ["user1", "user2"];
      jest.spyOn(User, "getAll").mockResolvedValue(testUsers);

      await userController.index(null, mockRes);

      expect(User.getAll).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testUsers);
    });

    it("should return an error upon failure", async () => {
      jest.spyOn(User, "getAll").mockRejectedValue(new Error("Something happened to your db"));

      await userController.index(null, mockRes);

      expect(User.getAll).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Something happened to your db" });
    });
  });

  describe("showId", () => {
    let testUser, mockReq;
    beforeEach(() => {
      testUser = {
        user_id: 1,
        username: "userResident",
        first_name: "user",
        last_name: "resident",
        email: "resident@gmail.com",
        password: "$2b$12$x/jcsuale8zziXeM4oiI8B9aRpVSdWgzoVUHkXMdyl5Eapcg3s1Fx",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "TE1 2ST",
        borough: "Redbridge",
        phone_number: "07987654432",
        user_role: "resident",
      };
      mockReq = { userId: 1 };
    });

    it("should return a user with a 200 status code", async () => {
      jest.spyOn(User, "getOneById").mockResolvedValue(testUser);

      await userController.showId(mockReq, mockRes);

      expect(User.getOneById).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testUser);
    });

    it("should return an error if the user is not found", async () => {
      jest.spyOn(User, "getOneById").mockRejectedValue(new Error("User not found"));

      await userController.showId(mockReq, mockRes);

      expect(User.getOneById).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("create", () => {
    let testUser, mockReq;
    beforeEach(() => {
      testUser = {
        username: "userResident",
        first_name: "user",
        last_name: "resident",
        email: "resident@gmail.com",
        password: "password123",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "TE1 2ST",
        borough: "Redbridge",
        phone_number: "07987654432",
        user_role: "resident",
      };
      mockReq = { body: testUser };
    });

    it("should return a new user with a 201 status code", async () => {
      jest.spyOn(User, "create").mockResolvedValue(testUser);

      await userController.create(mockReq, mockRes);

      expect(User.create).toHaveBeenCalledWith(testUser);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(testUser);
    });

    it("should return an error if creation fails", async () => {
      jest.spyOn(User, "create").mockRejectedValue(new Error("Creation failed"));

      await userController.create(mockReq, mockRes);

      expect(User.create).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Creation failed" });
    });
  });

  describe("update", () => {
    let testUser, updatedData, mockReq;
    beforeEach(() => {
      testUser = {
        user_id: 1,
        username: "userResident",
        first_name: "user",
        last_name: "resident",
        email: "resident@gmail.com",
        password: "$2b$10$hashedpassword",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "TE1 2ST",
        borough: "Redbridge",
        phone_number: "07987654432",
        user_role: "resident",
      };
      updatedData = { first_name: "updatedUser" };
      mockReq = { userId: 1, body: { ...updatedData } };
    });

    it("should update a user and return it with a 200 status code", async () => {
      const testUserInstance = new User(testUser);
      jest.spyOn(User, "getOneById").mockResolvedValue(testUserInstance);
      jest.spyOn(testUserInstance, "update").mockImplementation(async (data) => ({
        ...testUser,
        ...data,
        password: "$2b$10$newhashedpassword",
      }));

      await userController.update(mockReq, mockRes);

      expect(testUserInstance.update).toHaveBeenCalledWith(expect.objectContaining(updatedData));
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ first_name: "updatedUser", user_id: 1 }));
    });

    it("should return an error if the user is not found", async () => {
      jest.spyOn(User, "getOneById").mockRejectedValue(new Error("User not found"));

      await userController.update(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("destroy", () => {
    let testUser, mockReq;
    beforeEach(() => {
      testUser = {
        user_id: 1,
        username: "userResident",
        first_name: "user",
        last_name: "resident",
        email: "resident@gmail.com",
        password: "$2b$10$hashedpassword",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "TE1 2ST",
        borough: "Redbridge",
        phone_number: "07987654432",
        user_role: "resident",
      };
      mockReq = { userId: 1 };
    });

    it("should return a 204 status code on successful deletion", async () => {
      const testUserInstance = new User(testUser);
      jest.spyOn(User, "getOneById").mockResolvedValue(testUserInstance);
      jest.spyOn(testUserInstance, "destroy").mockResolvedValue();

      await userController.destroy(mockReq, mockRes);

      expect(testUserInstance.destroy).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockEnd).toHaveBeenCalled();
    });

    it("should return an error if the user is not found", async () => {
      jest.spyOn(User, "getOneById").mockRejectedValue(new Error("User not found"));

      await userController.destroy(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("showUser", () => {
    let testUser, mockReq;
    beforeEach(() => {
      testUser = {
        user_id: 1,
        username: "userResident",
        first_name: "user",
        last_name: "resident",
        email: "resident@gmail.com",
        password: "$2b$10$hashedpassword",
        dob: "01-01-1990",
        address: "1 Test Street",
        postcode: "TE1 2ST",
        borough: "Redbridge",
        phone_number: "07987654432",
        user_role: "resident",
      };
      mockReq = { params: { id: 1 } };
    });

    it("should return a user with a 200 status code", async () => {
      jest.spyOn(User, "getOneById").mockResolvedValue(new User(testUser));

      await userController.showUser(mockReq, mockRes);

      expect(User.getOneById).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(new User(testUser));
    });

    it("should return an error if the user is not found", async () => {
      jest.spyOn(User, "getOneById").mockRejectedValue(new Error("User not found"));

      await userController.showUser(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "User not found" });
    });
  });
});
