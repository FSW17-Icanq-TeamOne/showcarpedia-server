const userRouter = require("express").Router()
const profileRouter = require("./profileRouter")
const userAccountRouter = require("./userAccountRouter")
//userRouter.get("/", (req,res) => res.send("ini dari user"))

userRouter.use("/profile",profileRouter)
userRouter.use("/account",userAccountRouter)

module.exports = userRouter