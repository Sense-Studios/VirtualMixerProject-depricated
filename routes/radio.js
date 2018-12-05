var express = require('express');
var request = require('request');
var router = express.Router();

/* GET proxy listing. */
router.get('/1', function(req, res, next) {

  //var newurl = 'http://37.220.36.53:7904';
  var newurl = 'http://93.90.201.81:8000';
  request(newurl).pipe(res);

  /*

  var request = require('request');
  app.get('/', function(req,res) {
    //modify the url in any way you want
    var newurl = 'http://google.com/';
    request(newurl).pipe(res);
  });

  */


});

router.get('/nsb', function(req, res, next) {
  request('http://37.220.36.53:7904').pipe(res);
});

router.get('/dunklenacht', function(req, res, next) {
  request('http://93.90.201.81:8000').pipe(res);
});


module.exports = router;
