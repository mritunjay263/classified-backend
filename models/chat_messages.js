'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat_messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "sender_id",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.chat_rooms, {
        foreignKey: "room_id",
        onDelete: "CASCADE",
      });
    }
  }
  chat_messages.init(
    {
      room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sender_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "chat_messages",
    }
  );
  return chat_messages;
};