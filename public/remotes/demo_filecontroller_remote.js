var socketcontroller = new SocketController()

if ( navigator.userAgent.includes("Android") || navigator.userAgent.includes("iOS") ) {
  down_event = "touchstart";
  up_event = "touchend";
} else {
  down_event = "mousedown";
  up_event = "mouseup";
}

var get_client_id = ()=> { return document.getElementById('socket_client_id').value }

function getRangedate(_id) {
  return document.getElementById(_id).value / 100
}

document.getElementById('butt_1').addEventListener( down_event, (e)=> { socketcontroller.send( get_client_id(), 1, [1,1]); console.log(down_event, "start") } )
document.getElementById('butt_1').addEventListener( up_event,   (e)=> { socketcontroller.send( get_client_id(), 1, [1, getRangedate('range_1') ] ); console.log(up_event, "end") } )
document.getElementById('butt_2').addEventListener( down_event, (e)=> { socketcontroller.send( get_client_id(), 2, [2,1] ) } )
document.getElementById('butt_2').addEventListener( up_event,   (e)=> { socketcontroller.send( get_client_id(), 2, [2, getRangedate('range_2') ] ) } )
document.getElementById('butt_3').addEventListener( down_event, (e)=> { socketcontroller.send( get_client_id(), 3, [3,1] ) } )
document.getElementById('butt_3').addEventListener( up_event,   (e)=> { socketcontroller.send( get_client_id(), 3, [3, getRangedate('range_3') ] ) } )
document.getElementById('butt_4').addEventListener( down_event, (e)=> { socketcontroller.send( get_client_id(), 4, [4,1] ) } )
document.getElementById('butt_4').addEventListener( up_event,   (e)=> { socketcontroller.send( get_client_id(), 4, [4, getRangedate('range_4') ] ) } )

document.getElementById('range_1').addEventListener( 'input',   (e)=> { socketcontroller.send( get_client_id(), "alpha_video_1", getRangedate('range_1') ) } )
document.getElementById('range_2').addEventListener( 'input',   (e)=> { socketcontroller.send( get_client_id(), "alpha_video_2", getRangedate('range_2') ) } )
document.getElementById('range_3').addEventListener( 'input',   (e)=> { socketcontroller.send( get_client_id(), "alpha_video_3", getRangedate('range_3') ) } )
document.getElementById('range_4').addEventListener( 'input',   (e)=> { socketcontroller.send( get_client_id(), "alpha_video_4", getRangedate('range_4') ) } )


function click_image( elm ) {
  //socketcontroller.send( get_client_id(), 1, [1,1]); console.log(down_event, "start") }  
  var target = null
  document.querySelectorAll('.slider_select').forEach( function(_elm) { if ( _elm.checked ) target = _elm.value } )
  if (target == null) return
  var file = elm.src.substr(0, elm.src.length - 4 ) + ".mp4"
  socketcontroller.send( get_client_id(), target, file );
  console.log("send file", file, target  )
}


// add the images
var u = new Utils();
u.get('/api/list', function(_files) {
  console.log(JSON.parse(_files))
  var html = ""
  JSON.parse(_files).forEach( function(_file) {
    html += "<img onClick='click_image(this)')' src='/video/ignore/clutter2/" + _file + "'>"
  })
  document.getElementById('thumb_container').innerHTML = html
})
