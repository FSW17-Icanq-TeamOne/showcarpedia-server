'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, {foreignKey:"UserId"})
      //User.hasMany(models.Product)
      User.hasMany(models.Wishlist, { foreignKey: "UserId"})
      User.hasOne(models.RoomLists, {foreignKey:"UserId"}),
      User.hasMany(models.Chat, { foreignKey: "UserId"})
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('user', 'admin', 'superAdmin'),
    delete: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};