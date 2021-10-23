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
jwtOptions.passReqToCallback = true;

let strategy = new JwtStrategy(jwtOptions, async function(req, jwt_payload, done) {
  let user = await db.User.findOne({ where: { id: jwt_payload.id } });

  if (user) {
    req.user = user;
    done(null, user);
  } else {
    done(null, false);
  }
});

passport.use(strategy);

passportConfig['passport'] = passport;
passportConfig['jwtOptions'] = jwtOptions;

module.exports = passportConfig;
