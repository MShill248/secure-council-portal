const { Router } = require('express');

const userController = require('../controllers/user.js');
const authenticator = require("../middleware/authenticator")

const userRouter = Router()

userRouter.get('/', authenticator, userController.index)
userRouter.get('/:id', userController.showId)
userRouter.post("/", userController.create)
userRouter.patch("/:id", userController.update)
userRouter.delete("/:id", userController.destroy)

module.exports = userRouter;