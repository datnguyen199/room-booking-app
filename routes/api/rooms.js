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
 const { Op } = require('sequelize');

router.get('/search_room', (req, res) => {
  let orCondition = { [Op.or]: [] }
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 1;
  let lowestPrice = req.query.lowestPrice || 0;
  let highestPrice = req.query.highestPrice || 50000000;
  let conditionSearch = {
    [Op.and]: [
      { description: { [Op.like]: `%${req.query.param_search}%` } },
      { priceANight: { [Op.between]: [parseInt(lowestPrice), parseInt(highestPrice)] } }
    ]
  };

  if(req.query.numberOfBed !== undefined || req.query.numberOfBathRoom !== undefined || req.query.numberOfBedRoom !== undefined) {
    conditionSearch = Object.assign(conditionSearch, orCondition);
  }

  if(req.query.numberOfBed !== undefined) {
    conditionSearch[Op.or].push({ numberOfBed: { [Op.eq]: parseInt(req.query.numberOfBed) } })
  }

  if(req.query.numberOfBathRoom !== undefined) {
    conditionSearch[Op.or].push({ numberOfBathRoom: { [Op.eq]: parseInt(req.query.numberOfBathRoom) } })
  }

  if(req.query.numberOfBedRoom !== undefined) {
    conditionSearch[Op.or].push({ numberOfBedRoom: { [Op.eq]: parseInt(req.query.numberOfBedRoom) } })
  }

  if(req.query.roomTypeIds !== undefined) {
    conditionSearch[Op.and].push(
      { '$RoomType.id$': { [Op.in]: req.query.roomTypeIds.split(',').map(Number) } }
    )
  }

  if(req.query.utilityIds !== undefined) {
    conditionSearch[Op.and].push(
      { '$RoomUtilities.Utility.id$': { [Op.in]: req.query.utilityIds.split(',').map(Number) } }
    )
  }


  // condition search
  // {
  //   [Op.or]: [
  //     { numberOfBed: { [Op.eq]: parseInt(req.query.numberOfBed) } },
  //     { numberOfBathRoom: parseInt(req.query.numberOfBathRoom) },
  //     { numberOfBathRoom: parseInt(req.query.numberOfBathRoom) }
  //   ],
  //   [Op.and]: [
  //     { description: { [Op.like]: `%${req.query.param_search}%` } },
  //     { '$RoomType.description$': { [Op.like]: `%${req.query.param_search}%` } },
  //     { '$RoomType.id$': { [Op.in]: [1, 2] } },
  //     { '$RoomUtilities.Utility.id$': { [Op.in]: [3, 4]}}
  //   ]
  // }

  conditionSearch[Op.and].push({ '$RoomType.description$': { [Op.like]: `%${req.query.param_search}%` } })

  let rooms = db.Room.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    subQuery: false,
    include: [ {
      model: db.RoomType
    },
      {
      model: db.RoomUtility,
      include: {
        model: db.Utility,
        where: {
          description: { [Op.like]: `%${req.query.param_search}%` }
        }
      }
    }],
    where: conditionSearch,
    offset: offset,
    limit: limit
  });
  res.status(200).send({ data: rooms });
});

 module.exports = router;
