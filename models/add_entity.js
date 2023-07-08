'use strict';
import { status, typeOfAdd } from "../const";

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class add_entity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.add_location, {
        foreignKey: "add_location_id",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.Listing, {
        foreignKey: "listing_id",
        onDelete: "CASCADE",
      });
      this.hasMany(models.add_city_map, {
        foreignKey: "add_id",
      });
    }
  }
  add_entity.init(
    {
      add_location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      listing_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type_of_add: {
        type: DataTypes.ENUM,
        values: [...typeOfAdd],
        allowNull: false,
      },
      add_entity: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM,
        values: [...status],
        defaultValue: "pending",
      },
      start_date_time: DataTypes.DATE,
      end_date_time: DataTypes.DATE,
      use_in_weekly_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      on_desktop_view: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      on_mobile_view: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      cal_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "add_entity",
    }
  );
  return add_entity;
};