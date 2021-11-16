module.exports = (factory, db) => {
  factory.define('roomtype', db.RoomType, {
    name: factory.chance('name'),
    description: factory.chance('name')
  });
}
