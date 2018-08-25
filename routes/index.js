var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/example1', function(req, res, next) {
  res.render('example1', { title: 'Express' });
});

router.get('/mixer5', function(req, res, next) {
  res.render('mixer5', { title: 'Express' });
});


module.exports = router;
