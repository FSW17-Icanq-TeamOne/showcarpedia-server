const LoginController = require("../../controllers/loginController")
const { validatorHandler } = require("../../middleware/validatorYup")
const { loginUserSchema } = require("../../validation/authSchema.yup")
const loginRouter = require('express').Router()

loginRouter.post("/", validatorHandler(loginUserSchema),LoginController.login)

module.exports = loginRouter