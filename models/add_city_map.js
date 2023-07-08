'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class add_city_map extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.add_entity, {
        foreignKey: "add_id",
        onDelete: "CASCADE",
      });
      // this.belongsTo(models.add_city_price, {
      //   foreignKey: "city_id",
      //   onDelete: "CASCADE",
      // });
    }
  }
  add_city_map.init(
    {
      add_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "add_city_map",
    }
  );
  return add_city_map;
};