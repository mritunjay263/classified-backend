"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      //association listing_category
      this.belongsTo(models.listing_category, {
        foreignKey: "categoryId",
        onDelete: "CASCADE",
      });
      //association listing_category
      this.belongsTo(models.SubCategory, {
        foreignKey: "subCategoryId",
        onDelete: "CASCADE",
        allowNull: true,
      });
      this.hasMany(models.listing_customeField_data, {
        foreignKey: "listingId",
      });
      //add_entity
      this.hasMany(models.add_entity, {
        foreignKey: "listing_id",
      });
    }
  }
  Listing.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      listingTitle: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      keyword: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gallery: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      facebook: {
        type: DataTypes.STRING,
      },
      twitter: {
        type: DataTypes.STRING,
      },
      linkedin: {
        type: DataTypes.STRING,
      },
      facilities: {
        type: DataTypes.STRING,
      },
      openingDay: {
        type: DataTypes.STRING,
      },
      closingDay: {
        type: DataTypes.STRING,
      },
      openingTime: {
        type: DataTypes.STRING,
      },
      closingTime: {
        type: DataTypes.STRING,
      },
      pricing: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "pending", "deactive"],
        defaultValue: "pending",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Listing",
    }
  );
  return Listing;
};
