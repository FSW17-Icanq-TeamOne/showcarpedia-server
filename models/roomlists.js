'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomLists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomLists.belongsTo(models.User, {foreignKey:"UserId"})
      RoomLists.belongsToMany(models.User, { through: models.Chat, foreignKey: "RoomId"})
    }
  }
  RoomLists.init({
    UserId: {
      type: DataTypes.INTEGER,
      validate:{
        notEmpty: true,
      }
    },
    Room: {
      type: DataTypes.STRING,
      validate:{
        notEmpty: true,
      }
    }
  }, {
    sequelize,
    modelName: 'RoomLists',
  });
  return RoomLists;
};