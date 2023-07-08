'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomeFieldMeta extends Model {
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
      this.belongsTo(models.SubCategory, {
        foreignKey: "subCategoryId",
        onDelete: "CASCADE",
      });
    }
  }
  CustomeFieldMeta.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // info: {
      //   type: DataTypes.JSONB
      // },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fieldLength: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      defaultValue: {
        type: DataTypes.STRING,
      },
      required: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      helpText: {
        type: DataTypes.STRING,
      },
      useAsFilter: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "CustomeFieldMeta",
    }
  );
  return CustomeFieldMeta;
};