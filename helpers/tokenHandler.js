require('dotenv').config()
const jwt = require('jsonwebtoken');

const generateToken = async (payload) => {
  return await jwt.sign(payload, process.env.SECRET_KEY)
}

const verifyToken = async (token) => {
  return await jwt.verify(token, process.env.SECRET_KEY)
}

module.exports = {
    generateToken,
    verifyToken
} 