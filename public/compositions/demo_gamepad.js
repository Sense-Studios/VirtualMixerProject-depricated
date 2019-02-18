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

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: red, source2: green });
var mixer2 = new Mixer( renderer, { source1: blue, source2: yellow });
var mixer3 = new Mixer( renderer, { source1: mixer1, source2: mixer2 });

var gamepad = new GamePadController( renderer, mixer1, mixer2, mixer3 )

// finally asign that mixer to the output
var source1 = new VideoSource( renderer, { src: '/video/ignore/veejays_demoreel.mp4' } );

var saturation = new ColorEffect( renderer, { source: source1 } )
var hue = new ColorEffect( renderer, { source: saturation } )
var contrast = new ColorEffect( renderer, { source: hue } )

// var output = new Output( renderer, mixer3 )
var output = new Output( renderer, contrast )



// var analysis = new AudioAnalysis( renderer, { audio: '/audio/rage_hard.mp3' } );
// analysis.mod = 0.5
// analysis.bpm = 24

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

// ------------------------------------------------------------------------------

saturation.effect(62)
saturation.extra(2.0)
hue.effect(63)
hue.extra(0.1)
contrast.effect(61)
contrast.extra(0.5)
saturation.debug =true
// var bpm = analysis;

// add a function that moves the mixer handle from left to right.
var c = 0;
setInterval( function() {
  c += 0.01
  // mixer1.pod ( ( Math.sin(c) * 0.5 ) + 0.5 );
  saturation.extra( ( ( Math.sin( c ) * 0.5 ) + 0.5 ) ) ;
  //hue.extra( ( ( Math.sin( c ) * 0.5 ) + 0.5 ) ) ;
})


document.querySelectorAll('.button')[0].onclick = function() { gamepad.connect() }
