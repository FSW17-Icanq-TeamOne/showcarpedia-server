const { Profile } = require("../models");

class ProfileController {
  
  static async readProfile(req, res) {
    const UserId = req.user.id;
    try {
      // if (!UserId) return res.json("user not found");
      const data = await Profile.findOne({ where: { UserId } });
      res.status(200).json(data);
    } catch (error) {
      // throw error;
    }
  }
  static async updateProfile(req,res){
    //console.log("Hi")
    const UserId = req.user.id;
    const { fullName, birthDate, city, country, mobilePhone, profilePicture} = req.body

    const payload = {
        fullName,
        birthDate,
        city,
        country,
        mobilePhone,
        profilePicture,
      updateAt: new Date()}

    try {
        // if(!UserId) return res.json("user not found")
        await Profile.update(payload,{where:{UserId}})
        res.status(200).json(
          {
            message: "Success"
          }
        )
    } catch (error) {
        // throw error
    }
  }
}

module.exports = ProfileController;
