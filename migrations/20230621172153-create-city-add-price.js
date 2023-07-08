'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "add_city_prices",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        country_id: {
          type: Sequelize.INTEGER,
        },
        city_name: {
          type: Sequelize.STRING,
          unique: true,
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
      },
      {
        indexes: [
          {
            fields: ["country_id"],
          },
          {
            unique: true,
            fields: ["city_name"],
          },
        ],
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('add_city_prices');
  }
};