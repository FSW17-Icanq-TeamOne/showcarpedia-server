const AdminController = require("../../controllers/adminController")
const { validatorHandler } = require("../../middleware/validatorYup")
const { registerUserSchema } = require("../../validation/authSchema.yup")
const adminRouter = require('express').Router()

adminRouter.get("/", AdminController.getAdminlists, (req, res) => {
  // return res.json({ message: "Success get Admin Lists" });
});

adminRouter.post("/register", validatorHandler(registerUserSchema), AdminController.register, (req, res) => {
    // return res.json({ body: req.body });
  });

adminRouter.put("/edit/:id", validatorHandler(registerUserSchema), AdminController.edit, (req, res) => {
    // return res.json({ body: req.body });
  });

adminRouter.get("/edit/:id", AdminController.getEditForm, (req, res) => {
    // return res.json({ body: req.body });
  });

adminRouter.delete("/delete/:id", AdminController.delete, (req, res) => {
    // return res.json({ message: "Success to Delete" });
  });

  module.exports = adminRouter