const Queue = require('bull');
const dotenv = require('dotenv');

dotenv.config();

const REDIS_URL = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const sendMailQueue = new Queue('sendMail', REDIS_URL);

module.exports = sendMailQueue;
