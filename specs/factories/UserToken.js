module.exports = (factory, db) => {
  factory.define('usertoken', db.UserToken, {
    token: 'accesstoken',
    userId: factory.assoc('user', 'id')
  })
}
