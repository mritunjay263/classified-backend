'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat_room_tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.chat_rooms, {
        foreignKey: "room_id",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.tags, {
        foreignKey: "tag_id",
        onDelete: "CASCADE",
        as: "tags",
      });
    }
  }
  chat_room_tags.init(
    {
      room_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "chat_room_tags",
    }
  );
  return chat_room_tags;
};