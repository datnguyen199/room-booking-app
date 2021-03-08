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
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    id_numer: {
      type: DataTypes.STRING
    },
    district: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
