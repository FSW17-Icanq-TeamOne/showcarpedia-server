const carsController = require("../../controllers/carsController");
const CarsController = require("../../controllers/carsController")
const { validatorHandler } = require("../../middleware/validatorYup")
const { createCarsSchema } = require("../../validation/authSchema.yup")
const carsRouter = require('express').Router()

//registerRouter.post("/", validatorHandler(registerUserSchema), RegisterController.register)

carsRouter.get("/", CarsController.getAllProduct, (req, res) => {
  return res.json({ body: req.body });
});
carsRouter.post("/", validatorHandler(createCarsSchema), CarsController.create, (req, res) => {
    return res.json({ body: req.body });
});
carsRouter.get("/details/:id", CarsController.getProductById, (req, res) => {
    return res.json({ body: req.body });
});
carsRouter.put("/update/:id", validatorHandler(createCarsSchema), CarsController.updateProductById, (req, res) => {
  return res.json({ body: req.body });
});
carsRouter.delete("/delete/:id", carsController.deleteProduct, (req, res) => {
  return res.json({ data: "deleted" })
})
carsRouter.get("/search",CarsController.findFilteredCar)

carsRouter.get("/make",carsController.getFilterData)
module.exports = carsRouter