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
   return await queryInterface.bulkInsert("listing_categories", [
     {
       name: "GlobalListingForm", //this is special category or listing form which is deactive in important to not show in front end
       icon: "flaticon-cooking",
       info: "this is special category for Globaly listingForm to add custome Field in Globaly in Form , which is deactive , is important to not show in front end",
       status: "deactive",
     },
     {
       name: "Restaurant",
       icon: "flaticon-cooking",
       info: null,
       status: "active",
     },
     {
       name: "Hotel",
       icon: "flaticon-hotel",
       info: null,
       status: "active",
     },
     {
       name: "Fitness",
       icon: "flaticon-exercise",
       info: null,
       status: "active",
     },
     {
       name: "Shopping",
       icon: "flaticon-commerce",
       info: null,
       status: "active",
     },
     {
       name: "Beauty & Spa",
       icon: "flaticon-cleaning",
       info: null,
       status: "active",
     },
     {
       name: "Events",
       icon: "flaticon-calendar",
       info: null,
       status: "active",
     },
     {
       name: "Health Care",
       icon: "flaticon-heart-1",
       info: null,
       status: "active",
     },
     {
       name: "Travel & Public",
       icon: "flaticon-airport",
       info: null,
       status: "active",
     },
     {
       name: "Auto Insurance",
       icon: "flaticon-car-insurance",
       info: null,
       status: "active",
     },
     {
       name: "Attorneys",
       icon: "flaticon-attorney",
       info: null,
       status: "active",
     },
     {
       name: "Plumbers",
       icon: "flaticon-plumber",
       info: null,
       status: "active",
     },
   ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("listing_categories", null, {});

  }
};
