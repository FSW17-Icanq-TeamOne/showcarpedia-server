'use strict';

const { query } = require("express");

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
    await queryInterface.bulkInsert("Wishlists", [
      {
        UserId: 1,
        ProductId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 1,
        ProductId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 2,
        ProductId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
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
    await queryInterface.bulkDelete("Wishlists", null, {})
  }
};