var socket = io();
//var socket = io.connect('http://83.137.150.207:3001');
socket.on('chat message', function(msg){
  console.log(msg)
  //$('#messages').append($('<li>').text(msg));
});

socket.on('command', function(msg){
  console.log(msg)
})

socket.on('controller', function(msg){
  //console.log("got controller message:", msg)
  document.getElementById( 'infobox' ).innerHTML = msg //+ "<br>" + document.getElementById( 'infobox' ).innerHTML
})

socket.emit('ping', {});
socket.emit('chat message', {});


socket.emit('controller', 'sadasdsadsadsadsadsads');

var renderer = new GlRenderer();
var gamepad = new GamePadController(renderer)
gamepad.init()
setInterval( gamepad.update, 100 );
gamepad.debug = false

//var left_x
//var left_y
function left_x(_arr) {
  socket.emit('controller', _arr );
}

function left_y(_arr) {
  socket.emit('controller', _arr );
}

gamepad.addEventListener( 100, left_x )
gamepad.addEventListener( 101, left_y )
