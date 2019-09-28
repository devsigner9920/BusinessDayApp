var express = require('express');
var BizDay = require('../models/BizDayModel');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Business Day App', sub: 'Get Business Day for variety format!' });
});

router.get('/json', function (req, res) {
  var jsonData = {};

  BizDay.find(function (err, data) {
    if (err) return res.status(500).send({ error: 'database failure' });
    res.json(data);
  });
});

router.get('/bizDay/json', function (req, res) {
  if(req.query['term'] == 'Year') {
    BizDay.findByYear(req.query)
      .then((bizDay) => {
        if(!bizDay) return res.status(404).send({ error: 'not found' });
        res.json(bizDay);
      }).catch((err) => {
        res.status(500).send({ error: 'database failure' });
      });
  } else if(req.query['term'] == 'Month') {
    BizDay.findByMonth(req.query)
      .then((bizDay) => {
        if(!bizDay) return res.status(404).send({ error: 'not found' });
        res.json(bizDay);
      }).catch((err) => {
        res.status(500).send({ error: 'database failure' });
      });
  } else if(req.query['term'] == 'ETC') {
    BizDay.findByBetweenDate(req.query)
    .then((bizDay) => {
      if(!bizDay) return res.status(404).send({ error: 'not found' });
      res.json(bizDay);
    }).catch((err) => {
      res.status(500).send({ error: 'database failure' });
    });
  } else {
    res.status(500).send({ error: 'Something Wrong...' });
  }
});

router.get('/bizDay/xls', function (req, res) {
  res.end();
});

router.get('/bizDay/csv', function (req, res) {
  res.end();
});

module.exports = router;
