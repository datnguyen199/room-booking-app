const factoryGirl = require('factory-girl');
const adapter = new factoryGirl.SequelizeAdapter();
const factory = factoryGirl.factory;
const db = require('../../models');
factory.setAdapter(adapter);
require('../factories/index')(factory, db);

module.exports = factory;
