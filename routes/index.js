var express = require('express');
var io = require('socket.io');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log('this is index')
  console.log( express.io )

  res.render( 'compositions/vmp_demo', { title: 'VirtualMixProject: ' });
  /*
    res.render('index', {
    title: 'Express'
    //giphy_key: process.env.GIPHYKEY,
    //marduq_key: process.env.MARDUQKEY
  });
  */
});

// for testing
router.get('/test/*', function(req, res, next) {});
router.get('/example1', function(req, res, next) {
  res.render('compositions/example1', { title: 'Example 1' });
});

router.get('/docs', function(req, res, next) {
  res.render('docs/');
});

// FIXME: routing scheme should be nicer
// editors and controllers
router.get('/editors/*', function(req, res, next) {
  var repl_url = req.originalUrl.replace('/editors', 'editors')
  res.render(repl_url, { title: 'Editors: ' });
});

// depricated
router.get('/controllers/*', function(req, res, next) {
  var repl_url = req.originalUrl.replace('/controllers', 'remotes')
  res.render(repl_url, { title: 'Remote Controller: ' });
});

router.get('/remotes/*', function(req, res, next) {
  var repl_url = req.originalUrl.replace('/remotes', 'remotes')
  repl_url = repl_url.split('?')[0]
  console.log("replace url was: ", repl_url)
  res.render(repl_url, { title: 'Remote Controller: ' });
});

// for composiions see /views
router.get('/mixer/*', function(req, res, next) {
  //console.log(req, res, next)
  var repl_url = req.originalUrl.replace('/mixer', 'compositions')
  var title = req.originalUrl.replace('/mixer/', '')
  repl_url = repl_url.split('?')[0]
  console.log("replace url was: ", repl_url)
  res.render(repl_url, { title: 'Composition: ' + title });
});

router.get('/nocorsaudio/*', function( req, res, next ) {
  var repl_url = req.originalUrl.replace('/nocorsaudio', '/audio')
  res.header('Access-Control-Allow-Origin', '*');
              // Access-Control-Allow-Origin: <origin> | *
              // Origin
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendFile( path.join(__dirname, '../public', repl_url));
});

var socketConnection = function socketConnection(socket){
  socket.emit('message', {message: 'Hey!'});
};

module.exports = router;
