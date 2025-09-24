const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const axios = require("axios")

const requestController = require("../../../controllers/request")
const User = require("../../../models/User")
const Request = require("../../../models/Request")

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}))

const mockRes = { status: mockStatus }

describe("Request controller", () => {
  beforeEach(() => jest.clearAllMocks())
  afterAll(() => jest.resetAllMocks())

    describe("index", () => {
        it("should return requests with a status code 200", async () => {
            const testRequests = ["request1", "request2"]
            jest.spyOn(Request, "getAll").mockResolvedValue(testRequests)

            await requestController.index(null, mockRes)

            expect(Request.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(testRequests)
        })

        it("should return an error upon failure", async () => {
            jest.spyOn(Request, "getAll").mockRejectedValue(new Error("Something happened to your db"))

            await requestController.index(null, mockRes)

            expect(Request.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: "Something happened to your db" })
        })
    })

    describe("showId", () => {
        let testUser, testRequest, mockReq

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
        }

        testRequest = {
            request_id: 10,
            user_id: 1,
            content: "Test request content",
        }

        mockReq = { params: { id: "10" }, username: "userResident" }
        })

        it("should return a request with a 200 status code if user owns the request", async () => {
            jest.spyOn(User, "getOneByUsername").mockResolvedValue(testUser)
            jest.spyOn(Request, "getOneById").mockResolvedValue(testRequest)

            await requestController.showId(mockReq, mockRes)

            expect(User.getOneByUsername).toHaveBeenCalledWith("userResident")
            expect(Request.getOneById).toHaveBeenCalledWith(10)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(testRequest)
        })

        it("should return 404 if user does not own the request and is not council", async () => {
            const otherRequest = { ...testRequest, user_id: 2 }
            jest.spyOn(User, "getOneByUsername").mockResolvedValue(testUser)
            jest.spyOn(Request, "getOneById").mockResolvedValue(otherRequest)

            await requestController.showId(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: "Access denied" })
        })

        it("should return 200 if user is council even if they don't own the request", async () => {
            const councilUser = { ...testUser, user_role: "council" }
            const otherRequest = { ...testRequest, user_id: 2 }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(councilUser)
            jest.spyOn(Request, "getOneById").mockResolvedValue(otherRequest)

            await requestController.showId(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(otherRequest)
        })

        it("should return 404 if User.getOneByUsername throws an error", async () => {
            jest.spyOn(User, "getOneByUsername").mockRejectedValue(new Error("User not found"))

            await requestController.showId(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: "User not found" })
        })

        it("should return 404 if Request.getOneById throws an error", async () => {
            jest.spyOn(User, "getOneByUsername").mockResolvedValue(testUser)
            jest.spyOn(Request, "getOneById").mockRejectedValue(new Error("Request not found"))

            await requestController.showId(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: "Request not found" })
        })
    })

    describe("getByUserId", () => {
        let testRequests, mockReq

        beforeEach(() => {
        testRequests = [
            { request_id: 10, user_id: 1, content: "Test request content" },
            { request_id: 11, user_id: 1, content: "Another request" },
        ]
        mockReq = { userId: 1 }
        })

        it("should return all requests for the user with a 200 status code", async () => {
            jest.spyOn(Request, "getByUserId").mockResolvedValue(testRequests)

            await requestController.getByUserId(mockReq, mockRes)

            expect(Request.getByUserId).toHaveBeenCalledWith(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(testRequests)
        })

        it("should return a 500 error if something goes wrong", async () => {
            jest.spyOn(Request, "getByUserId").mockRejectedValue(new Error("Database error"))

            await requestController.getByUserId(mockReq, mockRes)

            expect(Request.getByUserId).toHaveBeenCalledWith(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: "Database error" })
        })
    })

    describe("create", () => {
        let testUser, testRequest, mockReq

        beforeEach(() => {
            testUser = { user_id: 1, username: "userResident", user_role: "resident" }
            testRequest = { request_id: 10, user_id: 1, title: "Test title" }
            mockReq = { body: { title: "Test title" }, username: "userResident" }
        })

        it("should create a new request with a 201 status code", async () => {
            jest.spyOn(User, "getOneByUsername").mockResolvedValue(testUser)
            jest.spyOn(Request, "create").mockResolvedValue(testRequest)

            await requestController.create(mockReq, mockRes)

            expect(User.getOneByUsername).toHaveBeenCalledWith("userResident")
            expect(Request.create).toHaveBeenCalledWith({ user_id: 1, ...mockReq.body })
            expect(mockStatus).toHaveBeenCalledWith(201)
            expect(mockJson).toHaveBeenCalledWith(testRequest)
        })

        it("should return a 400 error if creation fails", async () => {
            jest.spyOn(User, "getOneByUsername").mockResolvedValue(testUser)
            jest.spyOn(Request, "create").mockRejectedValue(new Error("Creation failed"))

            await requestController.create(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockJson).toHaveBeenCalledWith({ error: "Creation failed" })
        })
    })

    describe("update", () => {
        let testRequest, updatedData, mockReq

        beforeEach(() => {
            testRequest = { request_id: 10, title: "Old title", update: jest.fn() }
            updatedData = { title: "Updated title" }
            mockReq = { params: { id: "10" }, body: { ...updatedData } }
        })

        it("should update a request and return it with a 200 status code", async () => {
            jest.spyOn(Request, "getOneById").mockResolvedValue(testRequest)
            testRequest.update.mockImplementation(async (data) => ({ ...testRequest, ...data }))

            await requestController.update(mockReq, mockRes)

            expect(Request.getOneById).toHaveBeenCalledWith(10)
            expect(testRequest.update).toHaveBeenCalledWith(expect.objectContaining({
                title: "Updated title",
                updated_at: expect.any(Date),
            }))
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ request_id: 10, title: "Updated title" }))
        })

        it("should return 404 if the request is not found", async () => {
            jest.spyOn(Request, "getOneById").mockRejectedValue(new Error("Request not found"))

            await requestController.update(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: "Request not found" })
        })
    })

    describe("destroy", () => {
        let testRequest, mockReq

        beforeEach(() => {
            testRequest = { request_id: 10, destroy: jest.fn() }
            mockReq = { params: { id: "10" } }
        })

        it("should return a 204 status code on successful deletion", async () => {
            jest.spyOn(Request, "getOneById").mockResolvedValue(testRequest)
            testRequest.destroy.mockResolvedValue()

            await requestController.destroy(mockReq, mockRes)

            expect(Request.getOneById).toHaveBeenCalledWith(10)
            expect(testRequest.destroy).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(204)
            expect(mockEnd).toHaveBeenCalled()
        })

        it("should return 404 if the request is not found", async () => {
            jest.spyOn(Request, "getOneById").mockRejectedValue(new Error("Request not found"))

            await requestController.destroy(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: "Request not found" })
        })
    })
})
