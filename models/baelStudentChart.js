"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BaelStudentChart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BaelStudentChart.belongsTo(models.User);
    }
  }
  BaelStudentChart.init(
    {
        userId: DataTypes.INTEGER,
        role:DataTypes.STRING,
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
      sequelize,
      modelName: "BaelStudentChart",
      tableName: 'baelStudentChart',
    }
  );
  return BaelStudentChart;
};