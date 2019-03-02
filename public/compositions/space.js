// -----------------------------------------------------------------------------
var renderer = new GlRenderer();

// ## SOURCES ##################################################################

// create sources
//var testSource1 = new GifSource(   renderer, { src: '' } );
var testSource1 = new VideoSource( renderer, { src: '' } );
var testSource2 = new VideoSource( renderer, { src: '' } );
var testSource3 = new VideoSource( renderer, { src: '' } );
var testSource4 = new VideoSource( renderer, { src: '' } );
var testSource5 = new VideoSource( renderer, { src: '' } );
var testSource6 = new VideoSource( renderer, { src: '' } );
//var testSource6 = new TextSource( renderer, {} );
var testSource7 = new VideoSource( renderer, { src: '' } );
var testSource8 = new VideoSource( renderer, { src: '' } );
var blacksource = new SolidSource( renderer, { color: { r: 0, g: 0, b: 0 } } );

var red = new SolidSource( renderer, { color: { r: 1.0, g: 0, b: 0 } } );
var green = new SolidSource( renderer, { color: { r: 0, g: 1.0, b: 0 } } );
var blue = new SolidSource( renderer, { color: { r: 0, g: 0, b: 1.0 } } );

var clutter = new VideoSource( renderer, { src: '/video/16MMDUSTproc.mp4' } );


// ## MODULES ##################################################################
// var chain1 = new Chain( renderer, { sources: [ testSource1, testSource2, testSource3, testSource4, red, green, blue, testSource8 ] })

var mixer1 = new Mixer( renderer, {source1: testSource1, source2: blacksource} )
var mixer2 = new Mixer( renderer, {source1: testSource2, source2: mixer1} )
var mixer3 = new Mixer( renderer, {source1: testSource3, source2: mixer2} )
var mixer4 = new Mixer( renderer, {source1: testSource4, source2: mixer3} )

//var mixer1 = new Mixer( renderer, {source1: blacksource, source2: testSource1} )
//var mixer2 = new Mixer( renderer, {source1: mixer1, source2: testSource2 } )
//var mixer3 = new Mixer( renderer, {source1: mixer2, source2: testSource3 } )
//var mixer4 = new Mixer( renderer, {source1: mixer3, source2: testSource4 } )

// create 2 mixers, A/B and mixer/B
//var mixer1 = new Mixer( renderer, { source1: testSource6, source2: testSource3 } );
//var mixer3 = new Mixer( renderer, { source1: testSource1, source2: mixer1 } );
//mixer3.mixMode(3) // NAM

// create a mixer, simple a/b
//var mixer4 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
//var mixer5 = new Mixer( renderer, { source1: mixer1, source2: clutter } );
//mixer5.mixMode(9)

//var switcher1 = new Switcher( renderer, { source1: mixer5, source2: mixer3 } );

// ## ADDONS ##################################################################

// create the filemanager addon for the sources
// var giphymanager1 = new GiphyManager( testSource1 )
var filemanager1 = new FileManager( testSource1 )
var filemanager2 = new FileManager( testSource2 )
var filemanager3 = new FileManager( testSource3 )
var filemanager4 = new FileManager( testSource4 )

filemanager1.load_set("/sets/space.json")
filemanager2.load_set("/sets/space.json")
filemanager3.load_set("/sets/space.json")
filemanager4.load_set("/sets/space.json")

// create a bpm addon

// add the bpm to the mixer (-pod)
// bpm.add( mixer4.pod )
// bpm.add( mixer1.pod )

var bpm = new BPM( renderer )

// create midi controller
var midi1 = new MidiController(renderer, {})

// effect
var saturation = new ColorEffect( renderer, { source: mixer4 } )
var hue = new ColorEffect( renderer, { source: saturation } )
var contrast = new ColorEffect( renderer, { source: hue } )

// ## OUTPUT ###################################################################

// set the output node (needs to be last!)
var output = new Output( renderer, contrast )
//var output = new Output( renderer, testSource6 )

// ## CONTROLLERS ##############################################################






// -----------------------------------------------------------------------------

// add a controller to mixer and bpm
//var numpad1 = new NumpadBpmMixerControl( renderer, mixer1, bpm )
//numpad1.addBpm( bpm )
//numpad1.addMixer( mixer1 )
//numpad1.addMixer( mixer4 )

//var keyboard1 = new KeyboardMixerControl( renderer, mixer1, bpm )

// var gamepad = new GamePad( renderer, mixer1, mixer2, mixer3 )
// var gamepad1 = new GamePadDiagonalControl( renderer, mixer1, mixer2, mixer3 )
// var gamepad2 = new GamePadVerticalControl( renderer, mixer1, mixer2, mixer3, mixer4, mixer5, mixer6, mixer7 )
// var firebase1 = new FireBaseControl( renderer, mixer1, mixer2, mixer3 )
// firebase1.addMixer( mixer1 ) ?
// firebase1.addMixer( mixer2 ) ?
// firebase1.addMixer( mixer3 ) ?
// firebase1.addFileManager( filemanager1) ?

// ## RENDER ###################################################################

// -----------------------------------------------------------------------------
renderer.init();         // init
renderer.render();       // start update & animation

// --------------------------------------------------------------------------------

saturation.effect(62)
saturation.extra(2.0)
hue.effect(63)
hue.extra(0.1)
contrast.effect(61)
contrast.extra(0.5)

var mod = 64
midi1.addEventListener( 48, function(e) { mixer1.pod( e[2]/mod ) } )
midi1.addEventListener( 49, function(e) { mixer2.pod( e[2]/mod ) } )
midi1.addEventListener( 50, function(e) { mixer3.pod( e[2]/mod ) } )
midi1.addEventListener( 51, function(e) { mixer4.pod( e[2]/mod ) } )

midi1.addEventListener( 52, function(e) { saturation.extra(e[2]/127) } )
midi1.addEventListener( 53, function(e) { hue.extra(e[2]/127) } )
midi1.addEventListener( 54, function(e) { contrast.extra(e[2]/127) } )

midi1.addEventListener( 52, function(e) {
  console.log("data!", e[1], e[2] )
  //chain1.setChainLink(4, e[2]/127 )
})

midi1.addEventListener( 53, function(e) {
  console.log("data!", e[1], e[2] )
  //chain1.setChainLink(5, e[2]/127 )
})

midi1.addEventListener( 54, function(e) {
  console.log("data!", e[1], e[2] )
  //chain1.setChainLink(6, e[2]/127 )
})

// -----------------------------------------------------------------------------

midi1.addEventListener( 0, filemanager1.change )
midi1.addEventListener( 1, filemanager2.change )
midi1.addEventListener( 2, filemanager3.change )
midi1.addEventListener( 3, filemanager4.change )


function dotest(_option ) {
  console.log( "--> ", _option)
}

//midi1.addEventListener( 8, function() { mixer1.blendmodes.unshift( mixer1.blendmodes.pop() ); mixer1.blendMode(mixer1.blendmodes[0]) })
//midi1.addEventListener( 9, function() { mixer2.blendmodes.unshift( mixer2.blendmodes.pop() ); mixer2.blendMode(mixer2.blendmodes[0]) })
//midi1.addEventListener( 10, function() { mixer3.blendmodes.unshift( mixer3.blendmodes.pop() ); mixer3.blendMode(mixer3.blendmodes[0]) })
//midi1.addEventListener( 11, function() { mixer4.blendmodes.unshift( mixer4.blendmodes.pop() ); mixer4.blendMode(mixer4.blendmodes[0]) })

function switchBlendmode( _mixer, doubleclick, evt, button ) {
  if ( evt[0] == 128 && !doubleclick) return
  if (doubleclick) {
    _mixer.blendMode(1);
    _mixer.blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ];
  }else{
    //_mixer.blendmodes.unshift( _mixer.blendmodes.pop() );
    _mixer.blendmodes.push(_mixer.blendmodes.splice(0,1)[0] )
    console.log("blend", _mixer.blendmodes[0])
    _mixer.blendMode(_mixer.blendmodes[0])
  }

  if (_mixer.blendMode() == 1 ) {
    midi1.send([ 0x90, button, 1]);
  } else if (_mixer.blendMode() == 18 ) {
    midi1.send([ 0x90, button, 5]);
  } else{
    midi1.send([ 0x90, button, 3]);
  }
}

function switchMixmode( _mixer, doubleclick, evt, button ) {
  if ( evt[0] == 128 && !doubleclick ) return
  if (doubleclick) {
    _mixer.mixMode(1);
    _mixer.mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  }else{
    //_mixer.mixmodes.unshift( _mixer.mixmodes.pop() );
    _mixer.mixmodes.push( _mixer.mixmodes.splice(0,1)[0] )
    console.log("swtich", _mixer.mixmodes[0] )
    _mixer.mixMode(_mixer.mixmodes[0])
  }

  if (_mixer.mixMode() == 1 ) {
    midi1.send([ 0x90, button, 1]);
  } else if (_mixer.mixMode() == 18 ) {
    midi1.send([ 0x90, button, 5]);
  } else{
    midi1.send([ 0x90, button, 3]);
  }
}

function reset( _mixer, doubleclick, evt, button ) {
  _mixer.blendMode(1);
  _mixer.blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ];
  _mixer.mixMode(1);
  _mixer.mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  _mixer.pod(_mixer.pod())
  midi1.send([ 0x90, button-48, 1, 0x90, button-56, 1]);
}

midi1.addEventListener( 8, function(evt, doubleclick) { switchBlendmode( mixer1, doubleclick, evt, 8 ) })
midi1.addEventListener( 9, function(evt, doubleclick) { switchBlendmode( mixer2, doubleclick, evt, 9 ) })
midi1.addEventListener( 10, function(evt, doubleclick) { switchBlendmode( mixer3, doubleclick, evt, 10 ) })
midi1.addEventListener( 11, function(evt, doubleclick) { switchBlendmode( mixer4, doubleclick, evt, 11 ) })

midi1.addEventListener( 16, function(evt, doubleclick) { switchMixmode( mixer1, doubleclick, evt, 16 ) })
midi1.addEventListener( 17, function(evt, doubleclick) { switchMixmode( mixer2, doubleclick, evt, 17 ) })
midi1.addEventListener( 18, function(evt, doubleclick) { switchMixmode( mixer3, doubleclick, evt, 18 ) })
midi1.addEventListener( 19, function(evt, doubleclick) { switchMixmode( mixer4, doubleclick, evt, 19 ) })

midi1.addEventListener( 24, testSource1.jump )
midi1.addEventListener( 25, testSource2.jump )
midi1.addEventListener( 26, testSource3.jump )
midi1.addEventListener( 27, testSource4.jump )

midi1.addEventListener( 64, function(evt, doubleclick) { reset( mixer1, doubleclick, evt, 64 ) })
midi1.addEventListener( 65, function(evt, doubleclick) { reset( mixer2, doubleclick, evt, 65 ) })
midi1.addEventListener( 66, function(evt, doubleclick) { reset( mixer3, doubleclick, evt, 66 ) })
midi1.addEventListener( 67, function(evt, doubleclick) { reset( mixer4, doubleclick, evt, 67 ) })

testSource1.video.addEventListener('seeking', function() { midi1.send([ 0x90, 0, 6] );} )
testSource2.video.addEventListener('seeking', function() { midi1.send([ 0x90, 1, 6] );} )
testSource3.video.addEventListener('seeking', function() { midi1.send([ 0x90, 2, 6] );} )
testSource4.video.addEventListener('seeking', function() { midi1.send([ 0x90, 3, 6] );} )

testSource1.video.addEventListener('seeked', function() { midi1.send([ 0x90, 0, 5] );} )
testSource2.video.addEventListener('seeked', function() { midi1.send([ 0x90, 1, 5] );} )
testSource3.video.addEventListener('seeked', function() { midi1.send([ 0x90, 2, 5] );} )
testSource4.video.addEventListener('seeked', function() { midi1.send([ 0x90, 3, 5] );} )

testSource1.video.addEventListener('stalled', function() { midi1.send([ 0x90, 0, 4] );} )
testSource2.video.addEventListener('stalled', function() { midi1.send([ 0x90, 1, 4] );} )
testSource3.video.addEventListener('stalled', function() { midi1.send([ 0x90, 2, 4] );} )
testSource4.video.addEventListener('stalled', function() { midi1.send([ 0x90, 3, 4] );} )

testSource1.video.addEventListener('playing', function() { midi1.send([ 0x90, 0, 1] );} )
testSource2.video.addEventListener('playing', function() { midi1.send([ 0x90, 1, 1] );} )
testSource3.video.addEventListener('playing', function() { midi1.send([ 0x90, 2, 1] );} )
testSource4.video.addEventListener('playing', function() { midi1.send([ 0x90, 3, 1] );} )

// ## DELAYED START ############################################################

// -----------------------------------------------------------------------------
// AFTER LOAD Settings
setTimeout( function() {
  filemanager1.change()
  filemanager2.change()
  filemanager3.change()
  filemanager4.change()
  //console.log("GO GO GO")
  //switcher1.doSwitch(0)
  //mixer3.pod(0)
  //filemanager2.change()
  //filemanager3.change()
  midi1.send([ 0x90, 8, 1, 0x90, 9, 1, 0x90, 10, 1, 0x90, 11, 1, 0x90, 16, 1, 0x90, 17, 1, 0x90, 18, 1, 0x90, 19, 1])
}, 3200)
