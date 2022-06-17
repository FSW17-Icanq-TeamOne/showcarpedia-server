const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const router = require("./routes")

var corsOpts = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())

app.use(cors(corsOpts))
// app.use((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
//     // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
// })
//Routes
app.use(router)
module.exports = app
// server.listen(PORT, () => { console.log(`Listening on port http://localhost:${PORT}`)})
