var express = require('express');
//var test = require('../model/test');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // test.find({}, function (err, tests) {
  //   if(err) return res.status(500).send({error: 'database failure'});
  //   console.log(tests);
  // });
  res.render('index', { title: 'Business Day App', sub: 'Get Business Day for variety format!' });
});

router.get('/bizDay/xml', function (req, res) {
  res.end();
});

router.get('/bizDay/json', function (req, res) {
  res.end();
});

router.get('/bizDay/xls', function (req, res) {
  res.end();
});

router.get('/bizDay/csv', function (req, res) {
  res.end();
});

module.exports = router;
