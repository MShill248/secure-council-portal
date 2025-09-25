const { Router } = require("express");

const requestController = require("../controllers/request");
const authenticator = require("../middleware/authenticator");

const requestRouter = Router();

requestRouter.get("/", requestController.index)
requestRouter.get("/recent", requestController.getByRecent)
requestRouter.get("/user", authenticator, requestController.getByUserId)
requestRouter.get("/borough", authenticator, requestController.getByBorough)
//requestRouter.get("/status/:status", requestController.getByStatus)
//requestRouter.get("/priority/:priority", requestController.getByPriority)
requestRouter.get("/category/:category", requestController.getByCategory)
requestRouter.post("/requestInfo", requestController.salesInfo)
requestRouter.get("/:id", authenticator, requestController.showId)
requestRouter.post("/", authenticator, requestController.create)
requestRouter.post("/:id", requestController.mockCreate)
requestRouter.patch("/:id", requestController.update)
requestRouter.delete("/:id", requestController.destroy)

module.exports = requestRouter;
