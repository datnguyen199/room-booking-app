'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserToken.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false
        }
      });
    }
  };
  UserToken.init({
    token: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserToken',
  });
  return UserToken;
};
