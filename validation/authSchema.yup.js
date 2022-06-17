const yup = require("yup")

const registerUserSchema = yup.object({
    body: yup.object({
        email: yup.string().required(),
        username: yup.string().min(5).max(20).required(),
        password: yup.string().min(5).required()
    })
})
  
  const loginUserSchema = yup.object({
    body: yup.object({
        username: yup.string().required(),
        password: yup.string().min(5).required()
    })
  })

  const createCarsSchema = yup.object({
    body: yup.object({
        title: yup.string().required(),
        brand: yup.string().min(2).required(),
        year: yup.string().min(4).required(),
        kiloMeter: yup.string().required(),
        grade: yup.string().min(1).required(),
        category: yup.string().required(),
        description: yup.string().min(10).required(),
        year: yup.string().min(4).required(),
    })
  })
  
  const profileSchema = yup.object({
    body: yup.object({
      fullName: yup.string().min(5).max(20).required(),
      birthDate:yup.date().required(),
      city:yup.string().required(),
      country: yup.string().required(),
      mobilePhone: yup.string().required()
    })
  })
module.exports = { registerUserSchema, loginUserSchema, profileSchema, createCarsSchema }  