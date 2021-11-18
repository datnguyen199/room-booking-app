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

  describe('POST /sign_up', () => {
    describe('when valid data', () => {
      it('sign up successfully', async () => {
        const addQueue = sinon.spy(sendMailQueue, 'add');
        let userParams = await factory.attrs('guestUser');
        let res = await chai.request(server)
                            .post('/api/v1/sign_up')
                            .send(userParams);
        res.should.have.status(201);
        expect(await db.User.count()).to.equal(1);
        addQueue.restore();
        sinon.assert.calledOnce(addQueue);
      })

      it('sign up successfull with same email of inactive user', async () => {
        let inactiveUser = await factory.create('user');
        let userParams = await factory.attrs('user');
        userParams['email'] = inactiveUser.email;

        let res = await chai.request(server)
                            .post('/api/v1/sign_up')
                            .send(userParams);
        res.should.have.status(201);
        expect(await db.User.count()).to.equal(2);
      })

      it('sign up successfull with same userName of inactive user', async () => {
        let inactiveUser = await factory.create('user');
        let userParams = await factory.attrs('user');
        userParams['userName'] = inactiveUser.userName;

        let res = await chai.request(server)
                            .post('/api/v1/sign_up')
                            .send(userParams);
        res.should.have.status(201);
        expect(await db.User.count()).to.equal(2);
      })
    })

    describe('when invalid data', () => {
      it('sign up failed', async () => {
        const addQueue = sinon.spy(sendMailQueue, 'add');
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
        sinon.assert.callCount(addQueue, 0);
      })

      it('sign up failed with email used by active user', async () => {
        let activeUser = await factory.create('activeUser');
        let userParams = await factory.attrs('user');
        userParams['email'] = activeUser.email;

        let res = await chai.request(server)
                            .post('/api/v1/sign_up')
                            .send(userParams);
        res.should.have.status(422);
        expect(await db.User.count()).to.equal(1);
      })

      it('sign up failed with userName used by active user', async () => {
        let activeUser = await factory.create('activeUser');
        let userParams = await factory.attrs('user');
        userParams['userName'] = activeUser.userName;

        let res = await chai.request(server)
                            .post('/api/v1/sign_up')
                            .send(userParams);
        res.should.have.status(422);
        expect(await db.User.count()).to.equal(1);
      })
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
        let inactiveUser = await factory.create('user');
        await request(server).post('/api/v1/sign_in')
                             .send({userName: inactiveUser.userName, password: 'Aa@123456' })
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
