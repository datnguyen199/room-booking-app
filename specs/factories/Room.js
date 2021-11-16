module.exports = (factory, db) => {
  factory.define('room', db.Room, {
    description: factory.chance('name'),
    rating: 4,
    priceANight: 2000,
    roomTypeId: factory.assoc('roomtype', 'id')
  })
}
