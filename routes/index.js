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

module.exports = router;
