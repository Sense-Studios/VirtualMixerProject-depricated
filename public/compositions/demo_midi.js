/*
* Example: Mixing a Gampad with four video sources
* https://virtualmixproject.com/docs/reference/index.html
* https://virtualmixproject.com/docs/reference/Controller_MidiController.html
* https://virtualmixproject.com/docs/reference/Module_Chain.html
*
* If all went well, you should be able to fade four videos together with your faders
*/

var renderer = new GlRenderer();

var video1 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/302/302-720.mp4'} )
var video2 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/348/348-720.mp4'} )
var video3 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/344/344-720.mp4'} )
var video4 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/351/351-720.mp4'} )

var chain1 = new Chain( renderer, { sources: [ video1, video2, video3, video4 ] } );
var midi1 = new MidiController( renderer )
midi1.debug = true
var output = new Output( renderer, chain1 )

renderer.init();
renderer.render();

// ------------------------------------------------------------

// change this to select gamepad, if multiple devices can identify as gamepad
// 0, 1, 2 etc.
// look for the index in the console log; like this:
// Gamepad connected at index 2: Xbox 360 Controller (XInput STANDARD GAMEPAD). 17 buttons, 4 axes.
// VM743 console_runner-1df7d3399bdc1f40995a35209755dcfd8c7547da127f6469fd81e5fba982f6af.js:1 init GamePadController
// the gamepad_index is then 2

// first button
midi1.addEventListener( 0, ( arr )=> console.log( arr ) )

// first four faders on a AKAI APCmini
midi1.addEventListener( 48, ( arr )=> chain1.setChainLink( 0, arr[2] / 128 ) )
midi1.addEventListener( 49, ( arr )=> chain1.setChainLink( 1, arr[2] / 128 ) )
midi1.addEventListener( 50, ( arr )=> chain1.setChainLink( 2, arr[2] / 128 ) )
midi1.addEventListener( 51, ( arr )=> chain1.setChainLink( 3, arr[2] / 128 ) )
