const userAccountRouter = require("express").Router()
const { UserController } = require("../../controllers")
const { validatorHandler } = require("../../middleware/validatorYup")
const { registerUserSchema } = require("../../validation/authSchema.yup")

userAccountRouter.get("/", UserController.getEditForm)
userAccountRouter.put("/", validatorHandler(registerUserSchema),UserController.edit)

module.exports = userAccountRouter
