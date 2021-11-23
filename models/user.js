'use strict';
const bcrypt = require('bcrypt');
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
      });
      User.hasOne(models.UserToken, {
        foreignKey: {
          name: 'userId',
          allowNull: false
        }
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
      unique: {
        args: true,
        msg: 'email already in use!'
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'email is not valid'
        },
        isUnique: function(value, next) {
          var self = this;
          User.findOne({ where: { email: value, isActive: true }, attributes: ['id'] })
            .then(function(err, user) {
              if(err) return next(err);
              if(user && self.id !== user.id) return next('Email already in use!');

              next();
            })
        }
      }
    },
    phone: {
      type: DataTypes.STRING
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isUnique: function(value, next) {
          var self = this;
          User.findOne({ where: { userName: value, isActive: true }, attributes: ['id'] })
            .then(function(err, user) {
              if(err) return next(err);
              if(user && self.id !== user.id) return next('Username already in use!');

              next();
            })
        }
      }
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
    },
    isGuest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    refreshToken: {
      type: DataTypes.STRING
    },
    confirmationToken: {
      type: DataTypes.STRING
    },
    confirmationExpireAt: {
      type: DataTypes.DATE
    }
  }, {
    hooks: {
      afterValidate: (user, options) => {
        if(user.changed('password')) {
          user.password = bcrypt.hashSync(user.password, 8)
        }
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};
