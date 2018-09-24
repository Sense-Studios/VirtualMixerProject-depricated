var renderer = new GlRenderer();

// create sources
var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource3 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource4 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );

// solid
var testSource5 = new SolidSource( renderer, { color: { r: 0.1, g: 1.0, b: 0.5 } } );

// create some modules
var mixer1 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
var mixer2 = new Mixer( renderer, { source1: testSource3, source2: testSource4 } );
var mixer3 = new Mixer( renderer, { source1: mixer1, source2: mixer2 } );
var mixer4 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
var switcher1 = new Switcher( renderer, { source1: mixer3, source2: mixer4 } );

// create the filemanager addon to manage the sources
var giphymanager1 = new GiphyManager( testSource1 )
var filemanager1 = new FileManager( testSource1 )
var filemanager2 = new FileManager( testSource2 )
var filemanager3 = new FileManager( testSource3 )
var filemanager4 = new FileManager( testSource4 )


// -----------------------------------------------------------------------------
// create a bpm addon
var bpm = new BPM( renderer )

// add the bpm to some of the mixer(-pod)
bpm.add( mixer4.pod )

// -----------------------------------------------------------------------------
// set the output node (needs to be last!)
var output = new Output( renderer, switcher1 )

// -----------------------------------------------------------------------------
// add a controller to mixer and bpm
var numpad1 = new NumpadBpmMixerControl( renderer, mixer1, bpm )
numpad1.addBpm(bpm)
numpad1.addMixer( mixer1 )
numpad1.addMixer( mixer2 )
numpad1.addMixer( mixer3 )
numpad1.addMixer( mixer4 )
// nupad1.addFileManager

//var keyboard1 = new KeyboardMixerControl( renderer, mixer1, bpm )

// var gamepad = new GamePad( renderer, mixer1, mixer2, mixer3 )
// var gamepad1 = new GamePadDiagonalControl( renderer, mixer1, mixer2, mixer3 )
// var gamepad2 = new GamePadVerticalControl( renderer, mixer1, mixer2, mixer3, mixer4, mixer5, mixer6, mixer7 )
var firebase1 = new FireBaseControl( renderer, mixer1, mixer2, mixer3 )
// firebase1.addMixer( mixer1 ) ?
// firebase1.addMixer( mixer2 ) ?
// firebase1.addMixer( mixer3 ) ?
// firebase1.addFileManager( filemanager1) ?

// -----------------------------------------------------------------------------
renderer.init();         // init
renderer.render();       // start update & animation


// -----------------------------------------------------------------------------

/* EXAMPLES */
/*
// here is what a reset looks like:
renderer.dispose()
var testSource5 = new SolidSource( renderer, { color: { r: 0.1, g: 1.0, b: 0.5 } } );
var output = new Output( renderer, testSource5 )
renderer.init();         // init
renderer.render();       // start update & animation
*/

/*
// here is what a bpm composition looks like
renderer.dispose()
var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var mixer1 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
var bpm = new BPM( renderer )
bpm.add( mixer1.pod )
var output = new Output( renderer, testSource5 )
renderer.init();         // init
renderer.render();       // start update & animation
*/



// -----------------------------------------------------------------------------
// Testscripts ("Behaviours?")
var myBehaviour = new Behaviour()

var behaviour  = {
  "title": "",
  "author": "",

  changez_mod: "r8000ms",
  jump_mod: "r7200ms",
  scratch_mod: "r12000ms",

  // action: { "method": "changez", "arg":{}, "on": { filemanager1, filemanager2, filemanager3, filemanager4 } },     on.method( arg )
  // action: { "method": "pod", "witdh": { mixer1, mixer2, filemanager3, filemanager4 } },                  with.method = arg
  // changez
  // jump  "on"
  //

  triggers: [
    {
      action: { "method": "changez", "on": [ filemanager1, filemanager2, filemanager3, filemanager4 ] },
      mod: { value: 64, type: 'beats', repeat: false, after: 'trigger' }
    },{
      action: { "method": "changez", "on": [ filemanager1, filemanager2, filemanager3, filemanager4 ] },
      mod: { value: 8000, type: 'random', repeat: false, after: 'trigger' }
    },{
      action: { "method": "jump", "on": [ testSource1, testSource2, testSource3, testSource4 ] },
      mod: { value: 8000, type: 'random', repeat: false, after: 'trigger' }
    }
  ]
}

myBehaviour.load(behaviour)
