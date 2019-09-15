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

// http://37.220.36.53:7904
// http://208.123.119.17:7904
// http://37.220.36.53:7904
/*
http://directory.shoutcast.com/?q=65_Breakbeat_61
[playlist]
numberofentries=4
File1=http://37.220.36.53:7904
Title1=(#1 - 8/1000) NSB Radio
Length1=-1
File2=http://208.123.119.17:7904
Title2=(#2 - 2/200) NSB Radio
Length2=-1
File3=http://37.220.36.53:8904
Title3=(#3 - 20/1000) NSB Radio
Length3=-1
File4=http://37.220.36.51:8906
Title4=(#4 - 3/10) NSB Radio
Length4=-1
Version=2
*/
router.get('/nsb', function(req, res, next) { request('http://208.123.119.17:7904').pipe(res); });
router.get('/electrodancefloor', function(req, res, next) { request('http://listen.radionomy.com:80/electrodancefloor').pipe(res); });
router.get('/deepdanceradio', function(req, res, next) { request('https://streaming.radionomy.com/DeepDanceRadio').pipe(res); });
router.get('/hardstyle', function(req, res, next) { request('http://145.239.10.127:8326/streamTitle1').pipe(res); });
router.get('/rap', function(req, res, next) { request('http://149.56.157.81:8569/streamTitle1').pipe(res); });
// router.get( '/dunklenacht', function(req, res, next) { request('http://93.90.201.81:8000').pipe(res); }); //offline

router.get('/breakbeat', function(req, res, next) { request('http://178.33.115.87:8004/stream').pipe(res); });
router.get('/trance', function(req, res, next) { request('http://137.74.45.136:80/pulstranceAAC64.mp3').pipe(res); });
router.get('/subfm', function(req, res, next) { request('http://5.39.71.159:8729/').pipe(res); });
router.get('/lounge', function(req, res, next) { request('http://185.33.21.112:80/chilloutlounge_128').pipe(res); });


/*
http://178.33.115.87:8004/stream .. breakbeat

File1=http://213.251.190.165:80/pulstranceAAC64.mp3
Title1=(#1 - 3/600) PulsRadio TRANCE
Length1=-1
File2=http://87.98.153.24:80/pulstranceAAC64.mp3
Title2=(#2 - 4/600) PulsRadio TRANCE
Length2=-1
File3=http://51.15.76.3:80/pulstranceAAC64.mp3
Title3=(#3 - 19/2000) PulsRadio TRANCE
Length3=-1
File4=http://193.200.42.211:80/pulstranceAAC64.mp3
Title4=(#4 - 19/1000) PulsRadio TRANCE
Length4=-1
File5=http://137.74.45.136:80/pulstranceAAC64.mp3
Title5=(#5 - 21/600) PulsRadio TRANCE
*/

// http://145.239.10.127:8326/streamTitle1 // hardstyle
// http://149.56.157.81:8569/streamTitle1 // RAP singing

module.exports = router;
