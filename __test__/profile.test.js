const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/passwordHandler")
const { generateToken } = require("../helpers/tokenHandler")

let access_token;
let userRole;

beforeAll(async (done) => {
    const admin = [
      {
        username: "caca",
        email: "caca@showcarpedia.com",
        password: hashPassword("caca12345"),
        role: "user",
        delete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    try {
      const dataAdmin = await queryInterface.bulkInsert("Users", admin, {
        returning: true,
      });
 
      userRole = dataAdmin[0].role;
      access_token = await generateToken({
        id: dataAdmin[0].id,
        email: dataAdmin[0].email,
        role: dataAdmin[0].role,
      });

      const dataProfile = await queryInterface.bulkInsert("Profiles", [
        {
            UserId: dataAdmin[0].id,
            delete: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
      ], {
          returning: true,
      })
      
      done();
    } catch (error) {
      done(error);
    }
    console.log("ini tokennya", access_token)
});

  afterAll(async (done) => {
    try {
      await queryInterface.bulkDelete("Profiles")
      await queryInterface.bulkDelete("Users", null, {
        cascade: true,
      });
      done();
    } catch (error) {
      done(error);
    }
});

describe("GET /v1/user/profile", () => {
    test("TEST CASE 1: Get User Profile Data", (done) => {
      request(app)
        .get("/v1/user/profile")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
        //   expect(body).toHaveProperty("usersTotal", expect.any(Number));
          done();
        });
    });
  });

  describe("PUT /v1/user/profile", () => {
    //login success
    test("TEST CASE 2: Update User Profile Data", (done) => {
      request(app)
        .put("/v1/user/profile")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .send({ 
          fullName: "Jeremiah Prasetyo", 
          birthDate: "03-01-1999",
          city: "Sumbawa Besar",
          country: "Indonesia",
          mobilePhone: "082236024351",
          profilePicture: "https://cdn.discordapp.com/attachments/960564590574456852/965225077069193326/jhondoe.jpg",
        })
        .end(function (err, res) {
          if (err) return done(err);
          const { status, body } = res;
          expect(status).toBe(200);
          expect(body).toHaveProperty("message", "Success")
          done();
        });
    });
})