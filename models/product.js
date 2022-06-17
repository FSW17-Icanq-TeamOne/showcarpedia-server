"use strict"
const {Model} = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Product.belongsTo(models.User)
      Product.belongsToMany(models.User, {
        through: models.Wishlist,
        foreignKey: "ProductId",
      })
    }
  }
  Product.init(
    {
      title: DataTypes.STRING,
      brand: DataTypes.STRING,
      year: DataTypes.INTEGER,
      kiloMeter: DataTypes.INTEGER,
      grade: DataTypes.INTEGER,
      category: DataTypes.STRING,
      photoProducts: DataTypes.ARRAY(DataTypes.STRING),
      description: DataTypes.STRING,
      delete: DataTypes.BOOLEAN,
      videos: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: "Product",
    }
  )
  return Product
}
