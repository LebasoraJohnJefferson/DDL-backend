"use strict";

const { Course } = require("../models");

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
    const existingCourse = await Course.findOne();


    if(!existingCourse){
      await queryInterface.bulkInsert(
        "courses",
        [
          {
            acronym: "BAEL",
            title: "BACHELOR OF ARTS IN ENGLISH LANGUAGE",
            college: "College of Arts and Sciences",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            acronym: "BSF",
            title: "Batsilyer ng Sining sa Filipino",
            college: "College of Arts and Sciences",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      );
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};