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

import { Router } from 'express';
import { hashSync } from 'bcryptjs';
var router = Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign_up', async(req, res) => {
  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      idNumber: req.body.idNumber,
      district: req.body.district,
      city: req.body.city,
      role: req.body.role,
      email: req.body.email,
      password: hashSync(req.body.password, 8)
    });
    const savedUser = await user.save().catch(err => {
      return res.status(422).json({ errorMessage: err })
    })

    if(savedUser) {
      res.status(201).json({data: savedUser})
    }
  } catch(err) {
    res.status(500).json({errorMessage: err});
  }
})

export default router;
