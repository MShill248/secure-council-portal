const { Router } = require('express');

const messageController = require('../controllers/message.js');
const authenticator = require('../middleware/authenticator.js');
//const authenticator = require("../middleware/authenticator")

const messageRouter = Router()

// messageRouter.get('/', authenticator, messageController.index)
messageRouter.get('/', messageController.index)
messageRouter.get('/request/:request_id', messageController.getByRequestId)
messageRouter.get('/:id', messageController.showId)
messageRouter.post("/", authenticator, messageController.create)
messageRouter.patch("/:id", authenticator, messageController.update)
messageRouter.delete("/:id", authenticator, messageController.destroy)

module.exports = messageRouter;