var express = require('express');
var BizDay = require('../models/BizDayModel');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Business Day App', sub: 'Get Business Day for variety format!'});
});

router.get('/json', function (req, res) {
    var jsonData = {};
    BizDay.find(function (err, data) {
        if(err) return res.status(500).send({error: 'database failure'});
        res.send(data);
    });
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
