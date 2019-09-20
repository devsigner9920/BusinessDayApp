var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Business Day App', sub: 'Get Business Day for variety format!' });
});

router.get('/test', function (req, res, next) {
  res.render('test', {title: 'TEST PAGE'});
});

module.exports = router;
