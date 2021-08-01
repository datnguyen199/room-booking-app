'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Rooms', 'status', {
          type: Sequelize.DataTypes.INTEGER,
          default: 0
        }, { transaction: t }),
        queryInterface.addColumn('Rooms', 'capacity', {
          type: Sequelize.DataTypes.INTEGER,
        }, { transaction: t })
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Rooms', 'status', { transaction: t }),
        queryInterface.removeColumn('Rooms', 'capacity', { transaction: t })
      ]);
    });
  }
};
