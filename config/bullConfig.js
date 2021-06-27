const Queue = require('bull');
const dotenv = require('dotenv');

dotenv.config();

const { REDIS_URL } = process.env;

// Initiating the Queue with a redis instance
const sendMailQueue = new Queue('sendMail', REDIS_URL);

module.exports = sendMailQueue;
