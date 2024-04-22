"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCredential extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserCredential.belongsTo(models.User);
      UserCredential.belongsTo(models.Course);
    }
  }
  UserCredential.init(
    {
      courseId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserCredential",
      tableName: 'userCredentials',
    }
  );
  return UserCredential;
};