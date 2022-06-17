const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/passwordHandler")
const { generateToken, verifyToken } = require("../helpers/tokenHandler")


let userRole;
let access_token;

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
      
      done();
    } catch(error) {
      done(error);
    }
    console.log(access_token, "Token Nih")
    // console.log(dataAdmin, "Data Admin")
    // console.log(verifyToken(access_token), "Decoded Token")
});

  afterAll(async (done) => {
    try {
      await queryInterface.bulkDelete("Users", null, {
        cascade: true,
      });
      done();
    } catch (error) {
      done(error);
    }
});

describe("GET /v1/user/account", () => {
    test("TEST CASE 1: Get User Account Settings", (done) => {
      request(app)
        .get("/v1/user/account/")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          
          done();
        });
    });
  });

  describe("PUT /v1/user/account/", () => {
    //login success
    test("TEST CASE 2: Update Account Settings Data", (done) => {
      request(app)
        .put("/v1/user/account/")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .send({ username: "jejemiah", email: "jejemiah@showcarpedia.com", password: "113eeac34f" })
        .end(function (err, res) {
          if (err) return done(err);
          const { status, body } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("message", "Success")
          done();
        });
    });
})