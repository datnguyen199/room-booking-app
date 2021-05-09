'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoomUtility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoomUtility.belongsTo(models.Utility, {
        foreignKey: {
          name: 'utilityId',
          allowNull: false
        }
      });
      RoomUtility.belongsTo(models.Room, {
        foreignKey: {
          name: 'roomId',
          allowNull: false
        }
      })
    }
  };
  RoomUtility.init({
  }, {
    sequelize,
    modelName: 'RoomUtility',
  });
  return RoomUtility;
};
