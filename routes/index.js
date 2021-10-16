var express = require('express');
var router = express.Router();
var db = require('../models');
// var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  let rs = db.Room.scope('defaultScope', 'byStatusAndRating', { method: ['byStatusAndRating', 1, 2]}).findAll();
  // let rs = db.Room.scope('available').findAll();
  res.status(200).send({ data: rs });
});

module.exports = router;
