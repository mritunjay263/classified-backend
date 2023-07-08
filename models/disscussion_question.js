'use strict';
const {
  Model
} = require('sequelize');
const { status } = require('../const');
module.exports = (sequelize, DataTypes) => {
  class discussion_questions extends Model {
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

      //comment
      this.hasMany(models.discussion_comments, {
        foreignKey: "post_id",
      });
      //likes
      this.hasMany(models.disscusion_likes, {
        foreignKey: "post_id",
        as: "post_likes",
      });
      //likes
      this.hasMany(models.disscusion_likes, {
        foreignKey: "comment_id",
        as: "likes_on_posts",
      });
      //views
      this.hasMany(models.disscusion_views, {
        foreignKey: "post_id",
        as: "views_on_posts",
      });
      //tags
      this.hasMany(models.discussion_tags, {
        foreignKey: "post_id",
        as: "tags_on_post",
      });
    }
  }
  discussion_questions.init(
    {
      post_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      meta_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: [...status],
        defaultValue: "active",
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "discussion_questions",
    }
  );
  return discussion_questions;
};