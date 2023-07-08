'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("discussion_comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      parent_comment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "discussion_comments",
          key: "id",
          as: "parent_comment_id",
        },
      },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: "CASCADE",
        references: {
          model: "discussion_questions",
          key: "id",
          as: "post_id",
        },
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
      tags: {
        type: Sequelize.STRING,
      },
      accepted_by_author: {
        type: Sequelize.BOOLEAN,
      },
      published: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('discussion_comments');
  }
};