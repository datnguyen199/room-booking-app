'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Bookings', 'bookingOwnerId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'BookingOwners',
          key: 'id'
        }
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Bookings', 'bookingOwnerId')
    ])
  }
};
