const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/passwordHandler")
const { generateToken } = require("../helpers/tokenHandler")

let webSettings_title = "Cemanapedia";
let webSettings_content = "Cemanapedia is TEAM ONE Web Product";

beforeAll(async (done) => {
    const admin = [
      {
        username: "administrator",
        role: "superAdmin",
        email: "admin@showcarpedia.com",
        password: hashPassword("administrator"),
        delete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const webSettings = [
        {
          id: 1,
          title: "Showcarpedia",
          content: "Showcarpedia is the TEAMONE Web Product",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
    ];
    try {
      const dataAdmin = await queryInterface.bulkInsert("Users", admin, {
        returning: true,
      });
      
      username = dataAdmin[0].username;

      const dataWebSettings = await queryInterface.bulkInsert("Abouts", webSettings, {
        returning: true,  
      });
      
      done();
    } catch (error) {
      done(error);
    }
});

  afterAll(async (done) => {
    try {
      await queryInterface.bulkDelete("Users", null, {
        cascade: true,
      });
      await queryInterface.bulkDelete("Abouts");
      done();
    } catch (error) {
      done(error);
    }
});

describe("GET /v1/about", () => {
    test("TEST CASE 1: Get Web Settings Data", (done) => {
      request(app)
        .get("/v1/about/")
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("title", expect.any(String));
          expect(body).toHaveProperty("content", expect.any(String));
          done();
        });
    });
  });

  describe("PUT /v1/about", () => {
    //login success
    test("TEST CASE 2: Update Web Settings Data", (done) => {
      request(app)
        .post("/v1/about")
        .send({ title: webSettings_title, content: webSettings_content })
        .end(function (err, res) {
          if (err) return done(err);
          const { status, body } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("message", "Success")
          done();
        });
    });
})