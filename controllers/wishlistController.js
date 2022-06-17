const {Wishlist, Product, User} = require("../models")

class wishlistController {
  static create = async (req, res) => {
    const user = req.user
    const {ProductId} = req.body
    const payloadWishlist = {
      ProductId,
      UserId: user.id,
    }
    try {
      const checkProduct = await Wishlist.findOne({
        where: payloadWishlist,
      })

      if (checkProduct) {
        return res.status(200).json("product has been added")
      } else {
        await Wishlist.create(payloadWishlist)
        return res.status(200).json("wishlist created")
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      })
    }
  }

  static async getWishlists(req, res) {
    const user = req.user
    try {
      const data = await Wishlist.findAll({
        where: {
          UserId: user.id,
        },
        order: [["id", "ASC"]],
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Product,
          },
        ],
      })
      if (!data.length) return res.status(400).json("please add new product")
      return res.status(200).json(data)
    } catch (error) {
      throw error
    }
  }

  // static async getProductById(req, res){
  //     try{
  //         const { idProduct } = req.params
  //         const data = await Product.findByPk(idProduct)
  //         if (data){
  //             return res.status(200).json({
  //                 result: "Success",
  //                 data: data
  //             });
  //         }
  //     } catch (error){
  //         throw error
  //     }
  // }

  // static async updateProductById(req, res){
  //     try{
  //         const { id } = req.params
  //         const {
  //             title,
  //             brand,
  //             year,
  //             kiloMeter,
  //             grade,
  //             category,
  //             description,
  //             photoProduct
  //         } = req.body
  //         const updateDataCars = {
  //             title,
  //             brand,
  //             year,
  //             kiloMeter,
  //             grade,
  //             category,
  //             description,
  //             delete: false,
  //             photoProduct
  //         }
  //         const data = await Product.update(updateDataCars, { where: { id: id } })
  //         if (data == 1){
  //             return res.status(200).json({
  //                 message: "updated!",
  //                 data: req.body
  //             })
  //         }
  //     } catch (error){
  //         throw error
  //     }
  // }
  static async deleteWishlist(req, res) {
    try {
      const {ProductId} = req.body
      const user = req.user
      await Wishlist.destroy({
        where: {
          UserId: user.id,
          ProductId: Number(ProductId),
        },
      })
      return res.status(200).json({
        message: "deleted",
        id: ProductId,
      })
    } catch (error) {
      throw error.message
    }
  }
}
module.exports = wishlistController
