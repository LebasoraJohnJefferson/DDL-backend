"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Faculty.belongsTo(models.User);
    }
  }
  Faculty.init(
    {
        userId: DataTypes.INTEGER,
        role:DataTypes.STRING,
        isCoor:DataTypes.BOOLEAN,
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        extension:DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Faculty",
      tableName: 'faculty',
    }
  );
  return Faculty;
};