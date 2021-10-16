'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingOwner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BookingOwner.hasMany(models.Booking, {
        foreignKey: {
          name: 'bookingOwnerId',
          allowNull: true
        }
      })
    }
  };
  BookingOwner.init({
    idNumber: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: true,
        isValid(value) {
          if(value.toString().length !== 9 && value.toString().lenth !== 12) {
            throw new Error("ID number must be 9 or 12 numbers")
          }
        }
      }
    },
    fullname: {
      type: DataTypes.STRING,
      validate: {
        len: [3, 255]
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        isAlphanumeric: true,
        len: [10, 10]
      }
    }
  }, {
    sequelize,
    modelName: 'BookingOwner',
  });
  return BookingOwner;
};
