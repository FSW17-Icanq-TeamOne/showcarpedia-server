const router = require("express").Router()
const v1 = require("./v1")
const authentication = require('../middleware/authentication')

router.get("/",(req,res)=> res.send("API Showcarpedia Version 1.0"))
router.get("/v1/get-collection",(req,res)=> res.send("Showcarpedia Collection List 2022"))
router.use("/v1", v1)

//Testing Auth
router.use(authentication)
router.get("/lolos",(req,res)=> res.send("lolos auth"))

module.exports = router