const jwt = require('jsonwebtoken');
require('dotenv').config();
const isProduction = process.env.NODE_ENV == 'production'

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction, // https in production
  signed: true,
  maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  // sameSite: "None"
}

exports.getRefreshToken = (payload) => {
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY)
  })

  return refreshToken;
}

exports.getPayloadRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}
