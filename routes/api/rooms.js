/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room API management
 *
*/

 const express = require('express');
 const router = express.Router();
 const db = require('../../models');
 const { sequelize } = require('../../models');
 const { Op } = require('sequelize');
 const RoomType = db.RoomType;

router.get('/search_room', (req, res) => {
  let rooms = db.Room.findAll({
    include: {
      model: RoomType,
      required: false
    },
    where: {
      [Op.and]: [
        { description: { [Op.like]: `%${req.query.param_search}%` } },
        { numberOfBed: { [Op.eq]: parseInt(req.query.numberOfBed) } },
        { numberOfBathRoom: parseInt(req.query.numberOfBathRoom) },
        { '$RoomType.description$': { [Op.like]: `%${req.query.param_search}%` } }
      ]
    },
    offset: 10,
    limit: 10
  });
  res.status(200).send({ data: rooms });
});

 module.exports = router;
