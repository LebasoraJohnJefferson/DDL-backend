"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BsfStudentChart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BsfStudentChart.belongsTo(models.User);
    }
  }
  BsfStudentChart.init(
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
      modelName: "BsfStudentChart",
      tableName: 'bsfStudentChart',
    }
  );
  return BsfStudentChart;
};