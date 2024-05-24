'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("thesis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      courseId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "courses",
          key: "id",
        },
      },
      title:{
        type:Sequelize.STRING
      },
      adviser:{
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id",
        },
      },
      authors:{
        type:Sequelize.STRING
      },
      year:{
        type:Sequelize.INTEGER
      },
      coverPhoto:{
         type:Sequelize.STRING,
         allowNull:true
      },
      link:{
        type:Sequelize.STRING,
        allowNull:true
     },
     abstract:{
      type: Sequelize.TEXT,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("thesis");
  }
};
