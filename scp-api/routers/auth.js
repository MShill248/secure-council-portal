const { Router } = require('express');
const multer = require('multer');
const upload = multer();

const authController = require('../controllers/auth.js');

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/verify", authController.verifyOtp)
authRouter.post("/sendOtp", authController.sendOtp)
authRouter.post("/verifyPassword", authController.verifyPassword)
authRouter.post('/sendPdf', upload.single('file'), authController.sendPdf)

module.exports = authRouter;