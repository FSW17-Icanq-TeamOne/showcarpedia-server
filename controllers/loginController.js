const { User, RoomLists } = require("../models")
const { verifyPassword } = require("../helpers/passwordHandler")
const { generateToken } = require("../helpers/tokenHandler")

class AuthController {
    static login = async (req, res, next) => {
        try {
            let room = null;
            const { username, password } = req.body
            const user = await User.findOne({
                where: {
                username: username
                }
            })
            const userRole = user.role
            
            if ( userRole === "user"){
                room = await RoomLists.findOne({
                    where: {
                    UserId: user.id
                    }
                })
            }

            const isPasswordMatch = await verifyPassword(password, user.password)

            if (!isPasswordMatch) {
                return res.status(409).json({ message: "Wrong Password" })
            }

            const access_token = await generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
                Room: room?.id
            })

            res.cookie("access_token", access_token, {
                httpOnly: true
            })
            
            return res.status(200).json( { 
                id: user.id,
                role: user.role,
                access_token: access_token,
                Room: room?.id,
                message: "Success"
            } )
        } catch (error) {
            // return res.status(500).json( { message: error.message } )
        }
    }
}
module.exports = AuthController