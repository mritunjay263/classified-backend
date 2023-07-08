'use strict';
const { status, typeOfAdd }= require("../const");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("add_entities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      add_location_id: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "add_locations",
          key: "id",
          as: "add_location_id",
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
      listing_id: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "Listings",
          key: "id",
          as: "listing_id",
        },
      },
      type_of_add: {
        type: Sequelize.ENUM,
        values: [...typeOfAdd],
        allowNull: false,
      },
      add_entity: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM,
        values: [...status],
        defaultValue: "pending",
      },
      start_date_time: {
        type: Sequelize.DATE,
      },
      end_date_time: {
        type: Sequelize.DATE,
      },
      use_in_weekly_email: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      on_desktop_view: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      on_mobile_view: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      cal_price: {
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
    await queryInterface.dropTable('add_entities');
  }
};