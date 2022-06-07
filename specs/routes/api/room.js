process.env.NODE_ENV = 'test';

const chai = require('chai');
const db = require('../../../models');
let chaiHttp = require('chai-http');
let server = require('../../../app');
let factory = require('../../helpers');
let should = chai.should();
let expect = chai.expect;
const request = require('supertest');

chai.use(chaiHttp);

describe('Room API', () => {
  describe('/GET room_searching', () => {
    beforeEach(async () => {
      await db.RoomUtility.destroy({ where: {} });
      await db.Utility.destroy({ where: {} });
      await db.Room.destroy({ where: {} });
      await db.RoomType.destroy({ where: {} });
    })

    describe('when not have params filter', () => {
      var expectedRoomIds = null;

      beforeEach(async () => {
        // let rt1 = await db.RoomType.create({
        //   name: 'room type 1', description: 'desc of room type 1'
        // })
        // let room1 = await db.Room.create({
        //   roomTypeId: rt1.id,
        //   description: 'room 1', rating: 2,
        //   priceANight: 2000
        // })
        let factory1 = factory.create('room');
        let factory2 = factory.create('room');
        let room1 = await factory1;
        let room2 = await factory2;

        expectedRoomIds = [room1.id, room2.id];
      })

      // it('should request successfull and get all rooms', async () => {
      //   let res = await request(server)
      //     .get('/api/v1/room_searching')
      //     .expect(200);
      //   console.log('result isssss: ' + JSON.stringify(res.body['data']));
      // })

      it('should request successfull and get all rooms', (done) => {
        chai.request(server)
          .get('/api/v1/room_searching')
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body['data'].length).to.equal(2);
            let actualRoomIds = res.body['data'].map(room => parseInt(room.id));
            expect(actualRoomIds).to.eql(expectedRoomIds);
            done();
          })
      })
    })

    describe('when have filter params', () => {
      describe('when have param search', () => {
        let expectedRoomIds = null;

        beforeEach(async () => {
          let roomType1 = await factory.create('roomtype', { description: 'roomtype1' });
          let utility = await factory.create('utility', { name: 'utility 1' });
          let room1 = await factory.create('room', { description: 'room1', roomTypeId: roomType1.id });
          let room2 = await factory.create('room', { description: 'room2' });
          await factory.create('roomutility', { roomId: room2.id, utilityId: utility.id })
          expectedRoomIds = [room1.id, room2.id];
        });

        it('when search params satified room name, then get rooms correctly', (done) => {
          chai.request(server)
            .get('/api/v1/room_searching')
            .query({ param_search: 'room' })
            .end((err, res) => {
              res.should.have.status(200);
              expect(res.body['data'].length).to.equal(2);
              expect(res.body['data'].map(room => room.id)).to.eql(expectedRoomIds);
              done();
            })
        })

        it('when search params satified room type, then get rooms correctly', async () => {
          let res = await request(server)
                      .get('/api/v1/room_searching')
                      .query({ param_search: 'roomtype' })
                      .expect(200);
          expect(res.body['data'].length).to.equal(1);
          expect(res.body['data'].map(room => room.id)).to.eql(expectedRoomIds.slice(0, 1));
        })

        it('when search params satified utility name, then get rooms correctly', async () => {
          let res = await request(server)
                      .get('/api/v1/room_searching')
                      .query({ param_search: 'utility' })
                      .expect(200);
          expect(res.body['data'].length).to.equal(1);
          expect(res.body['data'].map(room => room.id)).to.eql(expectedRoomIds.slice(1, 2));
        })

        it('when search params not satified any filter, then get empty room array', async () => {
          let res = await request(server)
                      .get('/api/v1/room_searching')
                      .query({ param_search: 'nothing' })
                      .expect(200);
          expect(res.body['data'].length).to.equal(0);
          expect(res.body['data']).to.eql([]);
        })
      })

      describe('when have other params in filter', () => {
        let expectedRoomIds = null, utilityId = null, roomTypeId = null;

        beforeEach(async () => {
          let roomType1 = await factory.create('roomtype', { description: 'roomtype1' });
          let roomType2 = await factory.create('roomtype', { description: 'roomtype1' });
          let utility = await factory.create('utility', { name: 'utility 1' });
          let room1 = await factory.create('room', { description: 'room1', numberOfBed: 2, roomTypeId: roomType1.id });
          let room2 = await factory.create('room', { description: 'room2', numberOfBathRoom: 2, roomTypeId: roomType2.id });
          let room3 = await factory.create('room')
          await factory.create('roomutility', { roomId: room2.id, utilityId: utility.id })
          await factory.create('roomutility', { roomId: room3.id, utilityId: utility.id })
          expectedRoomIds = [room1.id, room2.id, room3.id];
          utilityId = utility.id; roomTypeId = roomType1.id;
        })

        it('when filter with params search and utility, then get rooms correctly', async () => {
          let res = await request(server)
                      .get('/api/v1/room_searching')
                      .query({ param_search: 'room', utilityIds: `${utilityId}` })
                      .expect(200);
          expect(res.body['data'].length).to.equal(1);
          expect(res.body['data'].map(room => room.id)).to.eql(expectedRoomIds.slice(1, 2));
        })

        it('when filter with params search, roomtype, number of bed, then get rooms correctly', async () => {
          let res = await request(server)
                      .get('/api/v1/room_searching')
                      .query({ param_search: 'room', roomTypeIds: `${roomTypeId}`, numberOfBed: 2 })
                      .expect(200);
          expect(res.body['data'].length).to.equal(1);
          expect(res.body['data'].map(room => room.id)).to.eql(expectedRoomIds.slice(0, 1));
        })

        it('when filter with params search, roomtype, utility, then get rooms correctly', async () => {
          let res = await request(server)
                      .get('/api/v1/room_searching')
                      .query({ param_search: 'room', roomTypeIds: `${roomTypeId}`, utilityIds: `${utilityId}` })
                      .expect(200);
          expect(res.body['data'].length).to.equal(0);
          expect(res.body['data']).to.eql([]);
        })
      })
    })
  })
});
