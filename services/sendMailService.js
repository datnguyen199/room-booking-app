const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendMail = async mailData => {
  let transporter = nodemailer.createTransport({
    service: 'Sendgrid',
    auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD }
  });
  let mailOptions = {
    from: process.env.SENGRID_SENDER,
    to: mailData.mailTo,
    subject: mailData.subject,
    text: mailData.text
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendMail;
