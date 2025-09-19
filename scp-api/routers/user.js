const { Router } = require('express');

const userController = require('../controllers/user.js');
const authenticator = require("../middleware/authenticator")

const userRouter = Router()

// userRouter.get('/', authenticator, userController.index)
userRouter.get('/', userController.index)
userRouter.get('/account', authenticator, userController.showId)
userRouter.get('/:id', userController.showUser)
userRouter.post("/", userController.create)
userRouter.patch("/update", authenticator, userController.update)
userRouter.delete("/delete", authenticator, userController.destroy)
userRouter.delete("/:id", userController.adminDestroy)
// userRouter.post("/otp", userController.sendOtp)
// userRouter.post("/updateEmail", userController.updateEmail)

module.exports = userRouter;