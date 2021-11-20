/**
 * @swagger
 * tags:
 *  name: Booking
 *  description: Booking room API
 */

const express = require('express');
const router = express.Router();
var moment = require('moment');
const db = require('../../models');
const { sequelize } = require('../../models');
const validateBooking = require('../../middlewares/validateBooking');
const sendMailQueue = require('../../config/bullConfigMail');

router.post('/booking',[validateBooking.checkSignInBooking, validateBooking.checkDiscountBooking], async (req, res) => {
  // TODO: check if room is booking in range
  try {
    await sequelize.transaction(async (t) => {
      let room = await db.Room.findByPk(req.body.roomId);
      if(!room) return res.status(404).send({ message: 'Room is not found!' });

      let { checkInDate, checkOutDate } = req.body,
        numberOfNights = moment(checkOutDate).diff(moment(checkInDate), 'days'),
        totalPrice = room.priceANight * numberOfNights,
        booking = null, user = req.user;

      if(user) {
      // booking when user logged in

        let bookingOwner = null;
        if(req.body.bookingOwnerIdNumber) {
          bookingOwner = await db.BookingOwner.create({
            idNumber: req.body.bookingOwnerIdNumber,
            fullname: req.body.bookingOwnerFullName,
            email: req.body.bookingOwnerEmail,
            phone: req.body.bookingOwnerPhone
          }, { transaction: t })
        }
        booking = await user.createBooking({
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          notes: req.body.notes,
          totalPrice: totalPrice,
          bookingOwnerId: bookingOwner == null ? null : bookingOwner.id
        }, { transaction: t })
      } else {
        // booking by guest

        user = await db.User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: `guest ${db.User.count() + 1}`,
          phone: req.body.phone,
          idNumber: req.body.idNumber,
          district: req.body.district,
          city: req.body.city,
          role: 0,
          email: req.body.email,
          password: '123456',
          isGuest: true
        }, { transaction: t })
        booking = await user.createBooking({
          checkInDate: req.body.checkInDate,
          checkOutDate: req.body.checkOutDate,
          notes: req.body.notes,
          totalPrice: totalPrice
        }, { transaction: t })
      }
      await booking.createBookingRoom({
        roomId: room.id,
        rentingPriceANight: room.priceANight
      }, { transaction: t });

      const options = {
        attempts: 2,
      };

      let mailData = {
        toEmail: `${user.email}`,
        subject: 'Booking room app',
        content: `Hi ${user.userName}, you just booked room successfull, thank you!`
      };

      sendMailQueue.add(mailData, options);

      return res.status(200).send({ message: 'booking room successfull!' });
    })
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
});

module.exports = router;
