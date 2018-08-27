var express = require('express');
var router = express.Router();

// console.log("test test")
// console.log(process.env.TEST)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    giphy_key: process.env.GIPHYKEY,
    marduq_key: process.env.MARDUQKEY
  });
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
