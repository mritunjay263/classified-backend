"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Listings", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      listingTitle: {
        type: Sequelize.STRING,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "listing_categories",
          key: "id",
          as: "categoryId",
        },
      },
      subCategoryId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "SubCategories",
          key: "id",
          as: "subCategoryId",
        },
      },
      keyword: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
      },
      zipcode: {
        type: Sequelize.STRING,
      },
      gallery: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
      description: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.STRING,
      },
      website: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      facebook: {
        type: Sequelize.STRING,
      },
      twitter: {
        type: Sequelize.STRING,
      },
      linkedin: {
        type: Sequelize.STRING,
      },
      facilities: {
        type: Sequelize.STRING,
      },
      openingDay: {
        type: Sequelize.STRING,
      },
      closingDay: {
        type: Sequelize.STRING,
      },
      openingTime: {
        type: Sequelize.STRING,
      },
      closingTime: {
        type: Sequelize.STRING,
      },
      pricing: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["active", "pending", "deactive"],
        defaultValue: "active",
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
          as: "userId",
        },
      },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Listings");
  },
};
