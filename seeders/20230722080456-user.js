"use strict";

const { User } = require("../models");

const bcrypt = require("bcrypt");

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
    const existingUser = await User.findOne({
      where: {
        email: "admin@gmail.com",
      },
    });



    if (!existingUser){
      const hashedPass = await bcrypt.hash("admin", 10);
  
      await queryInterface.bulkInsert(
        "users",
        [
          {
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPass,
            role: "admin",
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name:"gwapo",
            email:"lebasorajohnjefferson@gmail.com",
            password: hashedPass,
            role: "admin",
            status: "active",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {}
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