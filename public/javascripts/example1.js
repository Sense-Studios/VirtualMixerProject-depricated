// create a renderer
var renderer = new GlRenderer();

// create some solids
var red = new SolidSource( renderer, { color: { r: 1.0, g: 0.0, b: 0.0 } } );
var green = new SolidSource( renderer, { color: { r: 0.0, g: 1.0, b: 0.0 } } );
var blue = new SolidSource( renderer, { color: { r: 0.0, g: 0.0, b: 1.0 } } );

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: red, source2: green });

// finally asign that mixer to the output
var output = new Output( renderer, mixer1 )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

// add a function that moves the mixer handle from left to right.
var c = 0;
setInterval( function() {
  c += 0.01
  mixer1.pod ( ( Math.sin(c) * 0.5 ) + 0.5 );
})
