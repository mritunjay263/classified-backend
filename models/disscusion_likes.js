'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class disscusion_likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //user
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      //post
      this.belongsTo(models.discussion_questions, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
      });
      //comment
      this.belongsTo(models.discussion_comments, {
        foreignKey: "comment_id",
        onDelete: "CASCADE",
      });
    }
  }
  disscusion_likes.init(
    {
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "disscusion_likes",
    }
  );
  return disscusion_likes;
};