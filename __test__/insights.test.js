const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/passwordHandler")
const { generateToken } = require("../helpers/tokenHandler")

let access_token;
let userRole;

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
      {
        username: "jeremiah",
        email: "jeremiah@showcarpedia.com",
        password: hashPassword("jeremiah"),
        role: "admin",
        delete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "caca",
        email: "caca@showcarpedia.com",
        password: hashPassword("caca12345"),
        role: "user",
        delete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const collection = [
      {
        title: "BMW 2015",
        brand: "BMW",
        year: 2021,
        kiloMeter: 10000,
        grade: 5,
        category: "Convertible",
        description: "The 2015 Convertible BMW",
        photoProducts: [
          "https://firebasestorage.googleapis.com/v0/b/react-upload-f84bf.appspot.com/o/multipleImages%2FThu%20Apr%2021%202022%2000%3A05%3A41%20GMT%2B0700%20(Western%20Indonesia%20Time)download%20(2).jpeg?alt=media&token=481d173f-2804-4c1a-ad72-44f99b62676a",
          "https://firebasestorage.googleapis.com/v0/b/react-upload-f84bf.appspot.com/o/multipleImages%2FThu%20Apr%2021%202022%2004%3A14%3A04%20GMT%2B0700%20(Western%20Indonesia%20Time)download%20(1).jpeg?alt=media&token=8af2e7c6-663a-4019-8ff8-09efce882df1",
          "https://firebasestorage.googleapis.com/v0/b/react-upload-f84bf.appspot.com/o/multipleImages%2FThu%20Apr%2021%202022%2004%3A14%3A04%20GMT%2B0700%20(Western%20Indonesia%20Time)download%20(2).jpeg?alt=media&token=fdcc1b0f-cdc1-4531-92cf-f2a8fda8d0aa"
        ],
        videos: [
          "https://www.youtube.com/watch?v=N0lWGCQasqM",
        ],
        delete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "BMW 2022",
        brand: "BMW",
        year: 2021,
        kiloMeter: 10000,
        grade: 5,
        category: "Coupe",
        description: "The new BMW 2022",
        photoProducts: [
          "https://firebasestorage.googleapis.com/v0/b/react-upload-f84bf.appspot.com/o/multipleImages%2FThu%20Apr%2021%202022%2000%3A05%3A41%20GMT%2B0700%20(Western%20Indonesia%20Time)download%20(2).jpeg?alt=media&token=481d173f-2804-4c1a-ad72-44f99b62676a"
        ],
        videos: [
          "https://www.youtube.com/watch?v=3N3qYZCMVYM",
          "https://www.youtube.com/watch?v=6JnuEBRDtvA"
        ],
        delete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
   
    try {
      const dataUser = await queryInterface.bulkInsert("Users", user, {
        returning: true,
      })
      
      username = dataUser[0].username;
      userRole = dataUser[0].role;
      access_token = await generateToken({
        id: dataUser[0].id,
        email: dataUser[0].email,
        role: dataUser[0].role,
      });
      
      const dataCollection = await queryInterface.bulkInsert("Products", collection, {
        returning: true,
      });

      await queryInterface.bulkInsert("Wishlists", 
          [
            {
              UserId: dataUser[0].id,
              ProductId: dataCollection[0].id,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              UserId: dataUser[0].id,
              ProductId: dataCollection[1].id,
              createdAt: new Date(),
              updatedAt: new Date()
            },
          ], {
            returning: true
      })

      done();
    } catch (error) {
      done(error);
    }
    console.log(access_token, "Tokennya nih")
});

  afterAll(async (done) => {
    try {
      await queryInterface.bulkDelete("Users", null, {
        cascade: true,
      });
      await queryInterface.bulkDelete("Products", null, {
        cascade: true,
      });
      await queryInterface.bulkDelete("Wishlists");
      done();
    } catch (error) {
      done(error);
    }
});

describe("GET /v1/insights/usersTotal", () => {
    test("TEST CASE 1: Get Insights of Users Total Data", (done) => {
      request(app)
        .get("/v1/insights/usersTotal")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("usersTotal", expect.any(Number));
          done();
        });
    });
  });

  describe("GET /v1/insights/adminsTotal", () => {
    test("TEST CASE 1: Get Insights of Admins Total Data", (done) => {
      request(app)
        .get("/v1/insights/adminsTotal")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("adminsTotal", expect.any(Number));
          done();
        });
    });
  });

  describe("GET /v1/insights/collectionsTotal", () => {
    test("TEST CASE 1: Get Insights of Users Total Data", (done) => {
      request(app)
        .get("/v1/insights/collectionsTotal")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("collectionsTotal", expect.any(Number));
          done();
        });
    });
  });

  describe("GET /v1/insights/topWishlists", () => {
    test("TEST CASE 2: Get Insights of Top Wishlists Data", (done) => {
      request(app)
        .get("/v1/insights/topWishlists")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          done();
        });
    });
  });

  describe("GET /v1/insights/adminsTotal", () => {
    test("TEST CASE 3: Get Insights of Admins Total Data - Access Token Blank", (done) => {
      request(app)
        .get("/v1/insights/adminsTotal")
        .set("Cookie", [`access_token=${" "}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(404);
          done();
        });
    });
  });