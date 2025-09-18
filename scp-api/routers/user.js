const { Router } = require('express');

const userController = require('../controllers/user.js');
const authenticator = require("../middleware/authenticator")

const userRouter = Router()

// userRouter.get('/', authenticator, userController.index)
userRouter.get('/', userController.index)
userRouter.get('/account', authenticator, userController.showId)
userRouter.post("/", userController.create)
userRouter.patch("/update", authenticator, userController.update)
userRouter.delete("/delete", authenticator, userController.destroy)

module.exports = userRouter;