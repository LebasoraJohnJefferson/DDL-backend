"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      File.belongsTo(models.User);
      File.hasOne(models.SharedFile, { foreignKey: 'fileId' });
    }
  }
  File.init(
    {
        userId: DataTypes.INTEGER,
        fileName:DataTypes.STRING,
        path:DataTypes.STRING,
        couldinaryId:DataTypes.STRING
    },
    {
      sequelize,
      modelName: "File",
      tableName: 'file',
    }
  );
  return File;
};