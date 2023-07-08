'use strict';
const {
  Model
} = require('sequelize');
const { status } = require('../const');
module.exports = (sequelize, DataTypes) => {
  class add_location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.add_entity, {
        foreignKey: "add_location_id",
      });

    }
  }
  add_location.init(
    {
      page_name: DataTypes.STRING,
      location_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location_info: DataTypes.STRING,
      length: DataTypes.STRING,
      height: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM,
        values: [...status],
        defaultValue: "active",
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "add_location",
    }
  );
  return add_location;
};