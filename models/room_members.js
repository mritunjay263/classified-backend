'use strict';
const {
  Model
} = require('sequelize');
const { status, roomType } = require("../const");

module.exports = (sequelize, DataTypes) => {
  class room_members extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.chat_rooms, {
        foreignKey: "room_id",
        onDelete: "CASCADE",
      });
    }
  }
  room_members.init(
    {
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: [...status],
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "room_members",
    }
  );
  return room_members;
};