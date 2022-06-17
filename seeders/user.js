'use strict';

const { query } = require("express");
const { hashPassword } = require("../helpers/passwordHandler")

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("Users", [
      {
        username: "administrator",
        email: "admin@showcarpedia.com",
        password: hashPassword("administrator"),
        role: "superAdmin",
        delete: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "jeremiah",
        email: "jeremiah@showcarpedia.com",
        password: hashPassword("jeremiah"),
        role: "admin",
        delete: false,
        createdAt: new Date(),
        updatedAt: new Date()
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
    ], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // down dipake buat revert alias kalau jalanin db:seed:undo:all
    await queryInterface.bulkDelete("Users", null, {})
  }
};