const messageController = require("../../../controllers/message");
const Message = require("../../../models/Message");
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

describe("Message controller", () => {
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());

  describe("index", () => {
    it("should return messages with a status code 200", async () => {
      const testMessages = ["message1", "message2"];
      jest.spyOn(Message, "getAll").mockResolvedValue(testMessages);

      await messageController.index(null, mockRes);

      expect(Message.getAll).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(testMessages);
    });

    it("should return an error upon failure", async () => {
      jest
        .spyOn(Message, "getAll")
        .mockRejectedValue(new Error("Something happened to your db"));

      await messageController.index(null, mockRes);

      expect(Message.getAll).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        error: "Something happened to your db",
      });
    });
  });

  describe("showId", () => {
    let testMessage, mockReq;

    beforeEach(() => {
      testMessage = {
        message_id: 1,
        request_id: 1,
        sender_id: 1,
        receiver_id: 2,
        content: "message",
        timestamp: new Date(),
      };
      mockReq = { params: { id: 1 } };
    });

    it("should return a message with a 200 status code", async () => {
      jest
        .spyOn(Message, "getOneById")
        .mockResolvedValue(new Message(testMessage));

      await messageController.showId(mockReq, mockRes);

      expect(Message.getOneById).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(new Message(testMessage));
    });

    it("should return an error if the message is not found", async () => {
      jest
        .spyOn(Message, "getOneById")
        .mockRejectedValue(new Error("Message not found"));

      await messageController.showId(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Message not found" });
    });
  });

  describe("getByRequestId", () => {
    let testMessage, mockReq;

    beforeEach(() => {
      testMessage = {
        message_id: 1,
        request_id: 1,
        sender_id: 1,
        receiver_id: 2,
        content: "message",
        timestamp: new Date(),
      };
      mockReq = { params: { request_id: 1 } };
    });

    it("should return a message with a 200 status code", async () => {
      jest
        .spyOn(Message, "getByRequestId")
        .mockResolvedValue(new Message(testMessage));

      await messageController.getByRequestId(mockReq, mockRes);

      expect(Message.getByRequestId).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(new Message(testMessage));
    });

    it("should return an error if the message is not found", async () => {
      jest
        .spyOn(Message, "getByRequestId")
        .mockRejectedValue(new Error("Message not found"));

      await messageController.getByRequestId(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: "Message not found" });
    });
  });

  describe("create", () => {
    let testMessage, mockReq;

    beforeEach(() => {
      testMessage = {
        message_id: 1,
        request_id: 1,
        sender_id: 1,
        receiver_id: 2,
        content: "message",
        timestamp: new Date(),
      };
      mockReq = { body: testMessage, username: "userResident" };
    });

    it("should return a new message with a 201 status code", async () => {
      const mockUser = { user_id: 1, username: "userResident" };
      const createdMessage = { ...testMessage, sender_id: mockUser.user_id };

      jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser);
      jest.spyOn(Message, "create").mockResolvedValue(createdMessage);

      await messageController.create(mockReq, mockRes);

      expect(User.getOneByUsername).toHaveBeenCalledWith("userResident");
      expect(Message.create).toHaveBeenCalledWith({
        ...testMessage,
        sender_id: 1,
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(createdMessage);
    });

    it("should return an error if creation fails", async () => {
      jest
        .spyOn(User, "getOneByUsername")
        .mockResolvedValue({ user_id: 1, username: "userResident" });
      jest
        .spyOn(Message, "create")
        .mockRejectedValue(new Error("Creation failed"));

      await messageController.create(mockReq, mockRes);

      expect(Message.create).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: "Creation failed" });
    });
  });

  describe("update", () => {
    let testMessage, updatedData, mockReq;

    beforeEach(() => {
      testMessage = {
        message_id: 1,
        request_id: 1,
        sender_id: 1,
        receiver_id: 2,
        content: "Original message",
        timestamp: new Date("2025-01-01T12:00:00Z"),
      };
      updatedData = { content: "Updated message" };
      mockReq = {
        params: { id: 1 },
        body: updatedData,
        username: "userResident",
      };
    });

    it("should update a message and return it with a 200 status code", async () => {
      const testMessageInstance = new Message(testMessage);
      const mockUser = { user_id: 1, username: "userResident" };

      jest.spyOn(Message, "getOneById").mockResolvedValue(testMessageInstance);
      jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser);
      jest
        .spyOn(testMessageInstance, "update")
        .mockImplementation(async (data) => ({ ...testMessage, ...data }));

      await messageController.update(mockReq, mockRes);

      expect(testMessageInstance.update).toHaveBeenCalledWith(
        expect.objectContaining(updatedData)
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({ content: "Updated message", message_id: 1 })
      );
    });

    it("should return an error if user is not permitted", async () => {
      const testMessageInstance = new Message(testMessage);
      const mockUser = { user_id: 99, username: "otherUser" };

      jest.spyOn(Message, "getOneById").mockResolvedValue(testMessageInstance);
      jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser);

      await messageController.update(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: "User not permitted to update this message",
      });
    });

    it("should return an error if message not found", async () => {
      jest
        .spyOn(Message, "getOneById")
        .mockRejectedValue(new Error("Message not found"));

      await messageController.update(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Message not found" });
    });
  });

  describe("destroy", () => {
    let testMessage, mockReq;

    beforeEach(() => {
      testMessage = {
        message_id: 1,
        request_id: 1,
        sender_id: 1,
        receiver_id: 2,
        content: "Original message",
        timestamp: new Date("2025-01-01T12:00:00Z"),
      };
      mockReq = { params: { id: 1 }, username: "userResident" };
    });

    it("should return a 204 status code on successful deletion", async () => {
      const testMessageInstance = new Message(testMessage);
      const mockUser = { user_id: 1, username: "userResident" };

      jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser);
      jest.spyOn(Message, "getOneById").mockResolvedValue(testMessageInstance);
      jest.spyOn(testMessageInstance, "destroy").mockResolvedValue();

      await messageController.destroy(mockReq, mockRes);

      expect(testMessageInstance.destroy).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(204);
      expect(mockEnd).toHaveBeenCalled();
    });

    it("should return an error if user not permitted", async () => {
      const testMessageInstance = new Message(testMessage);
      const mockUser = { user_id: 99, username: "otherUser" };

      jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser);
      jest.spyOn(Message, "getOneById").mockResolvedValue(testMessageInstance);

      await messageController.destroy(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        error: "You are not permitted to delete this message",
      });
    });

    it("should return an error if message not found", async () => {
      const mockUser = { user_id: 1, username: "userResident" };

      jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser);
      jest
        .spyOn(Message, "getOneById")
        .mockRejectedValue(new Error("Message not found"));

      await messageController.destroy(mockReq, mockRes);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ error: "Message not found" });
    });
  });
});
