const wishlistController = require("../../controllers/wishlistController")
const wishlistRouter = require("express").Router()

wishlistRouter.delete(
  "/delete",
  wishlistController.deleteWishlist,
  (req, res) => {
    return res.json({body: req.body})
  }
)
wishlistRouter.post("/", wishlistController.create, (req, res) => {
  return res.json({body: req.body})
})
wishlistRouter.get("/", wishlistController.getWishlists, (req, res) => {
  return res.json({body: req.body})
})
module.exports = wishlistRouter
