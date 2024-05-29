"use strict";

const { Model } = require("sequelize");
const useBcrypt = require("sequelize-bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserCredential, {foreignKey: 'userId'});
      User.hasOne(models.Event, {foreignKey: 'userId'})
      User.hasOne(models.Faculty, {foreignKey: 'userId'})
      User.hasOne(models.BaelStudentChart, {foreignKey: 'userId'})
      User.hasOne(models.BsfStudentChart, {foreignKey: 'userId'})
      User.hasOne(models.Thesis, {foreignKey: 'adviser'})
      User.hasOne(models.File, {foreignKey: 'userId'})

      User.hasMany(models.SharedFile, { foreignKey: 'shareTo' });
    }
  }

  User.init(
    {
      firstName: DataTypes.STRING,
      middleName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      suffix: DataTypes.STRING,
      image: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      sequelize,
      modelName: "User",
      tableName: 'users',
    }
  );

  useBcrypt(User, {
    field: "password", // secret field to hash, default: 'password'
    rounds: 10, // used to generate bcrypt salt, default: 12
    compare: "authenticate", // method used to compare secrets, default: 'authenticate'
  });

  return User;
};