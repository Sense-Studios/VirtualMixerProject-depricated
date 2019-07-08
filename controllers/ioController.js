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

    socket.on('ping', function(socket){
      socket.emit('pong', {time:(new Date()).getTime()});
    })

	  socket.on('disconnect', function(socket){
		    console.log('user disconnected', socket, socket.uuid);
        _self.removeClient(socket) // remove user
	 	});

    // -------------------------------------------------------------------------
		// Depricated, not implemented
		socket.on('chat message', function(msg){
  		console.log('message: ', msg);
  	});

    // -------------------------------------------------------------------------
 	 	// exclude beats (!)
    // Depricated, not used, see addClient
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

    // -------------------------------------------------------------------------
    socket.on('controller', function( _msg ) {      
      var client_uuids = _msg.client.replace(/ /g,'')
      client_uuids = client_uuids.split(","); // split the data
      clients.map( function( client ) {
        client_uuids.forEach( function( client_uuid ) {
          if ( client.uuid == client_uuid) {
            // set the data back to singular, this has 2 advantages
            // 1) the socket controller can stay single-threaded
            // 2) the individual clients have no way of knowing the 'others'
            //    only the remote knows
            _msg.client = client_uuid
            client.emit("controller", _msg)
          }
        })
      })
    })

    socket.on('request_uuid', function( _old_uuid, _new_uuid ) {
      clients.map( function( client ) {
        if ( client.uuid == _new_uuid ) {
          console.log(" Denied: ", _new_uuid, " was already assigned! ")
          return
        }
      })

      clients.map( function( client ) {
        if ( client.uuid == _old_uuid ) {
          client.uuid = _new_uuid
          socket.emit('command', {"command":"reset_uuid", "payload":_new_uuid})
        }
      })
    })

    // not implemented
    socket.on('status', function(msg){
      // should get data from client
    })

    // test only
    socket.on('derp', function( _msg ) {
      console.log("got your message wiihoe", _msg )
    })
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
	//var uuid = "Client_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  var uuid = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
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

// depricated ?
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
