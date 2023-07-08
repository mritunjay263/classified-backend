"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Users",
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
        },
        user_name: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.STRING,
        },
        avatar: {
          type: Sequelize.STRING,
        },

        phoneNumber: {
          type: Sequelize.STRING,
        },

        address: {
          type: Sequelize.STRING,
        },

        website: {
          type: Sequelize.STRING,
        },

        bio: {
          type: Sequelize.TEXT,
        },

        fbUrl: {
          type: Sequelize.STRING,
        },
        twtUrl: {
          type: Sequelize.STRING,
        },

        linkUrl: {
          type: Sequelize.STRING,
        },
        insUrl: {
          type: Sequelize.STRING,
        },
        originCountry: {
          type: Sequelize.STRING,
        },
        originState: {
          type: Sequelize.STRING,
        },
        originCity: {
          type: Sequelize.STRING,
        },
        livingCountry: {
          type: Sequelize.STRING,
        },
        livingState: {
          type: Sequelize.STRING,
        },
        livingCity: {
          type: Sequelize.STRING,
        },
        motherTongue: {
          type: Sequelize.STRING,
        },
        roleId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          onDelete: "CASCADE",
          references: {
            model: "Roles",
            key: "id",
            as: "roleId",
          },
        },
        status: {
          type: Sequelize.ENUM,
          values: ["active", "pending", "deactive"],
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
            fields: ["user_name"],
          },
        ],
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
