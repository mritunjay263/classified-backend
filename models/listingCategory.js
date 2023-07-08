'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class listing_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Listing, {
        foreignKey: "categoryId",
      });

      this.hasMany(models.SubCategory, {
        foreignKey: "categoryId",
      });
      this.hasMany(models.CustomeFieldMeta, {
        foreignKey: "categoryId",
      });
    }
  }
  listing_category.init(
    {
      name: DataTypes.STRING,
      icon: DataTypes.STRING,
      info: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM,
        values: ["active", "pending", "deactive"],
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "listing_category",
    }
  );
  return listing_category;
};