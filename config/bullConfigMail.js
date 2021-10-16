const Queue = require('bull');
const dotenv = require('dotenv');

dotenv.config();

const REDIS_URL = process.env.REDIS_URL;

const sendMailQueue = new Queue('sendMail', REDIS_URL);

module.exports = sendMailQueue;
