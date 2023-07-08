/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return await queryInterface.bulkInsert(
      "Roles",
      [
        {
          role: "admin",
          roleInfo: null,
        },
        {
          role: "user",
          roleInfo: null,
        },
        {
          role: "shear_holder",
          roleInfo: null,
        },
        {
          role: "accountant",
          roleInfo: null,
        },
        {
          role: "email_support",
          roleInfo: null,
        },
        {
          role: "ads_management",
          roleInfo: null,
        },
        {
          role: "customer_care",
          roleInfo: null,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
