var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/example1', function(req, res, next) {
  res.render('compositions/example1', { title: 'Express' });
});

router.get('/mixer5', function(req, res, next) {
  res.render('compositions/mixer5', { title: 'Express' });
});

router.get('/notv', function(req, res, next) {
  res.render('compositions/notv', { title: 'Express' });
});


module.exports = router;
