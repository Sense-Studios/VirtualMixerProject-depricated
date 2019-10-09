/*
* Example 2
*
* mixes 2 sold sources together
*
*/

/*
* Example: Mixing a Gampad with four video sources
* https://virtualmixproject.com/docs/reference/index.html
* https://virtualmixproject.com/docs/reference/Module_Mixer.html
*
* Fades two videos together
*/

var renderer = new GlRenderer();

var video1 = new VideoSource( renderer, { src: '/yt/iAFTLaNo7Ag' } )
var uit = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/302/302-720.mp4'} )
var video2 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/348/348-720.mp4'} )

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: video1, source2: video2 });

// finally asign that mixer to the output
var output = new Output( renderer, mixer1 )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

// add a function that moves the mixer handle from left to right.
var c = 0;
var f = 0;
setInterval( function() {
  c += 0.1 // << try and change this in 0.1
  f = ( Math.sin(c) * 0.5 ) + 0.5
  mixer1.pod ( f );
}, 1)
