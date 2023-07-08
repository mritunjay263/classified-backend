'use strict';
const { status, roomType } = require("../const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "chat_rooms",
      {
        id: {
          allowNull: false,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        room_name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        user_id: {
          type: Sequelize.UUID,
          onDelete: "CASCADE",
          references: {
            model: "Users",
            key: "id",
            as: "user_id",
          },
        },
        room_type: {
          type: Sequelize.ENUM,
          values: [...roomType],
          defaultValue: "public",
        },
        location: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM,
          values: [...status],
          defaultValue: "active",
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
            unique: true,
            fields: ["location", "room_name"],
          },
        ],
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chat_rooms');
  }
};