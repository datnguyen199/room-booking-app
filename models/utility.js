'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Utility.hasMany(models.RoomUtility, {
        foreignKey: {
          name: 'utilityId',
          allowNull: false
        }
      });
      Utility.belongsToMany(models.Room, {
        through: models.RoomUtility
      });
    }
  };
  Utility.init({
    description: DataTypes.TEXT,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Utility',
  });
  return Utility;
};
