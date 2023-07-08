"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // role assoiation
      this.belongsTo(models.Role, {
        foreignKey: "roleId",
        onDelete: "SET NULL",
      });
      // list assoiation
      this.hasMany(models.Listing, {
        foreignKey: "userId",
      });
      //add_entity
      this.hasMany(models.add_entity, {
        foreignKey: "user_id",
      });
      //disscussion question
      this.hasMany(models.discussion_questions, {
        foreignKey: "user_id",
      });
      //disscusion comment
      this.hasMany(models.discussion_comments, {
        foreignKey: "user_id",
      });
      //likes
      this.hasMany(models.disscusion_likes, {
        foreignKey: "user_id",
      });
      //chat_rooms
      this.hasMany(models.chat_rooms, {
        foreignKey: "user_id",
      });
      //chat_room_members
      this.hasMany(models.room_members, {
        foreignKey: "user_id",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull:false
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      website: {
        type: DataTypes.STRING,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      fbUrl: {
        type: DataTypes.STRING,
      },
      twtUrl: {
        type: DataTypes.STRING,
      },
      linkUrl: {
        type: DataTypes.STRING,
      },
      insUrl: {
        type: DataTypes.STRING,
      },
      originCountry: {
        type: DataTypes.STRING,
      },
      originState: {
        type: DataTypes.STRING,
      },
      originCity: {
        type: DataTypes.STRING,
      },
      livingCountry: {
        type: DataTypes.STRING,
      },
      livingState: {
        type: DataTypes.STRING,
      },
      livingCity: {
        type: DataTypes.STRING,
      },
      motherTongue: {
        type: DataTypes.STRING,
      },
      roleId: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "pending", "deactive"],
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
