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
        as: 'bookings'
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
        isEmail: {
          args: true,
          msg: 'email is not valid'
        }
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
      validate: {
        isIn: {
          args: [[0, 1, 2]], // 0: user, 1: admin, 2: manager
          msg: 'role is not valid value'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
