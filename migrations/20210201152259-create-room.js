'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      numberOfBed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rating: {
        type: Sequelize.INTEGER
      },
      numberOfBedRoom: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      numberOfBathRoom: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      priceANight: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      capacity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      roomTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'RoomTypes',
          key: 'id',
          as: 'roomTypeId'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Rooms');
  }
};
