'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BookingRoom.belongsTo(models.Booking, {
        foreignKey: {
          name: 'bookingId',
          allowNull: false
        },
        as: 'BookingRooms'
      });
      BookingRoom.belongsTo(models.Room, {
        foreignKey: {
          name: 'roomId',
          allowNull: false
        },
        as: 'BookingRooms'
      })
    }
  };
  BookingRoom.init({
    rentingPriceANight: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BookingRoom',
  });
  return BookingRoom;
};
