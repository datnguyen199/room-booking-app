'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.addColumn('Users', 'refreshToken', {
              type: Sequelize.STRING,
              allowNull: true
          }, { transaction: t }),
          queryInterface.addColumn('Users', 'refreshTokenExpiredAt', {
              type: Sequelize.DATE,
              allowNull: true
          }, { transaction: t })
      ])
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.removeColumn('Users', 'refreshToken', { transaction: t }),
          queryInterface.removeColumn('Users', 'refreshTokenExpiredAt', { transaction: t })
      ])
    })
  }
};
