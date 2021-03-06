var express = require('express');
var BizDay = require('../models/BizDayModel');
var js2xmlparser = require("js2xmlparser");
var router = express.Router();
var https = require('https');
var proxy = require('express-http-proxy');

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

router.get('/bizDay/xml', function (req, res) {
  res.set('Content-Type', 'text/xml');
  if(req.query['term'] == 'Year') {
    BizDay.findByYear(req.query)
      .then((bizDay) => {
        if(!bizDay) return res.status(404).send({ error: 'not found' });
        res.send(js2xmlparser.parse("bizDays", bizDay[0]));
      }).catch((err) => {
        res.status(500).send({ error: 'database failure' });
      });
  } else if(req.query['term'] == 'Month') {
    BizDay.findByMonth(req.query)
      .then((bizDay) => {
        if(!bizDay) return res.status(404).send({ error: 'not found' });
        res.send(js2xmlparser.parse("bizDays", bizDay[0]));
      }).catch((err) => {
        res.status(500).send({ error: 'database failure' });
      });
  } else if(req.query['term'] == 'ETC') {
    BizDay.findByBetweenDate(req.query)
    .then((bizDay) => {
      if(!bizDay) return res.status(404).send({ error: 'not found' });
      res.send(js2xmlparser.parse("bizDays", bizDay));
    }).catch((err) => {
      res.status(500).send({ error: 'database failure' });
    });
  } else {
    res.status(500).send({ error: 'Something Wrong...' });
  }
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

router.use('/api/kakao/book', proxy('dapi.kakao.com', {
  proxyReqPathResolver: function (req) {
    var parts = req.url.split('?');
    var queryString = parts[1];
    return '/v3/search/book' + (queryString ? '?' + queryString : '');
  },
  proxyReqOptDecorator: function (proxyReqOpts) {
    proxyReqOpts.headers['Content-Type'] = 'application/json;charset=UTF-8';
    proxyReqOpts.headers['Authorization'] = 'KakaoAK 2819d31d91b5f967b01f33aaef3810a2';
    proxyReqOpts.method = 'GET';
    return proxyReqOpts;
  },
  https: true
}));

module.exports = router;
