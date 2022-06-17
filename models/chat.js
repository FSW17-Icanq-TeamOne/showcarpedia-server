'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.User, { foreignKey: 'UserId' })
      Chat.belongsTo(models.RoomLists, { foreignKey: 'RoomId' })
    }
  }
  Chat.init({
    UserId: {
      type: DataTypes.INTEGER,
      validate:{
        notEmpty: true
      }
    },
    RoomId: {
      type: DataTypes.INTEGER,
      validate:{
        notEmpty: true
      }
    },
    Chat: {
      type: DataTypes.STRING,
      validate:{
        notEmpty: true
      }
    }
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};