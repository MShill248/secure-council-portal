const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const authController = require("../../../controllers/auth")
const User = require("../../../models/User")

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({
  send: mockSend,
  json: mockJson,
  end: mockEnd,
}))

const { otpStore } = authController
otpStore["residentUser"] = {
    otp: "123456",
    expires: Date.now() - 1000, // expired
}

const mockRes = { status: mockStatus }

jest.mock("nodemailer", () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(true),
    }),
}))

describe("Auth controller", () => {
    beforeEach(() => jest.clearAllMocks())

    afterAll(() => jest.resetAllMocks())

    describe("register", () => {
        it("should return an instance of a user", async () => {
        const mockReq = {
            body: {  
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
                user_role: "resident"
            }
        }

        const mockUserResult = { 
            user_id: 1, 
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
            user_role: "resident"
        }

        jest.spyOn(User, "create").mockResolvedValue(mockUserResult)
        await authController.register(mockReq, mockRes)

        expect(User.create).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(201)
        expect(mockSend).toHaveBeenCalledWith(mockUserResult)
        })

        it("should return an error upon failure", async () => {
        jest.spyOn(User, "create").mockRejectedValue(new Error("Missing data"))

        const mockReq = {
            body: {  
                first_name: "user",
                last_name: "resident",
                email: "resident@gmail.com",
                password: "password123",
                dob: "01-01-1990",
                address: "1 Test Street",
                postcode: "TE1 2ST",
                borough: "Redbridge",
                phone_number: "07987654432",
                user_role: "resident"
            }
        }

        await authController.register(mockReq, mockRes)

        expect(User.create).toHaveBeenCalledTimes(1)
        expect(mockStatus).toHaveBeenCalledWith(400)
        expect(mockJson).toHaveBeenCalledWith({ error: "Missing data" })
        })
    })

    describe("login", () => {
        it("should return a token with successful developer login", async () => {
            const mockReq = {
                body: { 
                    username: "devUser", 
                    password: "password123" 
                },
            }

            const mockUser = {
                user_id: 1,
                username: "devUser",
                password: "hashedpass",
                user_role: "developer",
                email: "dev@gmail.com",
            }

            const mockToken = "mock.jwt.token"

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true)
            jest.spyOn(jwt, "sign").mockImplementation((payload, secret, options, callback) => {
            callback(null, mockToken)
            })

            await authController.login(mockReq, mockRes)

            expect(User.getOneByUsername).toHaveBeenCalledWith("devUser")
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                token: mockToken,
                user_id: 1,
                user_role: "developer",
            })
        })

        it("should send OTP for non-developer user", async () => {
            const mockReq = {
                body: { 
                    username: "residentUser", 
                    password: "password123" 
                },
            }

        const mockUser = {
            user_id: 2,
            username: "residentUser",
            password: "hashedpass",
            user_role: "resident",
            email: "res@gmail.com",
        }

        jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)
        jest.spyOn(bcrypt, "compare").mockResolvedValue(true)

        await authController.login(mockReq, mockRes)

        expect(User.getOneByUsername).toHaveBeenCalledWith("residentUser")
        expect(mockStatus).toHaveBeenCalledWith(200)
        expect(mockJson).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: "OTP sent to email.",
                username: "residentUser",
            })
            )
        })

        it("should return 404 if user not found", async () => {
            const mockReq = {
                body: { 
                    username: "user", 
                    password: "test" 
                } 
            }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(null)

            await authController.login(mockReq, mockRes)

            expect(User.getOneByUsername).toHaveBeenCalledWith("user")
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: "User not found" })
        })

        it("should return 401 if password does not match", async () => {
            const mockReq = { 
                body: { 
                    username: "devUser", 
                    password: "wrong" 
                } 
            }
            
            const mockUser = { 
                username: "devUser", 
                password: "hashedpass", 
                user_role: "developer" 
            }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false)

            await authController.login(mockReq, mockRes)

            expect(bcrypt.compare).toHaveBeenCalled()
            expect(mockStatus).toHaveBeenCalledWith(401)
            expect(mockJson).toHaveBeenCalledWith({ error: "Invalid credentials" })
        })

        it("should return 500 on unexpected error", async () => {
            const mockReq = { 
                body: { 
                    username: "devUser", 
                    password: "password" 
                } 
            }

            jest.spyOn(User, "getOneByUsername").mockRejectedValue(new Error("DB error"))

            await authController.login(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: "DB error" })
        })
    })

    describe("verifyOtp", () => {
        it("should return a token with valid OTP", async () => {
            const mockReqLogin = {
                body: { 
                    username: "residentUser", 
                    password: "password123" 
                },
            }

            const mockUser = {
                user_id: 2,
                username: "residentUser",
                password: "hashedpass",
                user_role: "resident",
                email: "res@gmail.com",
            }

            const mockToken = "mock.jwt.token"

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true)
            jest.spyOn(jwt, "sign").mockImplementation((payload, secret, options, callback) => {
            callback(null, mockToken)
            })

            await authController.login(mockReqLogin, mockRes)

            // Grab OTP that login stored
            const otp = Object.values(
            require("../../../controllers/auth").__getOtpStore?.() ?? {}
            )[0]?.otp // <-- not accessible, so instead we reuse spy trick:
            const otpRecord = Object.values(nodemailer.createTransport().sendMail.mock.calls)
            // But simpler: intercept sendMail call
            const sentMail = nodemailer.createTransport().sendMail.mock.calls[0][0]
            const otpFromEmail = sentMail.text.match(/\d{6}/)[0]

            const mockReqVerify = {
                body: { 
                    username: "residentUser", 
                    otp: otpFromEmail 
                },
            }

            await authController.verifyOtp(mockReqVerify, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                token: mockToken,
                user_id: 2,
                user_role: "resident",
            })
        })

        it("should return 400 if no OTP requested", async () => {
            const mockReq = { 
                body: { 
                    username: "user", 
                    otp: "123456" 
                } 
            }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue({
            user_id: 99,
            username: "user",
            user_role: "resident",
            password: "hash",
            })

            await authController.verifyOtp(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockJson).toHaveBeenCalledWith({
            error: "No OTP requested for this user",
            })
        })

        it("should return 401 if OTP is invalid", async () => {
            const mockReqLogin = {
                body: { 
                    username: "residentUser", 
                    password: "password123" 
                },
            }

            const mockUser = {
                user_id: 2,
                username: "residentUser",
                password: "hashedpass",
                user_role: "resident",
                email: "res@gmail.com",
            }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true)

            await authController.login(mockReqLogin, mockRes)

            const mockReqVerify = {
                body: { 
                    username: "residentUser", 
                    otp: "wrongotp" 
                },
            }

            await authController.verifyOtp(mockReqVerify, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(401)
            expect(mockJson).toHaveBeenCalledWith({ error: "Invalid OTP" })
        })

        it("should return 400 if OTP expired", async () => {
            const mockReqVerify = {
                body: { 
                    username: "residentUser", 
                    otp: "123456" 
                },
            }

            otpStore["residentUser"] = {
                otp: "123456",
                expires: Date.now() - 1000, // expired
            }

            const mockUser = {
                user_id: 2,
                username: "residentUser",
                password: "hashedpass",
                user_role: "resident",
                email: "res@gmail.com",
            }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)

            await authController.verifyOtp(mockReqVerify, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockJson).toHaveBeenCalledWith({ error: "OTP expired" })
        })


        it("should return 500 on unexpected error", async () => {
            const mockReq = { 
                body: { 
                    username: "residentUser", 
                    otp: "123456" 
                } 
            }

            jest.spyOn(User, "getOneByUsername").mockRejectedValue(new Error("DB fail"))

            await authController.verifyOtp(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: "DB fail" })
        })
    })

    describe("sendOtp", () => {
        it("should send an OTP successfully", async () => {
            const mockReq = {
                body: { 
                    username: "residentUser" 
                },
            }

            const mockUser = {
                user_id: 1,
                username: "residentUser",
                email: "resident@gmail.com",
            }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)

            await authController.sendOtp(mockReq, mockRes)

            expect(User.getOneByUsername).toHaveBeenCalledWith("residentUser")

            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: "OTP sent to email.",
                    username: "residentUser",
                })
            )

            expect(authController.otpStore["residentUser"]).toHaveProperty("otp")
            expect(authController.otpStore["residentUser"]).toHaveProperty("expires")
        })

        it("should return 400 if username is missing", async () => {
            const mockReq = { 
                body: {} 
            }

            await authController.sendOtp(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockJson).toHaveBeenCalledWith({ error: "Username is required" })
        })

        it("should return 404 if user is not found", async () => {
            const mockReq = { 
                body: { 
                    username: "unknown" 
                } 
            }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(null)

            await authController.sendOtp(mockReq, mockRes)

            expect(User.getOneByUsername).toHaveBeenCalledWith("unknown")
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: "User not found" })
        })

        it("should return 500 on transporter/sendMail failure", async () => {
            const mockReq = { 
                body: { 
                    username: "residentUser" 
                } 
            }
            
            const mockUser = { 
                user_id: 1, 
                username: "residentUser", 
                email: "resident@gmail.com" 
            }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)

            const sendMailMock = jest.fn().mockRejectedValue(new Error("SMTP error"))
            nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

            await authController.sendOtp(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: "Failed to send OTP" })
        })
    })

    describe("verifyPassword", () => {
        it("should return a token if username and password are correct", async () => {
            const mockReq = {
                body: { 
                    username: "residentUser", 
                    password: "password123" 
                },
            }

            const mockUser = {
                user_id: 1,
                username: "residentUser",
                password: "hashedpass",
            }

            const mockToken = "mock.jwt.token"

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, "compare").mockResolvedValue(true)
            jest.spyOn(jwt, "sign").mockReturnValue(mockToken)

            await authController.verifyPassword(mockReq, mockRes)

            expect(User.getOneByUsername).toHaveBeenCalledWith("residentUser")
            expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedpass")
            expect(jwt.sign).toHaveBeenCalledWith(
                { username: "residentUser", userId: 1 },
                process.env.SECRET_TOKEN,
                { expiresIn: "5m" }
            )
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith({ success: true, token: mockToken })
        })

        it("should return 400 if username or password is missing", async () => {
            const mockReq = { 
                body: { 
                    username: "residentUser" 
                } 
            }

            await authController.verifyPassword(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockJson).toHaveBeenCalledWith({ error: "Username and password are required" })
        })

        it("should return 404 if user is not found", async () => {
            const mockReq = { body: { username: "unknown", password: "password123" } }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(null)

            await authController.verifyPassword(mockReq, mockRes)

            expect(User.getOneByUsername).toHaveBeenCalledWith("unknown")
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: "User not found" })
        })

        it("should return 401 if password does not match", async () => {
            const mockReq = { 
                body: { 
                    username: "residentUser", 
                    password: "wrongpass" 
                } 
            }
            
            const mockUser = { 
                username: "residentUser", 
                password: "hashedpass" 
            }

            jest.spyOn(User, "getOneByUsername").mockResolvedValue(mockUser)
            jest.spyOn(bcrypt, "compare").mockResolvedValue(false)

            await authController.verifyPassword(mockReq, mockRes)

            expect(bcrypt.compare).toHaveBeenCalledWith("wrongpass", "hashedpass")
            expect(mockStatus).toHaveBeenCalledWith(401)
            expect(mockJson).toHaveBeenCalledWith({ error: "Current password incorrect" })
        })

        it("should return 500 on unexpected error", async () => {
            const mockReq = { 
                body: { 
                    username: "residentUser", 
                    password: "password123" 
                } 
            }

            jest.spyOn(User, "getOneByUsername").mockRejectedValue(new Error("DB error"))

            await authController.verifyPassword(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: "DB error" })
        })
    })

    describe("sendPdf", () => {
        it("should send a PDF successfully", async () => {
            const mockFile = { buffer: Buffer.from("test pdf content") }
            const mockReq = {
                file: mockFile,
                body: { email: "user@example.com" },
            }

            const mockSendMail = jest.fn().mockResolvedValue(true)
            const mockTransporter = { sendMail: mockSendMail }
            jest.spyOn(nodemailer, "createTransport").mockReturnValue(mockTransporter)

            await authController.sendPdf(mockReq, mockRes)

            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                tls: { rejectUnauthorized: false },
            })

            expect(mockSendMail).toHaveBeenCalledWith({
                from: process.env.EMAIL_USER,
                to: "user@example.com",
                subject: "Your Request Details PDF",
                text: "Attached below is a PDF copy of your request details.",
                attachments: [
                    { filename: "request-details.pdf", content: mockFile.buffer },
                ],
            })

            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                message: "PDF emailed successfully.",
            })
        })

        it("should return 400 if no file uploaded", async () => {
            const mockReq = { file: null, body: { email: "user@example.com" } }

            await authController.sendPdf(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockJson).toHaveBeenCalledWith({ error: "No PDF uploaded" })
        })

        it("should return 400 if email is missing", async () => {
            const mockReq = { file: { buffer: Buffer.from("pdf") }, body: {} }

            await authController.sendPdf(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockJson).toHaveBeenCalledWith({ error: "Email is required" })
        })

        it("should return 500 on unexpected error", async () => {
            const mockReq = {
                file: { buffer: Buffer.from("pdf") },
                body: { email: "user@example.com" },
            }

            const mockSendMail = jest.fn().mockRejectedValue(new Error("SMTP error"))
            jest.spyOn(nodemailer, "createTransport").mockReturnValue({ sendMail: mockSendMail })

            await authController.sendPdf(mockReq, mockRes)

            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: "Failed to send PDF" })
        })
    })
})