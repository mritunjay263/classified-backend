'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //tags
      this.hasMany(models.discussion_tags, {
        foreignKey: "tag_id",
        as: "tags_of_post",
      });
      this.hasMany(models.chat_room_tags, {
        foreignKey: "tag_id",
        as: "tags_of_chat_rooms",
      });
    }
  }
  tags.init(
    {
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "tags",
    }
  );
  return tags;
};