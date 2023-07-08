'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("listing_customeField_data", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      listingId: {
        type: Sequelize.UUID,
        onDelete: "CASCADE",
        references: {
          model: "Listings",
          key: "id",
          as: "listingId",
        },
      },
      custome_data: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('listing_customeField_data');
  }
};