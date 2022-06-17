const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/passwordHandler")

let usernameAdmin;
let usernameUser;

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
   
    try {
      const dataUser = await queryInterface.bulkInsert("Users", user, {
        returning: true,
      })
      
      usernameAdmin = dataUser[0].username;
      usernameUser = dataUser[2].username;

      done();
    } catch (error) {
      done(error);
    }
});

afterAll(async (done) => {
    try {
      await queryInterface.bulkDelete("Profiles")
      await queryInterface.bulkDelete("RoomLists", null, {
        cascade: true
      });
      await queryInterface.bulkDelete("Users", null, {
        cascade: true
      });
      done();
    } catch (error) {
      done(error);
    }
});

describe("POST /v1/login", () => {
    test("TEST CASE 1: Admin Login", (done) => {
      request(app)
        .post("/v1/login")
        .send({ username: usernameAdmin, password: "administrator"})
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
          done();
        });
    });
  });

  describe("POST /v1/login", () => {
    test("TEST CASE 2: User Login", (done) => {
      request(app)
        .post("/v1/login")
        .send({ username: usernameUser, password: "caca12345"})
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(200);
          done();
        });
    });
  });

  describe("POST /v1/login", () => {
    test("TEST CASE 3: User Login Wrong Password", (done) => {
      request(app)
        .post("/v1/login")
        .send({ username: usernameUser, password: "caca1234567"})
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(409);
          done();
        });
    });
  });

  describe("POST /v1/login", () => {
    test("TEST CASE 4: User Login Blank", (done) => {
      request(app)
        .post("/v1/login")
        .send({ username: "", password: ""})
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(500);
          expect(body).toHaveProperty("message", expect.any(String));
          done();
        });
    });
  });

