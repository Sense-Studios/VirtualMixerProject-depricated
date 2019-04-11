var express = require('express');
var router = express.Router();

var api_controller = require('../controllers/apiController');
//var io = null

// test
var myObj = {"foo":"bar"}
var clients = {}

// load from somewhere?
// passes io to the controllers
router.setApi = function() {
}

// test delegates to controller
router.get('/test', function(req, res, next) {
  api_controller.test(req, res, next)
    res.send("check your logs")
})

router.get('/v1/test', function(req, res, next) {
  api_controller.test(req, res, next)
  res.send("check your logs")
})

router.get('/generate', function(req, res, next) {
  api_controller.generateThumbnails();
  res.send("check your logs")
})

router.get('/list', function(req, res, next) {
  api_controller.listFiles( function( _files ) {
    console.log("your files:", _files)
    res.json( _files )
  });
})


/* Return data for io. */
router.post('/v1/', function (req, res) {
  // update sheetsres.send('POST request to the homepage')
  res.send("all was well")
})




router.get('/', function(req, res, next) {
  console.log('got /io root, ping') //, io)
  res.send("all was well")
});


  /*
  res.render( 'io', {
    title: 'IO EXPRESS'
    //giphy_key: process.env.GIPHYKEY,
    //marduq_key: process.env.MARDUQKEY
  });




/*
var init_io = function() {
  io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
      // remove user

    });

    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    });

    socket.on('command', function(msg){
      console.log('command: ' + msg);
      io.emit('command', msg);
    });
  });
}
*/

module.exports = router;
