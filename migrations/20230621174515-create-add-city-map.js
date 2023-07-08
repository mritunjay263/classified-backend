'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "add_city_maps",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        add_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          onDelete: "CASCADE",
          references: {
            model: "add_entities",
          },
        },
        city_name: {
          type: Sequelize.STRING,
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
            fields: ["city_name"],
          },
        ],
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('add_city_maps');
  }
};