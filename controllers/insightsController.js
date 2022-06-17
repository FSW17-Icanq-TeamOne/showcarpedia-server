const { User, Product, Wishlist, sequelize } = require("../models")

class InsightsController {

    static async getTotalUsers(req, res) {
        const totalUsers = await User.count({
            where: {
                role: "user",
                delete: "f"
            }
        })
        return res.status(201).json({
            usersTotal: totalUsers
        })
    }

    static async getTotalAdmins(req, res) {
        const totalAdmins = await User.count({
            where: {
                role: "admin",
                delete: "f"
            }
        })
        return res.status(201).json({
            adminsTotal: totalAdmins
        })
    }

    static async getTotalCollections(req, res) {
        const totalCollections = await Product.count({
            where: {
                delete: "f"
            }
        })
        return res.status(201).json({
            collectionsTotal: totalCollections
        })
    }

    static async getTopWishlists(req, res) {
        const topWishlists = await Wishlist.findAll({
            attributes:[
                [sequelize.fn('count', sequelize.col('ProductId')), 'total'],
            ],
            include: [
                {
                  model: Product,
                  attributes: ["brand"],
                  required: false
                }
            ],
            group: [
                'Product.brand'
            ],
            raw: true,
            order: sequelize.literal('total'),
            limit: 5
        })
        
        return res.status(201).json({
            topWishlists
        })

    }
}

module.exports = InsightsController