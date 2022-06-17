const request = require("supertest")
const app = require("../index")
const {sequelize} = require("../models")
const {queryInterface} = sequelize
const {hashPassword} = require("../helpers/passwordHandler")
const {generateToken, verifyToken} = require("../helpers/tokenHandler")

let access_token
let userId
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
  {
    id: 2,
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
  },
]

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
    await queryInterface.bulkInsert("Products", product, {returning: true})
    userId = user[0].id
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
    await queryInterface.bulkDelete("Wishlists", null, {
      cascade: true,
    })
    done()
  } catch (error) {
    done(error)
  }
})

describe("POST v1/wishlist", () => {
  test("TEST 1 CREATE WISHLIST SUCCESS", (done) => {
    request(app)
      .post("/v1/wishlist")
      .send({ProductId: product[0].id})
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toMatch("wishlist created")
        done()
      })
  })
  test("TEST 2 CREATE WISHLIST FAILED (has been created)", (done) => {
    request(app)
      .post("/v1/wishlist")
      .send({ProductId: product[0].id})
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toMatch("product has been added")
        done()
      })
  })
  test("TEST 3 CREATE WISHLIST FAILED (NO ACCESS_TOKEN)", (done) => {
    request(app)
      .post("/v1/wishlist")
      .send({ProductId: product[0].id})
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Please Login!")
        done()
      })
  })
})

describe("GET v1/wishlist", () => {
  afterEach(async (done) => {
    await queryInterface.bulkDelete("Wishlists", null, {
      cascade: true,
    })
    done()
  })
  test("TEST 4 GET WISHLIST SUCCESS", (done) => {
    request(app)
      .get("/v1/wishlist")
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              ProductId: product[0].id,
            }),
          ])
        )
        done()
      })
  })
  test("TEST 5 GET WISHLIST FAILED (NO DATA)", async (done) => {
    request(app)
      .get("/v1/wishlist")
      .set("Cookie", [`access_token=${access_token}`])
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(400)
        expect(body).toMatch("please add new product")
        done()
      })
  })
  test("TEST 6 GET WISHLIST FAILED (NO ACCESS_TOKEN)", (done) => {
    request(app)
      .get("/v1/wishlist")
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Please Login!")
        done()
      })
  })
})

describe("DELETE v1/wishlist/delete", () => {
  test("TEST 7 DELETE WISHLIST SUCCESS", (done) => {
    request(app)
      .delete("/v1/wishlist/delete")
      .set("Cookie", [`access_token=${access_token}`])
      .send({ProductId: product[0].id})
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "deleted")
        expect(body).toHaveProperty("id", product[0].id)
        done()
      })
  })
  test("TEST 8 DELETE WISHLIST FAILED (NO ACCESS_TOKEN)", (done) => {
    request(app)
      .delete("/v1/wishlist/delete")
      .send({ProductId: product[0].id})
      .end((err, res) => {
        if (err) return done(err)
        const {body, status} = res
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Please Login!")
        done()
      })
  })
})
