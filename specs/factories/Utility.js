module.exports = (factory, db) => {
  factory.define('utility', db.Utility, {
    name: factory.sequence('Utility.name', n => `Utility ${n}`),
    description: factory.chance('word')
  })
}
