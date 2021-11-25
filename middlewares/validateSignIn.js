const passportConfig = require('../config/passport');
const moment = require('moment');

exports.checkValidWhenSignIn = (req, res, next) => {
  if(!(req.body.username || req.body.password)) {
    return res.status(401).send({ message: 'please enter username and password!' });
  }

  next();
}

exports.checkAuthorizeUser = (req, res, next) => {
  let accessToken = req.headers.authorization.split(' ')[1];

  passportConfig.passport.authenticate('jwt', { session: true }, async function(err, user, info) {
    if(err) { return res.status(401).send({ message: 'Error authenticate!' }); }
    if(!user) { return res.status(401).send({ message: 'Unauthenticate!' }); }
    let userToken = await user.getUserToken();
    if(!userToken || userToken.token != accessToken) {
      return res.status(401).send({ message: 'Unauthenticate!' });
    }

    req.user = user;
    next(null, user);
  })(req, res, next);
}
