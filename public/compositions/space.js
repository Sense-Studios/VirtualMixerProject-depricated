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
var bpm = new BPM( renderer )

// add the bpm to the mixer (-pod)
//bpm.add( mixer4.pod )
//bpm.add( mixer1.pod )

// ## OUTPUT ###################################################################

// set the output node (needs to be last!)
var output = new Output( renderer, mixer4 )
//var output = new Output( renderer, testSource6 )

// ## CONTROLLERS ##############################################################

var midi1 = new MidiController(renderer, {})

midi1.addEventListener( 48, function(e) {
  //console.log("data!", e[1], e[2] )
  //chain1.setChainLink(0, e[2]/127 )
  mixer1.pod( ( e[2]/127 )  )
})

midi1.addEventListener( 49, function(e) {
  //console.log("data!", e[1], e[2] )
  //chain1.setChainLink(1, e[2]/127 )
  mixer2.pod( e[2]/127 )
})

midi1.addEventListener( 50, function(e) {
  //console.log("data!", e[1], e[2] )
  //chain1.setChainLink(2, e[2]/127 )
  mixer3.pod( e[2]/127 )
})

midi1.addEventListener( 51, function(e) {
  //console.log("data!", e[1], e[2] )
  //chain1.setChainLink(3, e[2]/127 )
  mixer4.pod( e[2]/127 )
})


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

function switchBlendmode( _mixer, doubleclick, evt ) {
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
}

function switchMixmode( _mixer, doubleclick, evt ) {
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
}

midi1.addEventListener( 8, function(evt, doubleclick) { switchBlendmode( mixer1, doubleclick, evt ) })
midi1.addEventListener( 9, function(evt, doubleclick) { switchBlendmode( mixer2, doubleclick, evt ) })
midi1.addEventListener( 10, function(evt, doubleclick) { switchBlendmode( mixer3, doubleclick, evt ) })
midi1.addEventListener( 11, function(evt, doubleclick) { switchBlendmode( mixer4, doubleclick, evt ) })

midi1.addEventListener( 16, function(evt, doubleclick) { switchMixmode( mixer1, doubleclick, evt ) })
midi1.addEventListener( 17, function(evt, doubleclick) { switchMixmode( mixer2, doubleclick, evt ) })
midi1.addEventListener( 18, function(evt, doubleclick) { switchMixmode( mixer3, doubleclick, evt ) })
midi1.addEventListener( 19, function(evt, doubleclick) { switchMixmode( mixer4, doubleclick, evt ) })

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
}, 3200)