const { Router } = require('express')

const requestController = require('../controllers/request')

const requestRouter = Router()

requestRouter.get("/", requestController.index)
requestRouter.get("/recent", requestController.getByRecent)
requestRouter.get("/user/:user_id", requestController.getByUserId)
requestRouter.get("/status/:status", requestController.getByStatus)
requestRouter.get("/priority/:priority", requestController.getByPriority)
requestRouter.get("/:id", requestController.showId)
requestRouter.post("/", requestController.create)
requestRouter.patch("/:id", requestController.update)
requestRouter.delete("/:id", requestController.destroy)

module.exports = requestRouter;