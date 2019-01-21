var express = require('express');
var request = require('request');
var router = express.Router();

/* GET proxy listing. */
router.get('/1', function(req, res, next) {

  //var newurl = 'http://37.220.36.53:7904';
  var newurl = 'http://93.90.201.81:8000';
  request(newurl).pipe(res);

  /*

  https://directory.shoutcast.com/Search

  var request = require('request');
  app.get('/', function(req,res) {
    //modify the url in any way you want
    var newurl = 'http://google.com/';
    request(newurl).pipe(res);
  });

  */

});

router.get('/nsb', function(req, res, next) { request('http://37.220.36.53:7904').pipe(res); });
router.get('/electrodancefloor', function(req, res, next) { request('http://listen.radionomy.com:80/electrodancefloor').pipe(res); });
router.get('/deepdanceradio', function(req, res, next) { request('https://streaming.radionomy.com/DeepDanceRadio').pipe(res); });
router.get('/hardstyle', function(req, res, next) { request('http://145.239.10.127:8326/streamTitle1').pipe(res); });
router.get('/rap', function(req, res, next) { request('http://149.56.157.81:8569/streamTitle1').pipe(res); });
// router.get( '/dunklenacht', function(req, res, next) { request('http://93.90.201.81:8000').pipe(res); }); //offline

// http://145.239.10.127:8326/streamTitle1 // hardstyle
// http://149.56.157.81:8569/streamTitle1 // RAP singing

module.exports = router;
