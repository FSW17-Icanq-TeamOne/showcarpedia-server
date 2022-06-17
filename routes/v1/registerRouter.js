const RegisterController = require("../../controllers/registerController")
const { validatorHandler } = require("../../middleware/validatorYup")
const { registerUserSchema } = require("../../validation/authSchema.yup")
const registerRouter = require('express').Router()

//registerRouter.post("/", validatorHandler(registerUserSchema), RegisterController.register)

registerRouter.post("/", validatorHandler(registerUserSchema), RegisterController.register, (req, res) => {
    // return res.json({ body: req.body });
  });

  module.exports = registerRouter