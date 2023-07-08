'use strict';
const {
  Model
} = require('sequelize');
const { status,roomType } = require("../const");

module.exports = (sequelize, DataTypes) => {
  class chat_rooms extends Model {
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
      this.hasMany(models.chat_room_tags, {
        foreignKey: "room_id",
        as: "tags_on_chat_room",
      });
      this.hasMany(models.room_members, {
        foreignKey: "room_id",
        as: "chat_room_members",
      });
    }
  }
  chat_rooms.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      room_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      room_type: {
        type: DataTypes.ENUM,
        values: [...roomType],
        defaultValue: "public",
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM,
        values: [...status],
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "chat_rooms",
    }
  );
  return chat_rooms;
};