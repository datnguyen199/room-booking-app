module.exports = (factory, db) => {
  factory.define('roomutility', db.RoomUtility, {
    roomId: factory.assoc('room', 'id'),
    utilityId: factory.assoc('utility', 'id')
  })
}
