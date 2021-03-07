'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Room.init({
    description: {
      type: DataTypes.TEXT
    },
    numberOfBed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.INTEGER
    },
    numberOfBedRoom: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    numberOfBathRoom: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    priceANight: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};
