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
    await queryInterface.bulkInsert("Products", [
      {
        title: "MobilAvanza",
        brand: "Toyota",
        year: 2021,
        kiloMeter: 10000,
        grade: 5,
        category: "Avanza",
        description: "Murah Toyota Avanza",
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
      },
      {
        title: "Mobil Itu",
        brand: "Porsche",
        year: 2021,
        kiloMeter: 10000,
        grade: 5,
        category: "Porsche",
        description: "Murah Mobil itu",
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
    await queryInterface.bulkDelete("Products", null, {})
  }
};