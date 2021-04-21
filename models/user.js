'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Booking, {
        foreignKey: {
          name: 'userId',
          allowNull: false
        },
        as: 'Bookings'
      })
    }
  };
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    idNumber: {
      type: DataTypes.STRING
    },
    district: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.INTEGER,
      isIn: [[0, 1, 2]] // 0: user, 1: admin, 2: manager
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
