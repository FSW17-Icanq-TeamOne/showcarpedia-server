'use strict';

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
    await queryInterface.bulkInsert("Chats", [
      {
        UserId: 3,
        RoomId: 1,
        Chat: "Hi Admin, Saya Caca Mau Bertanya Mmengenai Mobil Pajero 2022",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        UserId: 1,
        RoomId: 1,
        Chat: "Hi Caca, Terimakasih Atas Ketertarikannya, Apa yang Ingin Ditanyakan?",
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
    await queryInterface.bulkDelete("Chats", null, {})
  }
};