const passport = require('passport');
const passportJWT = require('passport-jwt');
const db = require('../models');
require('dotenv').config();

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
let passportConfig = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_KEY;

let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, done) {
  console.log('payload received', jwt_payload);
  let user = db.User.findOne({ where: { id: jwt_payload.id } });

  if (user) {
    done(null, jwt_payload);
  } else {
    done(null, false);
  }
});

passport.use(strategy);

passportConfig['passport'] = passport;
passportConfig['jwtOptions'] = jwtOptions;

module.exports = passportConfig;
