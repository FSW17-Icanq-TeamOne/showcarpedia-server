const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

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

describe("POST /v1/register", () => {
    test("TEST CASE 1: Create User Account", (done) => {
      request(app)
        .post("/v1/register")
        .send({ username: "calcal777", email: "cal@scp.com", password: "113eeac34f"})
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          done();
        });
    });
  });

  describe("POST /v1/register", () => {
    test("TEST CASE 2: Create User Account Username Already Exists", (done) => {
      request(app)
        .post("/v1/register")
        .send({ username: "calcal777", email: "ulalala@scp.com", password: "113eeac34f"})
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(409);
          done();
        });
    });
  });

  describe("POST /v1/register", () => {
    test("TEST CASE 3: Create User Account Email Already Exists", (done) => {
      request(app)
        .post("/v1/register")
        .send({ username: "calcal777", email: "cal@scp.com", password: "113eeac34f"})
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(409);
          done();
        });
    });
  });

