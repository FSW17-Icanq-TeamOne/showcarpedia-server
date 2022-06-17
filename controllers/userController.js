const { User } = require("../models")
const { hashPassword } = require("../helpers/passwordHandler")

class UserController {

    static async getEditForm(req, res) {
      const adminId = req.user.id
      User.findByPk(adminId)
        .then((data) => {
          return res.status(201).json({
            username: data.username,
            email: data.email,
          })
        })
        // .catch((err) => {
        //   console.log(err)
        // })
    }

    static async edit(req, res) {
      const adminId = req.user.id
      let updatedAdmin = {
        username: req.body.username,
        email: req.body.email,
        password: hashPassword(req.body.password)
      }
      User.update(updatedAdmin, {
        where: {
          id: adminId
        }
      })
        .then(() => {
          res.status(201).json({message: "Success"})
        })
        // .catch((err) => {
        //   console.log(err)
        // })
    }
 }
 module.exports = UserController