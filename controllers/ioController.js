var io = null;
var sheets = [];
var clients = [];
var controllers = []
var _self = this

/**
 * @description
 *  The ioController is a databaseless socket/ router controller
 *
 * @implements Controller
 * @constructor require('ioController')
 * @example ---
 */

// get IO from app
exports.setIo = function( _io ) {
  console.log(" IO controller set io")
  io = _io
  init(io)
}

// internal initializer
init = function(io) {
	io.on('connection', function(socket){
    console.log('a user connected') //, socket);

    _self.addClient(socket)

	  socket.on('disconnect', function(socket){
		    console.log('user disconnected', socket, socket.uuid);
        // remove user
        _self.removeClient(socket)
	 	});

		// Depricated
		socket.on('chat message', function(msg){
  		console.log('message: ', msg);
  	});

 	 	// exclude beats (!)
  	socket.on('command', function(msg){

      // Command list

  		if ( msg.command != "beats"        ) {
        console.log('command: ', msg);
        io.emit('command', msg )
      }else{
        io.emit('command', {"command":"beats", "payload": msg.payload});
      }

      if ( msg.command == "updatetracks" )  _self.updateTracks();
      if ( msg.command == "dibs"         )  _self.dibs( msg, socket );
      if ( msg.command == "identify"     )  _self.addClient( socket );
		});


    // either midi or gamepad? -- now for gamepad
    socket.on('initiate_controller', function( _controller ){
      // O hi, I haz the controller!
      // kind of a has_and_belongs_to_many in Rails

      //controllers.push( _controller )
      //uuid
      //clients

    });

    socket.on('test', function( _msg ) {
      console.log("got your test ", _msg )
      console.log("got your clients")
      clients.map(function(c) {
        console.log( c.uuid, _msg.target, c.uuid == _msg.target )
        if ( c.uuid == _msg.target) {
          c.emit("test", _msg)
        }
      })
    })

    /*
    socket.on('ping', function( _msg ) {
      if ( c.uuid == _msg.target) {
        c.emit("ping")
      }
    })

    socket.on('ping', function( _msg ) {
      // client uuid send pong
      // update status?
    }
    */

    socket.on('derp', function( _msg ) {
      console.log("got your message wiihoe", _msg )
    })

    /*
    socket.on('request_controller', function(msg){
      // get controller for/by id
    })

    socket.on('controller_status', function(msg) {
      // show controllers
    })

    socket.on('controller', function(msg) {
      // find client get its socket
      console.log('controller: ', msg);
      io.emit('controller', msg );
    });
    */
	})
}

// -----------------------------------------------------------------------------
// test connection, by sending ping, set through /io/test
exports.test = function (req, res, next) {
  console.log(" IO helloooooooo nurse")
  console.log(" IO has io:", io )
	console.log(" IO ---")
	console.log(" IO has req.io:", req.io)

  io.emit('command', 'ping')
  res.send({message:"ok"})
}

// -----------------------------------------------------------------------------

// update Tracks, POST tracks/
exports.updateTracks = function (req, res, next) {
  console.log(" IO update tracks")
}

// post client/ [ send back id ]
exports.addClient = function(_socket) {
	var uuid = "Client_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _socket.uuid = uuid
  console.log(" IO add client: ", uuid)
	clients.push(_socket)
  _socket.emit('command', {"command":"welcome", "payload":uuid})
}

// post client/remove/id
exports.removeClient = function(_socket) {
  console.log("remove client", _socket);
  var kill = null;
  clients.forEach(function(client, index) {
    if (_socket == client) var kill = index;
  });

  if (kill != null) {
    console.log(" IO remove client", kill, clients[kill].uuid );
    clients.splice(kill,1);
  }
}

exports.submitToClient = function( _uuid ) {
  console.log(" -- get socket -- ")
  var _s = findSocketByUuid( _uuid )
  console.log("i can has socket for", _uuid, _s)
}

// is this the first client? return true, else false.
// first client may sent music and beats
exports.dibs = function(msg, _socket) {
  console.log(" IO dibs!", msg.payload ) // should be a client UUID
  console.log(clients.length)
  // dibs = msg.payload
  clients.forEach(function(client) {
    if (_socket == client) console.log("MATCH")
    console.log( client.uuid, msg.payload )
  })

  io.emit('command', msg);

	return true // false
}
