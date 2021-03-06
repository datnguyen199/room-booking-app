'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UtilityType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UtilityType.init({
    name: DataTypes.STRING,
    unique: true
  }, {
    sequelize,
    modelName: 'UtilityType',
  });
  return UtilityType;
};
