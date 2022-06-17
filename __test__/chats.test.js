const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { hashPassword } = require("../helpers/passwordHandler")
const { generateToken } = require("../helpers/tokenHandler")

let access_token;
let access_token_admin;
let userRole;
let adminRole;
let roomUser;


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

      const dataRoom = await queryInterface.bulkInsert("RoomLists", [
        {
            UserId: dataUser[2].id,
            Room: "caca_admin",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ], {
        returning: true,
    })
      
      userRole = dataUser[2].role;
      adminRole = dataUser[0].role;
      access_token_admin = await generateToken({
        id: dataUser[0].id,
        email: dataUser[0].email,
        role: dataUser[0].role,
        Room: dataRoom[0].id
      });
      access_token = await generateToken({
        id: dataUser[2].id,
        email: dataUser[2].email,
        role: dataUser[2].role,
        Room: dataRoom[0].id
      });
      roomUser = "caca_admin"
      
      done();
    } catch (error) {
      done(error);
    }
    console.log(access_token, "Tokennya nih")
});

  afterAll(async (done) => {
    try {
      await queryInterface.bulkDelete("RoomLists", null, {
        cascade: true
      });
      await queryInterface.bulkDelete("Chats")
      await queryInterface.bulkDelete("Users", null, {
        cascade: true
      });
      done();
    } catch (error) {
      done(error);
    }
});

describe("GET /v1/chat/rooms", () => {
    test("TEST CASE 1: Get The Roomlists Data", (done) => {
      request(app)
        .get("/v1/chat/rooms")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          done();
        });
    });
  });

describe("GET /v1/chat/room", () => {
    test("TEST CASE 2: Get The Room Name by Specific ID", (done) => {
      request(app)
        .get("/v1/chat/room")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          done();
        });
    });
  });

  describe("GET /v1/chat/name", () => {
    test("TEST CASE 3: Get The User Name for Chat", (done) => {
      request(app)
        .get("/v1/chat/name")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          done();
        });
    });
  });

  describe("POST /v1/chat/chat", () => {
    //login success
    test("TEST CASE 4: User Send Chat to Admin", (done) => {
      request(app)
        .post("/v1/chat/chat")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .send({ chatBox: "Hi Admin :)"})
        .end(function (err, res) {
          if (err) return done(err);
          const { status, body } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("message", "Success")
          done();
        });
    });
})

  describe("GET /v1/chat/chat", () => {
    test("TEST CASE 5: Get The User Chat with Admin", (done) => {
      request(app)
        .get("/v1/chat/chat")
        .set("Cookie", [`access_token=${access_token}`, `role=${userRole}`])
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          expect(status).toBe(201);
          done();
        });
    });
  });

  describe("POST /v1/chat/chatAdmin/:room", () => {
    //login success
    test("TEST CASE 6: Admin Send Chat to User", (done) => {
      request(app)
        .post(`/v1/chat/chatAdmin/${roomUser}`)
        // .query({ room: `${roomUser}` })
        .set("Cookie", [`access_token=${access_token_admin}`, `role=${adminRole}`])
        .send({ chatBox: "Hi Caca :)"})
        .end(function (err, res) {
          if (err) return done(err);
          const { status, body } = res;
          expect(status).toBe(201);
          expect(body).toHaveProperty("message", "Success")
          done();
        });
    });
})

describe("GET /v1/chat/chat/:room", () => {
  //login success
  test("TEST CASE 7: Admin Get Chat from User", (done) => {
    request(app)
      .get(`/v1/chat/chat/${roomUser}`)
      .set("Cookie", [`access_token=${access_token_admin}`, `role=${adminRole}`])
      .end(function (err, res) {
        if (err) return done(err);
        const { status, body } = res;
        expect(status).toBe(201);
        done();
      });
  });
})