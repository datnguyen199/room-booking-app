process.env.NODE_ENV = 'test';

const chai = require('chai');
const db = require('../../../models');
const sinon = require('sinon');
let chaiHttp = require('chai-http');
let server = require('../../../app');
let factory = require('../../helpers');
let should = chai.should();
let expect = chai.expect;
const request = require('supertest');
const sendMailQueue = require('../../../config/bullConfigMail');

chai.use(chaiHttp);

describe('User API', () => {
  beforeEach(async () => {
    await db.User.destroy({ where: {} });
  })

  afterEach(() => {
    sinon.restore();
  })

  // const myExternalLibrary = {
  //   getJSON(url) {
  //     return this.otherMethod(url);
  //   },
  //   otherMethod(url) {
  //     return url;
  //   },
  // };

  describe('POST /sign_up', () => {
    describe('when valid data', () => {
      it('sign up successfully', async () => {
        let userParams = await factory.attrs('guestUser');
        let res = await chai.request(server)
                            .post('/api/v1/sign_up')
                            .send(userParams);
        res.should.have.status(201);
        expect(await db.User.count()).to.equal(1);

        // const addQueue = sinon.spy(sendMailQueue, 'add');
        // sinon.assert.calledOnce(addQueue);
      })
    })

    describe('when invalid data', () => {
      it('sign up failed', async () => {
        let userParams = {
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 'username',
          password: 'password'
        }
        let res = await chai.request(server)
                            .post('/api/v1/sign_up')
                            .send(userParams);
        res.should.have.status(422);
        expect(await db.User.count()).to.equal(0);
        expect(res.body).to.have.property('errorMessage');
      })
      // const url = 'url';
      // const m1 = sinon.spy(myExternalLibrary, 'getJSON');
      // const m2 = sinon.stub(myExternalLibrary, 'otherMethod');
      // m2.returns('new url');
      // let rs = myExternalLibrary.getJSON(url);
      // sinon.assert.calledOnce(m1);
      // sinon.assert.calledOnce(m2);
      // expect(rs).to.equal('new url');
    })
  })

  describe('POST /sign_in', () => {
    describe('when sign in with correct data', () => {
      it('sign in success with active user', async () => {
        let user = await factory.create('activeUser');
        let res = await request(server).post('/api/v1/sign_in')
                                       .send({userName: user.userName, password: 'Aa@123456' })
                                       .expect('Content-Type', /json/)
                                       .expect(200);
        expect(res.body).to.have.property('accessToken');
      })

      it('sign in failed with inactive user', async () => {
        let user = await factory.create('user');
        await request(server).post('/api/v1/sign_in')
                             .send({userName: user.userName, password: 'Aa@123456' })
                             .expect('Content-Type', /json/)
                             .expect(302);
      })

      it('sign in failed with guest user', async () => {
        let user = await factory.create('guestUser');
        await request(server).post('/api/v1/sign_in')
                             .send({userName: user.userName, password: 'Aa@123456' })
                             .expect('Content-Type', /json/)
                             .expect(401);
      })
    })

    describe('when sign in with incorrect data', () => {
      it('sign in failed with wrong username or password', async () => {
        let user = await factory.create('activeUser');
        let res = await request(server).post('/api/v1/sign_in')
                                       .send({userName: user.userName, password: 'wrong_password' })
                                       .expect('Content-Type', /json/)
                                       .expect(401);
        expect(res.body['message']).to.equal('username or password is wrong!');
      })
    })
  })
})
