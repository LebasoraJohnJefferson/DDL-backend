"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.User);
      Event.hasMany(models.EventImages);
    }
  }
  Event.init(
    {
        userId: DataTypes.INTEGER,
        title:DataTypes.STRING,
        description:DataTypes.STRING,
        privacy:DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Event",
      tableName: 'events',
    }
  );
  return Event;
};