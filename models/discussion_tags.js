'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class discussion_tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //post
      this.belongsTo(models.discussion_questions, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
      });
      this.belongsTo(models.tags, {
        foreignKey: "tag_id",
        onDelete: "CASCADE",
        as:"tags"
      });
    }
  }
  discussion_tags.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "discussion_tags",
    }
  );
  return discussion_tags;
};