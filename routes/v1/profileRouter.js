const profileRouter = require("express").Router()
const {ProfileController} = require("../../controllers")
const { validatorHandler } = require("../../middleware/validatorYup")
const { profileSchema } = require("../../validation/authSchema.yup")

profileRouter.get("/", ProfileController.readProfile)
profileRouter.put("/", validatorHandler(profileSchema),ProfileController.updateProfile)

module.exports = profileRouter
