const request = require("supertest")
const app = require("../index")
const {sequelize} = require("../models")
const {queryInterface} = sequelize
const {hashPassword} = require("../helpers/passwordHandler")
const {generateToken} = require("../helpers/tokenHandler")

let access_token
let productId
const product = [
  {
    id: 1,
    title: "MobilAvanza",
    brand: "Toyota",
    year: 2021,
    kiloMeter: 10000,
    grade: 5,
    category: "Avanza",
    photoProducts: [
      "https://firebasestorage.googleapis.com/v0/b/react-upload-f84bf.appspot.com/o/multipleImages%2FThu%20Apr%2021%202022%2000%3A05%3A41%20GMT%2B0700%20(Western%20Indonesia%20Time)download%20(2).jpeg?alt=media&token=481d173f-2804-4c1a-ad72-44f99b62676a",
    ],
    description: "Murah Toyota Avanza",
    delete: false,
    videos: ["youtube.com"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const newProduct = {
  title: "Mobil Itu",
  brand: "Porsche",
  year: 2021,
  kiloMeter: 10000,
  grade: 5,
  category: "Porsche",
  photoProducts: [
    "https://firebasestorage.googleapis.com/v0/b/react-upload-f84bf.appspot.com/o/multipleImages%2FThu%20Apr%2021%202022%2000%3A05%3A41%20GMT%2B0700%20(Western%20Indonesia%20Time)download%20(2).jpeg?alt=media&token=481d173f-2804-4c1a-ad72-44f99b62676a",
    "https://firebasestorage.googleapis.com/v0/b/react-upload-f84bf.appspot.com/o/multipleImages%2FThu%20Apr%2021%202022%2004%3A14%3A04%20GMT%2B0700%20(Western%20Indonesia%20Time)download%20(1).jpeg?alt=media&token=8af2e7c6-663a-4019-8ff8-09efce882df1",
    "https://firebasestorage.googleapis.com/v0/b/react-upload-f84bf.appspot.com/o/multipleImages%2FThu%20Apr%2021%202022%2004%3A14%3A04%20GMT%2B0700%20(Western%20Indonesia%20Time)download%20(2).jpeg?alt=media&token=fdcc1b0f-cdc1-4531-92cf-f2a8fda8d0aa",
  ],
  description: "Murah Mobil itu",
  delete: false,
  videos: ["something.com"],
  createdAt: new Date(),
  updatedAt: new Date(),
}

beforeAll(async (done) => {
  const user = [
    {
      username: "administrator",
      role: "superAdmin",
      email: "admin@showcarpedia.com",
      password: hashPassword("administrator"),
      delete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]
  try {
    const dataUser = await queryInterface.bulkInsert("Users", user, {
      returning: true,
    })
    username = dataUser[0].username
    access_token = await generateToken({
      id: dataUser[0].id,
      email: dataUser[0].email,
      role: dataUser[0].role,
    })
    done()
  } catch (error) {
    done(error)
  }
})

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete("Users")
    await queryInterface.bulkDelete("Products")
    done()
  } catch (error) {
    done(error)
  }
})

describe("GET v1/cars", () => {
  afterEach(async (done) => {
    await queryInterface.bulkDelete("Products")
    done()
  })
  test("TEST CASE 1: GET ALL DATA SUCCESS", async (done) => {
    await queryInterface.bulkInsert("Products", product, {
      returning: true,
    })
    request(app)
      .get("/v1/cars")
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toEqual(expect.arrayContaining([]))
        done()
      })
  })
  test("TEST CASE 2: GET ALL DATA FAILED (NO DATA)", (done) => {
    request(app)
      .get("/v1/cars")
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(400)
        expect(body).toMatch("please add new product")
        done()
      })
  })
})

describe("POST v1/cars", () => {
  test("TEST 3 CREATE PRODUCT SUCCESS", (done) => {
    request(app)
      .post("/v1/cars")
      .send(newProduct)
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(201)
        expect(body).toStrictEqual({
          message: "Success",
          title: newProduct.title,
          brand: newProduct.brand,
          year: newProduct.year,
          kiloMeter: newProduct.kiloMeter,
          grade: newProduct.grade,
          category: newProduct.category,
          description: newProduct.description,
          photoProducts: newProduct.photoProducts,
          videos: newProduct.videos,
        })
        done()
      })
  })

  test("TEST 4 CREATE PRODUCT FAILED (ACCESS TOKEN)", (done) => {
    request(app)
      .post("/v1/cars")
      .send(newProduct)
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Please Login!")
        done()
      })
  })
})

describe("GET v1/cars/details/:id", () => {
  beforeEach(async (done) => {
    await queryInterface.bulkInsert("Products", product, {
      returning: true,
    })
    done()
  })
  test("TEST 5 GET CAR BY ID SUCCESS", (done) => {
    request(app)
      .get(`/v1/cars/details/${product[0].id}`)
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toStrictEqual({
          title: product[0].title,
          brand: product[0].brand,
          year: product[0].year,
          kiloMeter: product[0].kiloMeter,
          grade: product[0].grade,
          category: product[0].category,
          description: product[0].description,
          photoProducts: product[0].photoProducts,
          videos: product[0].videos,
        })
        done()
      })
  })
})

describe("PUT v1/cars/update/:id", () => {
  test("TEST 6 UPDATE CAR BY ID SUCCESS", (done) => {
    request(app)
      .put(`/v1/cars/update/${product[0].id}`)
      .send(newProduct)
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toStrictEqual({
          message: "Success",
          data: {
            title: newProduct.title,
            brand: newProduct.brand,
            year: newProduct.year,
            kiloMeter: newProduct.kiloMeter,
            grade: newProduct.grade,
            category: newProduct.category,
            description: newProduct.description,
            photoProducts: newProduct.photoProducts,
            videos: newProduct.videos,
            delete: false,
          },
        })
        done()
      })
  })
})

describe("DELETE v1/cars/delete/:id", () => {
  test("TEST 7 DELETE CAR BY ID SUCCESS", (done) => {
    request(app)
      .delete(`/v1/cars/delete/${product[0].id}`)
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Success")
        done()
      })
  })
})

describe("GET v1/cars/search", () => {
  let query = {
    mileages: 1000,
    brand: "Porsche",
    title: "Mobil Itu",
    minYear: 2021,
    grade: 5,
    category: "Porsche",
  }
  let url = "/v1/cars/search?" + new URLSearchParams(query)
  test("TEST 8 GET FILTERED CAR SUCCESS", (done) => {
    request(app)
      .get(url)
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toEqual(expect.arrayContaining([]))
        done()
      })
  })
  test("TEST 9 GET FILTERED DATA FAILED (NO MATCHED QUERIES)", (done) => {
    query.brand = "something"
    url = "/v1/cars/search?" + new URLSearchParams(query)
    request(app)
      .get(url)
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(400)
        expect(body).toMatch("data not found")
        done()
      })
  })
})

describe("GET v1/cars/make", () => {
  test("TEST 10 GET CAR MAKE", (done) => {
    request(app)
      .get("/v1/cars/make")
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toEqual(
          expect.objectContaining({
            category: expect.arrayContaining([]),
            brand: expect.arrayContaining([]),
          })
        )
        done()
      })
  })
})
