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
 const esClient = require('../../config/elasticsearch')
 const { Op } = require('sequelize');

router.get('/room_searching', async (req, res) => {
  let andCondition = { [Op.and]: [] }
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 1;
  let lowestPrice = parseInt(req.query.lowestPrice);
  let highestPrice = parseInt(req.query.highestPrice);
  let paramSearch = req.query.param_search || '';
  let conditionSearch = {};

  if(paramSearch !== '') {
    conditionSearch[Op.or] = {
      description: { [Op.like]: `%${paramSearch}%` },
      '$RoomType.description$': { [Op.like]: `%${paramSearch}%` },
      '$RoomUtilities.Utility.name$': { [Op.like]: `%${paramSearch}%` },
      '$RoomUtilities.Utility.description$': { [Op.like]: `%${paramSearch}%` }
    };
  }

  if(req.query.numberOfBed || req.query.numberOfBathRoom ||
    req.query.numberOfBedRoom || req.query.roomTypeIds || req.query.utilityIds) {
    conditionSearch = Object.assign(conditionSearch, andCondition);
  }

  if(req.query.numberOfBed) {
    conditionSearch[Op.and].push({ numberOfBed: { [Op.eq]: parseInt(req.query.numberOfBed) } })
  }

  if(req.query.numberOfBathRoom) {
    conditionSearch[Op.and].push({ numberOfBathRoom: { [Op.eq]: parseInt(req.query.numberOfBathRoom) } })
  }

  if(req.query.numberOfBedRoom) {
    conditionSearch[Op.and].push({ numberOfBedRoom: { [Op.eq]: parseInt(req.query.numberOfBedRoom) } })
  }

  if(req.query.roomTypeIds) {
    conditionSearch[Op.and].push(
      { '$RoomType.id$': { [Op.in]: req.query.roomTypeIds.split(',').map(Number) } }
    )
  }

  if(req.query.utilityIds) {
    conditionSearch[Op.and].push(
      { '$RoomUtilities.Utility.id$': { [Op.in]: req.query.utilityIds.split(',').map(Number) } }
    )
  }

  if(Number.isInteger(lowestPrice) && Number.isInteger(highestPrice)
      && lowestPrice < highestPrice && (lowestPrice > 0 && lowestPrice <= 49999999)) {
    if(conditionSearch[Op.and]) {
      conditionSearch[Op.and].push({ priceANight: { [Op.between]: [lowestPrice, highestPrice] } })
    } else {
      conditionSearch[Op.and] = { priceANight: { [Op.between]: [lowestPrice, highestPrice] } }
    }
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
  // conditionSearch[Op.and].push({ '$RoomType.description$': { [Op.like]: `%${paramSearch}%` } })

  let rooms = await db.Room.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    subQuery: false,
    include: [ {
      model: db.RoomType,
    }, {
      model: db.RoomUtility,
      include: {
        model: db.Utility
      }
    }],
    where: conditionSearch,
    offset: (offset - 1) * limit,
    limit: limit
  });

  res.status(200).send({ data: rooms });
});

router.get('/es_room_searching', async (req, res) => {
  let keyword = req.query.param_search || '';
  let limit = req.query.limit || 10;
  let offset = req.query.offset || 1;

  let body = {
    size: limit,
    from: (offset - 1) * limit,
    query: {
      // match_all: {}
      // match_phrase: {
      //   'description': {
      //     'query': keyword,
      //     'zero_terms_query': 'all'
      //   }
      // }
      bool: {
        must: [
          {
            'multi_match': {
              'query': keyword,
              'fields': ['description', 'room_type.room_type_name', 'utilities.utility_name'],
              'operator': 'OR'
            }
          }
        ]
      }
    }
  };
  esClient.search({ index: 'es-booking-rooms', body: body }).then(results => {
    console.log(results);
    res.status(200).send({ data: results.hits.hits });
  }).catch(err => {
    console.log(err);
    res.status(400).send({ error: err });
  })
})

router.get('/es_room_suggestion', async (req, res) => {
  let keyword = req.query.param_search || '';
  // let limit = req.query.limit || 10;
  // let offset = req.query.offset || 1;
  let body = {
    // size: limit,
    // from: (offset - 1) * limit,
    'query' : {
      'multi_match': {
        'query': keyword,
        'fields': ['description', 'room_type.room_type_name', 'utilities.utility_name'],
        'operator': 'OR'
      }
    },
    'suggest' : {
      'text' : keyword,
      'description_phrase': {
        'phrase': {
          'field': 'description',
          'size': 1,
          'gram_size': 3,
          'direct_generator': [ {
            'field': 'description',
            'suggest_mode': 'always'
          } ],
          'highlight': {
            'pre_tag': '<em>',
            'post_tag': '</em>'
          }
        }
      },
      'suggest-description' : {
        'term' : {
          'field' : 'description'
        }
      },
      'suggest-room-type' : {
        'term' : {
          'field' : 'room_type.room_type_name'
        }
      },
      'suggest-utilities' : {
        'term' : {
          'field' : 'utilities.utility_name'
        }
      }
    }
  };

  esClient.search({ index: 'es-booking-rooms', body: body }).then(results => {
    res.status(200).send({ data: results });
  }).catch(err => {
    console.log(err);
    res.status(400).send({ error: err });
  })
})

 module.exports = router;
