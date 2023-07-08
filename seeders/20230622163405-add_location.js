'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
     "add_locations",
     [
       {
         page_name: "Home",
         location_name: "home-banner-top",
         location_info: "",
         length: "1000",
         height: "100",
         price: 10,
       },
       {
         page_name: "Home",
         location_name: "home-banner-bottom",
         location_info: "",
         length: "1000",
         height: "100",
         price: 7,
       },
       {
         page_name: "Home",
         location_name: "home-footer-top",
         location_info: "",
         length: "1000",
         height: "100",
         price: 5,
       },
       {
         page_name: "Home",
         location_name: "home-banner-inside",
         location_info: "",
         length: "1000",
         height: "100",
         price: 4,
       },
     ],
     {}
   );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("add_locations", null, {});
  }
};
