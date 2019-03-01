var socket = io();
//var socket = io.connect('http://83.137.150.207:3001');
socket.on('chat message', function(msg){
  console.log(msg)
});

// socket.on('controller', function(msg){
//  document.getElementById( 'controller' ).innerHTML = msg //+ "<br>" + document.getElementById( 'infobox' ).innerHTML
//})

socket.emit('ping', {});
socket.emit('chat message', {});

console.log("SEND: testing controller from gamepadcontroller")
socket.emit('controller', 'testing controller from gamepadcontroller');

var renderer = new GlRenderer();
var gamepad = new GamePadController(renderer)
gamepad.init()
setInterval( gamepad.update, 100 );
gamepad.debug = false

//var left_x
//var left_y
function left_x(_arr) {
  //console.log("euhr", _arr)
  socket.emit('controller', _arr );
  document.getElementById( 'left_x' ).innerHTML = _arr
}

function left_y(_arr) {
  //console.log("euhr", _arr)
  socket.emit('controller', _arr );
  document.getElementById( 'left_y' ).innerHTML = _arr
}


//gamepad.addEventListener( 1, function() { test("Client_617adaf7") } )
//gamepad.addEventListener( 2, function() { test("Client_a7ff3e7")  } )
gamepad.addEventListener( 100, left_x )
gamepad.addEventListener( 101, left_y )

var socketcontroller = new SocketController()

socketcontroller.addEventListener('mass', function(_payload) {
  console.log(">>> got mass",_payload )
})

// target, pin
// Client_1364a3d4
var test = function( _target ) {
  console.log("send test to ", _target)
  socketcontroller.dispatchEvent( "test", _target, {my: "payload"})
}







// ---
