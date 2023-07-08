'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CustomeFieldMeta", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      // info: {
      //   type: Sequelize.JSONB,
      // },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fieldLength: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      defaultValue: {
        type: Sequelize.STRING,
      },
      required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      helpText: {
        type: Sequelize.STRING,
      },
      useAsFilter: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      options: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CustomeFieldMeta');
  }
};