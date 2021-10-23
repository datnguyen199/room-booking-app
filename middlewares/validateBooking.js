const passportConfig = require('../config/passport');
const moment = require('moment');
const db = require('../models');

exports.checkSignInBooking =  (req, res, next) => {
  let accessToken = req.headers.authorization;

  if(accessToken) {
    passportConfig.passport.authenticate('jwt', { session: true }, function(err, user, info) {
      if(err) { return res.status(401).send({ message: 'Error authenticate!' }); }
      if(!user) { return res.status(401).send({ message: 'Unauthenticate!' }); }

      req.user = user;
      next(null, user);
    })(req, res, next);
  } else {
    next();
  }
}

exports.checkDiscountBooking =  async (req, res, next) => {
  let discountCode = req.body.discountCode,
    currentTime = moment().format('YYYY-MM-DD hh:mm');
  if(discountCode) {
    const discount = await db.Discount.findOne({
      where: { code: discountCode }
    });

    if(discount === null) {
      return res.status(422).send({ message: 'Discount code is not exist, please try again!' });
    } else if (discount.startDate < currentTime || currentTime > discount.endDate ) {
      return res.status(422).send({ message: 'Discount code is expired or not valid, please try again!' });
    }
  }

  next();
}
