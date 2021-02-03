'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingDiscount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BookingDiscount.init({
    discountId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BookingDiscount',
  });
  return BookingDiscount;
};
