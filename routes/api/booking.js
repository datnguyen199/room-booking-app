/**
 * @swagger
 * tags:
 *  name: Booking
 *  description: Booking room API
 */

const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const db = require('../../models');
const { sequelize } = require('../../models');
const validateBooking = require('../../middlewares/validateBooking');

router.post('/booking',[validateBooking.checkSignInBooking, validateBooking.checkDiscountBooking], async (req, res) => {
  // TODO: check if room is booking in range
  try {
    await sequelize.transaction(async (t) => {
      if(req.user) {
        // let room = await db.Room.findByPk(req.body.roomId);
        // if(!room) return res.status(404).send({ message: 'Room is not found!' });

        let totalPrice = 2000 * 3;
        let bookingOwner = null;
        if(req.body.bookingOwnerIdNumber) {
          bookingOwner = await db.BookingOwner.create({
            idNumber: req.body.bookingOwnerIdNumber,
            fullname: req.body.bookingOwnerFullName,
            email: req.body.bookingOwnerEmail,
            phone: req.body.bookingOwnerPhone
          }, { transaction: t })
        }
        const booking = await db.Booking.create({
          checkInDate: req.body.checkInDate,
          checkOutDate: req.body.checkOutDate,
          notes: req.body.notes,
          totalPrice: totalPrice,
          userId: req.user.id,
          bookingOwnerId: bookingOwner == null ? null : bookingOwner.id
        }, { transaction: t })

        return res.status(200).send({ message: 'booking room successfull!' });
      } else {

      }
    })
  } catch(error) {
    if(error.name === 'SequelizeValidationError') {
      const errObj = {};
      error.errors.map( er => {
        errObj[er.path] = er.message;
      })
      return res.status(422).json({errorMessage: errObj});
    }
    res.status(500).json({ message: error } )
  }
});

module.exports = router;
