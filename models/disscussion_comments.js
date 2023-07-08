'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class discussion_comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here slef join
      this.hasMany(models.discussion_comments, {
        foreignKey: "parent_comment_id",
        as: "child_comments",
      });
      this.belongsTo(models.discussion_comments, {
        foreignKey: "parent_comment_id",
        onDelete: "CASCADE",
      });

      //post 
      this.belongsTo(models.discussion_questions, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
      });
      //user
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });
      //likes
      this.hasMany(models.disscusion_likes, {
        foreignKey: "comment_id",
        as: "likes_on_comments",
      });
    }
  }
  discussion_comments.init(
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      parent_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      accepted_by_author: {
        type: DataTypes.UUID,
        defaultValue:false
      },
      published: DataTypes.BOOLEAN,
      tags: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "discussion_comments",
    }
  );
  return discussion_comments;
};