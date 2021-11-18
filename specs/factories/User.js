const faker = require('faker');

module.exports = (factory, db) => {
  factory.define('user', db.User, {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    userName: factory.sequence('User.userName', n => `username${n}`),
    password: 'Aa@123456',
    idNumber: Math.floor(10000000000 + Math.random() * 90000000000).toString(),
    district: faker.address.streetAddress(),
    city: faker.address.city(),
    confirmationToken: 'confirmtoken',
    confirmationExpireAt: new Date(Date.now() + ( 3600 * 1000 * 24))
  });

  factory.extend('user', 'activeUser', { isActive: true, confirmationToken: null, confirmationExpireAt: null });
  factory.extend('user', 'guestUser',
    { isGuest: true, isActive: false, userName: factory.sequence('User.userName', n => `guest${n}`) });
}
