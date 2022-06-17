const { User, Profile } = require("../models")
const { hashPassword } = require("../helpers/passwordHandler")

class AdminController {

  static getAdminlists = async (req, res) => {

    const userRole = req.user.role

    try {
      if ( userRole === "superAdmin" || userRole === "admin" ){
        const user = await User.findAll({
          where: {
            role: "admin",
            delete: false
            }
        })
        res.status(201).json(user)
      }else{
        res.status(401).json({
          message: "You Not Allowed to Access This!"
        })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }

    static register = async (req, res) => {
         try {
          const userRole = req.user.role;
          if (userRole === 'superAdmin') {
            const { username, email, password } = req.body;
            const isEmailExist = await User.findOne({ where: { email } })
            if (isEmailExist) return res.status(409).json({ message: "Email is already taken" })
            const isUsernameExist = await User.findOne({ where: { username } })
            if (isUsernameExist) return res.status(409).json({ message: "Username is already exists" })
            
            const payloadUser = {
                username, email, password: hashPassword(password), role: "admin", delete: false
            }
            const user = await User.create(payloadUser)
            
            if (user) {

              const payloadProfile = {
                UserId: user.id,
                delete: false
              }

              const profile = await Profile.create(payloadProfile)

              if (profile) {
                return res.status(201).json({
                  message: "Success",
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  profile
                })
              }

            } else if (!user) {
              res.status(400).json({ message: "Bad Request" })
            }
          } else {
            res.status(401).json({ message: 'You are not supposed to be here, homie' })
          }
         } catch (error) {
             return res.status(500).json({ message: error.message })
        }
    }

    static async getEditForm(req, res) {
      const adminId = req.params.id
      const role = req.user.role
      if (role === 'superAdmin') {
        User.findByPk(adminId)
          .then((data) => {
            return res.status(201).json({
              username: data.username,
              email: data.email,
            })
          })
          .catch((err) => {
            console.log(err)
          })
        } else {
          res.status(401).json({ message: 'You are not supposed to be here, homie'})
        }
      }

    static edit = async (req, res) => {
      try {
        const role = req.user.role;
        const adminId = req.params.id
        const updatedAdmin = {
          username: req.body.username,
          email: req.body.email,
          password: hashPassword(req.body.password)
        }
  
        if (role === 'superAdmin') {
          const update = await User.update(updatedAdmin, {
            where: {
              id: adminId
            }
          })
          if (update) {
            res.status(201).json({ message: 'Updating Success' });
          }
        } else {
          res.status(401).json({ message: 'You are not supposed to be here, homie' })
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
      }
    }

    static async delete(req, res) {
      try {
        const adminId = req.params.id;
        const role = req.user.role;
        const deletedAdmin = {
          delete: true
        }
  
        if (role === 'superAdmin') {
          const deleteUser = await User.update(deletedAdmin, {
            where: {
              id: adminId
            }
          })
            if (deleteUser) {
              res.status(201).json({ message: 'User Deleted'})
            }
          const deleteProfile = await Profile.update(deletedAdmin, {
              where: {
                UserId: adminId
              }
            })
          if (deleteProfile) {
            res.status(201).json({ message: 'Profile Deleted' })
          }
        } else {
          res.status(409).json({ message: 'You are not supposed to be here, homie' });
        }
      } catch (error) {
        console.log(error)
        // res.status(500).json({ message: error });
      }
    }
 }
 module.exports = AdminController