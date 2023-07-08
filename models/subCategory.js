"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.listing_category, {
        foreignKey: "categoryId",
        onDelete: "CASCADE",
      });
      this.hasMany(models.Listing, {
        foreignKey: "subCategoryId",
      });
      this.hasMany(models.CustomeFieldMeta, {
        foreignKey: "subCategoryId",
      });
    }
  }
  SubCategory.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      info: DataTypes.STRING,
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "pending", "deactive"],
        defaultValue: "active",
      },
      //dont touch the custome field below ; this code is genrated by custome field created by apis
      //please dont mess with code below 👏
    },
    {
      sequelize,
      modelName: "SubCategory",
    }
  );
  return SubCategory;
};
