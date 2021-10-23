process.env.NODE_ENV = 'test';

const chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../app');
let should = chai.should();

chai.use(chaiHttp);

describe('Room API', () => {
  describe('/GET room_searching', () => {
    it('should request successfull', (done) => {
      chai.request(server)
        .get('/api/v1/room_searching')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    })
  })
});
