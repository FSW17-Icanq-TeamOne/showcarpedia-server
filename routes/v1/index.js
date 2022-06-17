const v1 = require("express").Router()
const authentication = require("../../middleware/authentication")
const userRouter = require("./userRouter")
const registerRouter = require("./registerRouter")
const loginRouter = require("./loginRouter")
const aboutRouter = require("./AboutRouter")
const adminRouter = require("./adminRouter")
//const productRouter = require("./productRouter")
const carsRouter = require("./carsRouter")
const wishlistRouter = require("./wishlistRouter")
const chatRouter = require("./chatRouter")
const insightsRouter = require("./InsightsRouter")

v1.get("/", (req,res) => res.send("ini dari v1"))

v1.use("/register", registerRouter)
v1.use("/login", loginRouter)
v1.use("/about", aboutRouter)
v1.use(authentication)
v1.use("/user", userRouter)
v1.use("/admin", adminRouter)
//v1.use("/product", productRouter)
v1.use("/cars", carsRouter)
v1.use("/wishlist", wishlistRouter)
v1.use("/chat", chatRouter)
v1.use("/insights", insightsRouter)


module.exports= v1