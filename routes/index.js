var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express'
    //giphy_key: process.env.GIPHYKEY,
    //marduq_key: process.env.MARDUQKEY
  });
});

// for testing
router.get('/test/*', function(req, res, next) {});
router.get('/example1', function(req, res, next) {
  res.render('compositions/example1', { title: 'Example 1' });
});

// for composiions see /views
router.get('/mixer/*', function(req, res, next) {
  //console.log(req, res, next)
  var repl_url = req.originalUrl.replace('/mixer', 'compositions')
  var title = req.originalUrl.replace('/mixer/', '')
  res.render(repl_url, { title: 'Composition: ' + title });
});

module.exports = router;
