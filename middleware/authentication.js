const { User } = require('../models') // ini dipake nanti buat ngecek apakah usernya ada atau nggak dari token yang udah di parse
const { verifyToken } = require('../helpers/tokenHandler')

// bikin nameless module 
module.exports = async (req, res, next) => {
  try {
    const { access_token } = req.cookies;
    if (access_token) {
      const decodedData = await verifyToken(access_token)
      const findUser = await User.findOne({
        where: {
          id: decodedData.id
        }
      })
      // if (!findUser) {
      //   return res.status(404).json({ message: "Sorry the user not found" })
      // }
      req.user = decodedData
      next()
    } else {
      return res.status(404).json({ message: "Please Login!" })
    }
  } catch (error) {
    // console.log(error)
    // return res.status(500).json({ message: "There is error" })
  }
}