var io = null;
var sheets = [];
var clients = [];
var dibs = -1;

// get IO from app
exports.setIo = function( _io ) {
  console.log("controller set io")
  io = _io
  init(io)
}

// internal initializer
init = function(io) {
	io.on('connection', function(socket){
   console.log('a user connected');
	 
	 socket.on('disconnect', function(){
		 console.log('user disconnected');
     // remove user
	 
	 	});
  
		// Depricated
		socket.on('chat message', function(msg){
  		console.log('message: ' + msg);
  	});
 
 	 	// exclude beats (!)
  	socket.on('command', function(msg){
  		console.log('command: ' + msg);
    	io.emit('command', msg);
		});
	})
}

// test connection, by sending ping, set through /io/test
exports.test = function (req, res, next) {
  console.log("helloooooooo nurse")
  console.log("has io:", io )
	console.log("---")
	console.log("has req.io:", req.io)
	
  io.emit('command', 'ping')
  res.send({message:"ok"})
}

// update Tracks, POST tracks/
exports.updateTracks = function (req, res, next) {
}

// post client/ [ send back id ]
exports.addClient = function() {
	var uid = 12345
	clients.clients.push(uid)
	
}

// post client/remove/id
exports.removeClient = function() {
	
}

// is this the first client? return true, else false.
// first client may sent music and beats
exports.dibs = function() {
	return true // false
}



