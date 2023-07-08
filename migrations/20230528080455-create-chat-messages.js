'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "chat_messages",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        room_id: {
          type: Sequelize.UUID,
          onDelete: "CASCADE",
          references: {
            model: "chat_rooms",
            key: "id",
            as: "chat_room_id",
          },
        },
        sender_id: {
          type: Sequelize.UUID,
          onDelete: "CASCADE",
          references: {
            model: "Users",
            key: "id",
            as: "user_id",
          },
        },
        message: {
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
            fields: ["room_id"],
          },
        ],
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chat_messages');
  }
};