"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "videos", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      onDelete: "CASCADE",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "videos", {})
  },
}
