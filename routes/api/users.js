/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - idNumber
 *         - district
 *         - city
 *         - role
 *         - userName
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: the auto-generated id
 *         firstName:
 *           type: string
 *           description: first name of user
 *         lastName:
 *           type: string
 *           description: last name of user
 *         email:
 *           type: string
 *           description: email of user
 *         phone:
 *           type: string
 *           description: phone number of user
 *         district:
 *           type: string
 *           description: district of user
 *         city:
 *           type: string
 *           description: city of user
 *         idNumber:
 *           type: string
 *           description:  id number of user
 *         role:
 *           type: integer
 *           description: role of user
 *         userName:
 *           type: string
 *           description: user name of user
 *         password:
 *           type: string
 *           description: password of user
 *       example:
 *         id: 1
 *         firsName : Nguyen
 *         lastName : DatNguyen
 *         email    : datnguyen@gmail.com
 *         phone    : 123456789
 *         district : Ha Dong
 *         city     : HaNoi
 *         idNumber : 123456789
 *         role     : admin
 *         userName : DatNguyen
 *         password : 1234
*/

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User managing API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: return list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

const express = require('express'),
  bcrypt = require('bcrypt'),
  crypto = require('crypto'),
  router = express.Router(),
  db = require('../../models'),
  { sequelize } = require('../../models'),
  jwt = require('jsonwebtoken'),
  validateSignIn = require('../../middlewares/validateSignIn'),
  passportConfig = require('../../config/passport'),
  sendMailQueue = require('../../config/bullConfigMail'),
  moment = require('moment'),
  auth = require('../../auth/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * @swagger
 * /api/v1/sign_up:
 *  post:
 *    summary: user sign up
 *    tags: [Users]
 *    requestBody:
 *      require: true
 *      data:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: sign up user successful
 *        data:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      422:
 *        description: invalid data
 *      500:
 *        description: server error
 */
router.post('/sign_up', async(req, res) => {
  await sequelize.transaction(async (t) => {
    var verifiedToken = crypto.randomBytes(16).toString('hex');
    return db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      phone: req.body.phone,
      idNumber: req.body.idNumber,
      district: req.body.district,
      city: req.body.city,
      role: req.body.role,
      email: req.body.email,
      password: req.body.password,
      confirmationToken: verifiedToken,
      confirmationExpireAt: new Date(Date.now() + ( 3600 * 1000 * 24)) // exprired after 1 day
    }, { transaction: t }).then((user) => {
      const options = {
        attempts: 2,
      };
      let mailData = {
        toEmail: `${user.email}`,
        subject: 'Booking room app',
        content: `Hi ${user.userName}, Please verify your account by clicking the link: http:\/\/${req.headers.host}\/api\/v1\/confirmation?token=${verifiedToken}`
      };

      return sendMailQueue.add(mailData, options);
    })
  }).then(() => {
    res.status(201).send({ message: 'A verification link has been sent to your email, please check email to active your account' });
  }).catch((err) => {
    console.log(err);
    if(err.name === 'SequelizeValidationError') {
      const errObj = {};
      err.errors.map( er => {
        errObj[er.path] = er.message;
      })
      return res.status(422).json({errorMessage: errObj});
    }
    res.status(500).json({errorMessage: err});
  })
})

router.get('/confirmation', async (req, res) => {
  try {
    let confirmToken = req.query.token;
    let user = await db.User.findOne({ where: { isGuest: false, confirmationToken: confirmToken }, attributes: ['id', 'isActive', 'confirmationExpireAt'] });
    if(!user || user.isActive) return res.status(400).send({ message: 'bad request' });
    if(moment().isAfter(moment(user.confirmationExpireAt))) {
      return res.status(400).send({ message: 'token is expired!' });
    }

    user.set({
      isActive: true,
      confirmationToken: null,
      confirmationExpireAt: null
    });
    await user.save();
    res.status(200).send({ message: 'active user success!' });
  } catch(err) {
    console.log(err);
    res.status(500).send({ message: 'server error' });
  }
});

router.post('/sign_in', [validateSignIn.checkValidWhenSignIn], async (req, res) => {
  let user = await db.User.findOne({where: { userName: req.body.userName, isGuest: false }})
  if(!user) {
    return res.status(401).send({ message: 'username or password is wrong!' });
  } else {
    let passwordValid = bcrypt.compareSync(req.body.password, user.password);
    if(!passwordValid) { return res.status(401).send({ message: 'username or password is wrong!' }) }
    if(!user.isActive) { return res.status(302).send({ message: 'Your account have not active yet, please active you account!'}) }
    await sequelize.transaction(async (t) => {
      try {
        let payload = { id: user.id },
          token = jwt.sign(payload, passportConfig.jwtOptions.secretOrKey),
          refreshToken = auth.getRefreshToken(payload);
          userToken = await user.getUserToken();

        user.refreshToken = refreshToken;
        user.refreshTokenExpiredAt = moment().add(30, 'days');
        await user.save({ transaction: t });
        if(userToken) {
          userToken.token = token;
          await userToken.save({ transaction: t });
        } else {
          await user.createUserToken({
            token: token
          }, { transaction: t });
        }
        res.cookie('refreshToken', refreshToken, auth.COOKIE_OPTIONS);

        res.status(200).send({ message: 'Login successfull!', accessToken: token, refreshToken: refreshToken });
      } catch(error) {
        console.log(error);
        res.status(500).json({ message: error } )
      }
    })
  }
});

router.post('/refresh_token', async function(req, res) {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if(refreshToken) {
    await sequelize.transaction(async (t) => {
      try {
        const payloadRefreshToken = auth.getPayloadRefreshToken(refreshToken);
        const userId = payloadRefreshToken.id;
        let user = await db.User.findOne({ where: { id: userId }});
        if(!user || user.refreshToken != refreshToken) return res.status(401).send({ message: 'token is invalid' });
        if(moment().isAfter(moment(user.refreshTokenExpiredAt))) {
          return res.status(400).send({ message: 'token is expired!' });
        }
        let payload = { id: user.id },
          newToken = jwt.sign(payload, passportConfig.jwtOptions.secretOrKey),
          newRefreshToken = auth.getRefreshToken(payload),
          userToken = await user.getUserToken();
          userToken.token = newToken;
          user.refreshToken = newRefreshToken;
          user.refreshTokenExpiredAt = moment().add(30, 'days');
        let tokenSave = userToken.save({ transaction: t }),
          userSave = user.save({ transaction: t });
          await tokenSave;
          await userSave;
          res.cookie('refreshToken', newRefreshToken, auth.COOKIE_OPTIONS);

          res.status(200).send({ message: 'success', token: newToken, refreshToken: newRefreshToken });
      } catch(error) {
        if(error.name === 'SequelizeValidationError') {
          const errObj = {};
          error.errors.map( er => {
            errObj[er.path] = er.message;
          })
          return res.status(422).json({errorMessage: errObj});
        }
        console.log(error);
        res.status(500).json({ message: error } )
      }
    })
  } else {
    res.status(401).send({ message: 'token is invalid' });
  }
})

router.post('/logout', passportConfig.passport.authenticate('jwt', { session: false }), async function(req, res) {
  await sequelize.transaction(async (t) => {
    try {
      let currentUser = req.user,
        userToken = await currentUser.getUserToken();
      currentUser.refreshToken = null;
      await currentUser.save({ transaction: t });
      await userToken.destroy({ transaction: t });
      res.clearCookie('refreshToken');

      res.status(200).send({ message: 'logout successfull' });
    } catch(error) {
      console.log(error);
      res.status(500).json({ message: error } )
    }
  })
})

router.get('/protected', [validateSignIn.checkAuthorizeUser], function(req, res) {
  res.json('Success! You can now see this without a token.');
});

module.exports = router;
