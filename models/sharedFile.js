"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SharedFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` SharedFile will call this method automatically.
     */
    static associate(models) {
      // define association here
      SharedFile.belongsTo(models.File, { foreignKey: 'fileId' });
      SharedFile.belongsTo(models.User, { foreignKey: 'shareTo' });
    }
  }
  SharedFile.init(
    {
        fileId: DataTypes.INTEGER,
        shareTo:DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "SharedFile",
      tableName: 'sharedFile',
    }
  );
  return SharedFile;
};