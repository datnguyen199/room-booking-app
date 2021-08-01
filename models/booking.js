'use strict';
const moment = require('moment');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false
        },
        as: 'Bookings'
      })
      Booking.belongsTo(models.BookingOwner, {
        foreignKey: {
          name: 'bookingOwnerId',
          allowNull: true
        }
      })
    }
  };
  Booking.init({
    checkInDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkOutDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isGreaterThanCheckInDate(checkOutTime) {
          if(moment(new Date(checkOutTime)).isBefore(moment(new Date(this.checkInDate)))) {
            throw new Error('checkout date must be after checkin date!');
          }
        }
      }
    },
    totalPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    refundPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    cancelDate: {
      type: DataTypes.DATE
    },
    notes: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
