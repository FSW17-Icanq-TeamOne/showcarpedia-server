const InsightsRouter = require("express").Router()
const {InsightsController} = require("../../controllers")

InsightsRouter.get("/usersTotal", InsightsController.getTotalUsers)
InsightsRouter.get("/adminsTotal", InsightsController.getTotalAdmins)
InsightsRouter.get("/collectionsTotal", InsightsController.getTotalCollections)
InsightsRouter.get("/topWishlists", InsightsController.getTopWishlists)
module.exports = InsightsRouter