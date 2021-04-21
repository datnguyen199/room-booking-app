const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use(
  'signup',
  new localStrategy(
    {}
  )
)
