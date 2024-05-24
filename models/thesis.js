"use strict";

const { Model } = require("sequelize");
const useBcrypt = require("sequelize-bcrypt");

module.exports = (sequelize, DataTypes) => {
  class Thesis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Thesis.belongsTo(models.Course, {foreignKey: 'courseId'});
      Thesis.belongsTo(models.User, {foreignKey: 'adviser'});
    }
  }

  Thesis.init(
    {
      courseId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      adviser: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
      authors: DataTypes.STRING,
      coverPhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      link:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      abstract:DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Thesis",
      tableName: 'thesis',
    }
  );

  return Thesis;
};