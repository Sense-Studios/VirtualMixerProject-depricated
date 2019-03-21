/*
* Example 1
*
* mixes 2 sold sources together
*
*/

// create a renderer
var renderer = new GlRenderer();

// create some solids
var red = new SolidSource( renderer, { color: { r: 1.0, g: 0.0, b: 0.0 } } );
var green = new SolidSource( renderer, { color: { r: 0.0, g: 1.0, b: 0.0 } } );
var blue = new SolidSource( renderer, { color: { r: 0.0, g: 0.0, b: 1.0 } } );
var yellow = new SolidSource( renderer, { color: { r: 1.0, g: 1.0, b: 0.0 } } );

var source1 = new VideoSource( renderer, { src: '/video/ignore/veejays_demoreel.mp4' } );
var source2 = new VideoSource( renderer, { src: '/video/ignore/edirol_v4.mp4' } );
var source3 = new VideoSource( renderer, { src: '/video/ignore/1UP_Graffiti_olympic.mp4' } );
var source4 = new VideoSource( renderer, { src: '/video/ignore/composition_12.mp4' } );

// create a mixer, mix red and green
// var mixer1 = new Mixer( renderer, { source1: red, source2: green });
// var mixer2 = new Mixer( renderer, { source1: blue, source2: yellow });
// var mixer3 = new Mixer( renderer, { source1: mixer1, source2: mixer2 });

var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
var mixer2 = new Mixer( renderer, { source1: source3, source2: source4 });
var mixer3 = new Mixer( renderer, { source1: mixer1, source2: mixer2 });

// set up a game pad
var gamepad = new GamePadController( renderer ) // , mixer1, mixer2, mixer3
var midicontroller = new MidiController( renderer )

// gamepad socket
var gamepad_socket_controller = new SocketController({title: "gamepad"})

// midi socket controller
var midi_socket_controller = new SocketController({title: "midi"})

var keyboard1 = new KeyboardController( renderer )

// set a temp video source to test with
// var source1 = new VideoSource( renderer, { src: '/video/ignore/veejays_demoreel.mp4' } );

// set up image processing
var saturation = new ColorEffect( renderer, { source: mixer3 } )
var hue = new ColorEffect( renderer, { source: saturation } )
var contrast = new ColorEffect( renderer, { source: hue } )

// finally asign that mixer to the output
// var output = new Output( renderer, mixer3 )
var output = new Output( renderer, mixer3 )



// var analysis = new AudioAnalysis( renderer, { audio: '/audio/rage_hard.mp3' } );
// analysis.mod = 0.5
// analysis.bpm = 24

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

// ------------------------------------------------------------------------------

gamepad.debug = true
gamepad.gamepad_index = 1

function mycallback( _value ) {
  console.log("called back:", _value)
}

// oringal GANSTA SENSE STYLE
// _mixer1.pod( leftx / 2+0.5 )
// _mixer2.pod( leftx / 2+0.5 )
// _mixer3.pod( lefty / 2+0.5 )

// oringal GANSTA SENSE STYLE
// _mixer1.pod(Math.abs(leftx))
// _mixer2.pod(Math.abs(lefty))
// _mixer3.pod(lefty/2+0.5)

// Buttons
button_0 = function() {}
button_1 = function() {}
button_2 = function() {}
button_3 = function() {}

var lock_4 = false
button_4 = function() {
  if (lock_4) return
  lock_4 = true
  source1.video.playbackRate = 0
  source2.video.playbackRate = 0
  source3.video.playbackRate = 0
  source4.video.playbackRate = 0
  console.log("playback")
  setTimeout( function() {
    source1.video.playbackRate = 1
    source2.video.playbackRate = 1
    source3.video.playbackRate = 1
    source4.video.playbackRate = 1
    lock_4 = false
  }, 100 )
}

var lock_5 = false
button_5 = function() {
  if (lock_5) return
  console.log("jump!")
  lock_5 = true
  source1.jump()
  source2.jump()
  source3.jump()
  source4.jump()
  setTimeout( function() {
    lock_5 = false
  }, 400 )
}

var lock_6 = false
button_6 = function(_arr) {
  var _val = _arr[1]
  if (lock_6) return
  if (!source1.video.seeking) source3.video.currentTime = source1.currentTime() - _val * 2
  setTimeout( function() {
    lock_6 = false
  }, 200 )
}

var lock_7 = false
button_7 = function(_arr) {
  var _val = _arr[1]
  if (lock_7) return
  source3.video.playbackRate = _val * 5
  setTimeout( function() {
    lock_7 = false
  }, 50 )
}

var lock_left = false
var lock_left_button = false
button_10 = function(_val) {
  if (lock_left_button) return
  lock_left_button = true
  lock_left = !lock_left
  setTimeout( function() { lock_left_button = false }, 350 )
}

var lock_right = false
var lock_right_button = false
button_11 = function(_val) {
  if (lock_right_button) return
  lock_right_button = true
  lock_right = !lock_right
  setTimeout( function() { lock_right_button = false }, 350 )
}

// Axis
left_x = function(_arr) {
  var _val = _arr[1]
  if (lock_left) return;
  var setx = ( _val + 1 ) / 2
  if (setx >= 0.9 ) setx = 1
  if (setx <= 0.12 ) setx = 0
  //console.log( "x: ", setx )
  mixer1.pod( setx )
  mixer2.pod( setx )
}
left_y = function(_arr) {
  var _val = _arr[1]
  if (lock_left) return;
  var sety = ( _val + 1 ) / 2
  if (sety >= 0.9 ) sety = 1
  if (sety <= 0.12 ) sety = 0
  //console.log( "y: ", sety )
  mixer3.pod( sety )
}

right_x = function(_arr) {
  var _val = _arr[1]
  if (!lock_right) saturation.extra( _val)
}
right_y = function( _arr ) {
  var _val = _arr[1]
  if (!lock_right) hue.extra(_val )
}

button_8 = function( e ) {
  console.log("data, button 8, ", e)
}

gamepad.addEventListener( 0, button_0 )
gamepad.addEventListener( 1, button_1 )
gamepad.addEventListener( 2, button_2 )
gamepad.addEventListener( 3, button_3 )
gamepad.addEventListener( 4, button_4 )
gamepad.addEventListener( 5, button_5 )
gamepad.addEventListener( 6, button_6 )
gamepad.addEventListener( 7, button_7 )
gamepad.addEventListener( 8, button_8 )
// gamepad.addEventListener( 9, button_9 )
gamepad.addEventListener( 10, button_10 )
gamepad.addEventListener( 11, button_11 )

gamepad.addEventListener( 100, left_x )
gamepad.addEventListener( 101, left_y )
gamepad.addEventListener( 102, right_x )
gamepad.addEventListener( 103, right_y )

saturation.effect(62)
saturation.extra(2.0)
hue.effect(63)
hue.extra(0.1)
contrast.effect(61)
contrast.extra(0.5)
saturation.debug = false
hue.debug =false
// var bpm = analysis;

var  midislider = function(e) {
  console.log("data slider 48", e )
}
var midibutton = function(e) {
  console.log("data! button 1", e )
}

midicontroller.addEventListener( 1, midibutton )
midicontroller.addEventListener( 48, midislider )

// -----------------------------------------------------------------------------
// SOCKETS
// -----------------------------------------------------------------------------


gamepad_socket_controller.addEventListener( 100, left_x )
gamepad_socket_controller.addEventListener( 101, left_y )
gamepad_socket_controller.addEventListener( 102, right_x )
gamepad_socket_controller.addEventListener( 103, right_y )

midi_socket_controller.addEventListener( 1, midibutton )
midi_socket_controller.addEventListener( 48, midislider )
/*
setTimeout( function() {
  console.log("got local socket id: ", socketcontroller.target)
}, 200 )

document.querySelectorAll('.button')[0].onclick = function() { gamepad.connect() }


socketcontroller.addEventListener( 666, function( msg ) {
  console.log( "got test ", msg )
})

socketcontroller.addEventListener( 0, button_0 )
socketcontroller.addEventListener( 1, button_1 )

socketcontroller.addEventListener( "controller", function( msg ) {
  console.log( "got controller ", msg )
})
*/

keyboard1.addEventListener( 87, function(arr) { console.log(arr)} )


// ---
