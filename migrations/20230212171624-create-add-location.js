'use strict';
const { status } =require("../const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("add_locations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      page_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      location_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      location_info: {
        type: Sequelize.STRING,
      },
      length: {
        type: Sequelize.STRING,
      },
      height: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM,
        values: [...status],
        defaultValue: "active",
      },
      price: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('add_locations');
  }
};