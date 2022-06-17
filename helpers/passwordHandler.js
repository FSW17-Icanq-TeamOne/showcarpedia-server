const bcrypt = require('bcrypt')
const salt =  10

const hashPassword = (password) => {
  return bcrypt.hashSync(password, parseInt(salt))
}

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

module.exports = {
  hashPassword,
  verifyPassword
} 