var express = require('express');
var router = express.Router();

var io_controller = require('../controllers/ioController');
//var io = null

// test
var myObj = {"foo":"bar"}
var clients = {}
var io

// load from somewhere?
var sheets = [
  [
    [ [ ".....", ".....", 8], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    // ----------------------------

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    // ----------------------------

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    // ----------------------------

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
  ],
  [
    [ [ ".....", ".....", 8], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    // ----------------------------

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],

    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ],
    [ [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0], [ ".....", ".....", 0] ]
  ],
]

// passes io to the controllers
router.setIo = function( _io ) {
  console.log("router set io")
  io = _io
  io_controller.setIo(_io)
}

// test delegates to controller
router.get('/test', function(req, res, next) {
  io_controller.test(req, res, next)
})



/* Return data for io. */
router.post('/', function (req, res) {
  // uipdate sheetsres.send('POST request to the homepage')
  // something something res
  console.log("got post,", req.body.sheets)
  console.log("got post,", req.body.sheetindex)

  sheets = JSON.parse( req.body.sheets )
  res.send(sheets[ req.body.sheetindex ])

  //sheets = req.body.sheets
  router.io.emit('command', {'command': 'updatesheets', "payload": req.body })
})

router.get('/', function(req, res, next) {
  //  console.log(msg)
    //$('#messages').append($('<li>').text(msg));
  console.log('this is io', io)
  //console.log('this is app', app )
  io.emit('command', 'ping')
  //console.log( express )

  res.send(sheets)
  /*
  res.render( 'io', {
    title: 'IO EXPRESS'
    //giphy_key: process.env.GIPHYKEY,
    //marduq_key: process.env.MARDUQKEY
  });
  */
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
