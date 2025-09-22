const { Router } = require('express');

const authController = require('../controllers/auth.js');

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/verify", authController.verifyOtp)
authRouter.post("/sendOtp", authController.sendOtp)

module.exports = authRouter;