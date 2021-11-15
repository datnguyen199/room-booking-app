process.env.NODE_ENV = 'test';

const chai = require('chai');
const db = require('../../models');
let chaiHttp = require('chai-http');
let server = require('../../app');
let factory = require('../helpers');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);

// beforeEach(async () => {
//   let rt1 = await db.RoomType.create({
//     name: 'room type 1', description: 'desc of room type 1'
//   })
//   let rt2 = await factory.create('roomtype');
//   console.log('room type 2: ' + JSON.stringify(rt2));
//   let room1 = await db.Room.create({
//     roomTypeId: rt1.id,
//     description: 'room 1', rating: 2,
//     priceANight: 2000
//   })
// })

describe('Room API', () => {
  describe('/GET room_searching', () => {
    beforeEach(async () => {
      await db.Room.destroy({ where: {} });
      await db.RoomType.destroy({ where: {} });
    })
    describe('when not have params filter', () => {
      it('should request successfull and get all rooms', (done) => {
        chai.request(server)
          .get('/api/v1/room_searching')
          .query({param_search: 'room'})
          .end((err, res) => {
            res.should.have.status(200);
            let rooms = db.Room.findAll({});
            console.log('all room =================> : ' + JSON.stringify(rooms));
            expect(db.Room.count({ where: {} })).to.equal(1);
            expect(JSON.stringify(res.body['data'])).to.equal('{}');
            done();
          })
      })
    })
  })
});
