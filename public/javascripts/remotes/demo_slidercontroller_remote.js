var socketcontroller = new SocketController()

if ( navigator.userAgent.includes("Android") || navigator.userAgent.includes("iOS") ) {
  down_event = "touchstart";
  up_event = "touchend";
} else {
  down_event = "mousedown";
  up_event = "mouseup";
}

var get_client_id = ()=> { return document.getElementById('socket_client_id').value }

document.getElementById('butt_1').addEventListener( down_event, function(e) { socketcontroller.send( get_client_id(), 1, [1,1]); console.log(down_event, "start") } )
document.getElementById('butt_1').addEventListener( up_event,   function(e) { socketcontroller.send( get_client_id(), 1, [1,0]); console.log(up_event, "end") } )
document.getElementById('butt_2').addEventListener( down_event, (e)=> { socketcontroller.send( get_client_id(), 2, [2,1] ) } )
document.getElementById('butt_2').addEventListener( up_event,   (e)=> { socketcontroller.send( get_client_id(), 2, [2,0] ) } )
document.getElementById('butt_3').addEventListener( down_event, (e)=> { socketcontroller.send( get_client_id(), 3, [3,1] ) } )
document.getElementById('butt_3').addEventListener( up_event,   (e)=> { socketcontroller.send( get_client_id(), 3, [3,0] ) } )
document.getElementById('butt_4').addEventListener( down_event, (e)=> { socketcontroller.send( get_client_id(), 4, [4,1] ) } )
document.getElementById('butt_4').addEventListener( up_event,   (e)=> { socketcontroller.send( get_client_id(), 4, [4,0] ) } )

console.log("oioioi")
