'use strict';
const {
  Model
} = require('sequelize');
const db = require('../models');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Room.belongsTo(models.RoomType, {
        foreignKey:{
          name: 'roomTypeId',
          allowNull: false
        }
      });
      Room.hasMany(models.RoomUtility, {
        foreignKey: {
          name: 'roomId',
          allowNull: false
        }
      });
      Room.belongsToMany(models.Utility, {
        through: models.RoomUtility
      });

      // scopes be defined here
      // Room.addScope('defaultScope', {
      //   include: {
      //     model: db.BookingRoom,
      //     include: {
      //       model: db.Booking
      //     }
      //   },
      //   where: { numberOfBed: 1 }
      // });
    }
  };
  Room.init({
    description: {
      type: DataTypes.TEXT
    },
    numberOfBed: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    rating: {
      type: DataTypes.INTEGER
    },
    numberOfBedRoom: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    numberOfBathRoom: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    priceANight: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        max: 50
      }
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isIn: {
          args: [[0, 1, 2]], // 0: free, 1: booking, 2: cancelled
          msg: 'status is not a valid value'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Room',
  });
  return Room;
};
