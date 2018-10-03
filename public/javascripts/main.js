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
var mixer5 = new Mixer( renderer, { source1: mixer4, source2: testSource3 } );
var switcher1 = new Switcher( renderer, { source1: mixer3, source2: mixer4 } );

// create the filemanager addon to manage the sources
var giphymanager1 = new GiphyManager( testSource1 )
var filemanager1 = new FileManager( testSource1 )
filemanager1.load('/sets/occupy_chaos.json')

var filemanager2 = new FileManager( testSource2 )
filemanager2.load('/sets/notv.json')

var filemanager3 = new FileManager( testSource3 )
filemanager3.load('/sets/occupy_chaos.json')

var filemanager4 = new FileManager( testSource4 )
filemanager4.load('/sets/occupy_chaos.json')


// -----------------------------------------------------------------------------
// create a bpm addon
var bpm = new BPM( renderer )

// add the bpm to some of the mixer(-pod)
bpm.add( mixer4.pod )
bpm.add( mixer5.pod )




// -----------------------------------------------------------------------------
// set the output node (needs to be last!)
//var output = new Output( renderer, switcher1 )
var output = new Output( renderer, mixer5 )


var socket = io();
socket.on('beats', function(msg){
  console.log(msg)
  //$('#messages').append($('<li>').text(msg));
});


var _beats = 0
// move this to the bpm
var checkBeats = function() {
  _beats += 1
  socket.emit('command', {"command":"beats", "payload":_beats});
  setTimeout( function() { checkBeats() }, 6000/(bpm.bpm/8) )
};

checkBeats()


// -----------------------------------------------------------------------------
// add a controller to mixer and bpm
// var numpad1 = new NumpadBpmMixerControl( renderer, mixer1, bpm )
// numpad1.addBpm(bpm)
// numpad1.addMixer( mixer1 )
// numpad1.addMixer( mixer2 )
// numpad1.addMixer( mixer3 )
// numpad1.addMixer( mixer4 )
// nupad1.addFileManager

//var keyboard1 = new KeyboardMixerControl( renderer, mixer1, bpm )

// var gamepad = new GamePad( renderer, mixer1, mixer2, mixer3 )
// var gamepad1 = new GamePadDiagonalControl( renderer, mixer1, mixer2, mixer3 )
// var gamepad2 = new GamePadVerticalControl( renderer, mixer1, mixer2, mixer3, mixer4, mixer5, mixer6, mixer7 )
// var firebase1 = new FireBaseControl( renderer, mixer1, mixer2, mixer3 )
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

mixer4.pod(0.5)
filemanager1.change()
filemanager2.change()
bpm.mod = 0.5

// -----------------------------------------------------------------------------
// Testscripts ("Behaviours?")
var myBehaviour = new Behaviour( renderer )

var behaviour  = {
  "title": "My First Behaviour",
  "author": "",

  changez_mod: "r8000ms",
  jump_mod: "r7200ms",
  scratch_mod: "r12000ms",

  // action: { "method": "changez", "arg":{}, "on": { filemanager1, filemanager2, filemanager3, filemanager4 } },     on.method( arg )
  // action: { "method": "pod", "witdh": { mixer1, mixer2, filemanager3, filemanager4 } },                            method(  width )
  // changez
  // jump  "on"
  //

  sheets: [
    [
      [  3,  5,  0,  0, 10, 13, 15  ],
      [  1,  0,  0,  0,  9,  0,  0  ],
      [  3,  0,  0,  0,  0,  0,  0  ],
      [  1,  6,  0,  0,  0,  0,  0  ],   // 4
      [  3,  0,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  0,  9,  0, 16  ],
      [  3,  5,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  7, 10, 14,  0  ],   // 8
      [  0,  0,  0,  0,  0 , 0,  0  ],
      [  0,  6,  0,  0,  0,  0, 17  ],
      [  0,  0,  0,  0,  0,  0,  0  ],
      [  0,  5,  0,  0,  0,  0, 15  ],   // 12
      [  3,  6,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  8,  0,  0,  0  ],
      [  1,  6,  0,  9, 10, 13,  0  ],   //// 16
      [  3,  5,  0,  0,  0,  0,  0  ],
      [  3,  5,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  0,  0,  0,  0  ],
      [  1,  6,  0,  0,  0 , 0,  0  ],   // 20
      [  3,  0,  0,  0,  0 , 0,  0  ],
      [  3,  0,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  0,  0,  0,  0  ],
      [  3,  5,  0,  0,  0,  0,  0  ],   // 24
      [  1,  0,  0,  0,  0,  0,  0  ],   //
      [  3,  0,  0,  0, 10, 14, 16  ],
      [  1,  6,  0,  0,  0,  0,  0  ],
      [  3,  5,  0,  0,  0,  0,  0  ],  //  28
      [  1,  6,  0,  0,  9,  0,  0  ],  //
      [  3,  5,  0,  0, 10,  0,  0  ],
      [  1,  6,  0,  0,  9,  0,  0  ],
      [  3,  5,  0,  0,  0,  0,  0  ],  // 32
      [  1,  6,  0,  0,  0,  0,  0  ],   //

      [  3,  5,  0,  0, 10,  0,  0  ],
      [  1,  0,  0,  0,  9,  0,  0  ],
      [  3,  0,  0,  0,  0,  0,  0  ],
      [  1,  6,  0,  0,  0,  0, 17  ],   // 36
      [  3,  0,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  0,  9,  0,  0  ],
      [  3,  5,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  7, 10,  0, 15  ],   // 40
      [  0,  0,  0,  0,  0 , 0,  0  ],
      [  0,  6,  0,  0,  0,  0,  0  ],
      [  0,  0,  0,  0,  0,  0,  0  ],
      [  0,  5,  0,  0,  0,  0,  0  ],   // 44
      [  3,  6,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  8,  0,  0,  0  ],
      [  3,  5,  0,  0,  0,  0,  0  ],
      [  1,  6,  0,  9, 10,  0,  0  ],   //// 52
      [  3,  5,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  0,  0,  0,  0  ],
      [  3,  0,  0,  0,  0 , 0,  0  ],
      [  1,  6,  0,  0,  0 , 0,  0  ],   // 56
      [  3,  0,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  0,  0,  0,  0  ],
      [  3,  5,  0,  0,  0,  0,  0  ],
      [  1,  0,  0,  0,  0,  0,  0  ],   // 60
      [  1,  0,  0,  0,  0,  0,  0  ],   //
      [  1,  0,  0,  0,  0,  0,  0  ],   //
      [  1,  0,  0,  0,  0,  0,  0  ],   //
      [  1,  0,  0,  0,  0,  0,  0  ],   // 64
      [  1,  0,  0,  0,  0,  0,  0  ],   //
      [  1,  0,  0,  0,  0,  0,  0  ],   //
      [  3,  0,  0,  0, 10,  0, 16  ],
      [  1,  0,  0,  0,  0,  0,  0  ],   // 68
      [  1,  6,  0,  0,  0,  0,  0  ],
      [  3,  5,  0,  0,  0,  0,  0  ],
      [  1,  6,  0,  0,  9,  0,  0  ],  //
      [  3,  5,  0,  0, 10,  0, 15  ],  //  72
      [  1,  6,  0,  0,  9,  0,  0  ],
      [  3,  5,  0,  0,  0,  0,  0  ],
      [  1,  6,  0,  0,  4,  0,  0  ]   //
    ]
  ],

  // mixer4.pod(0)
  // testsource1.scratch
  triggers: [

    //{
    //  action: { "method": "pod", "on": [ mixer4 ], "args": 0.3 },
    //  mod: { code: "4b", value: 1, type: 'beats', repeat: false, after: 1 }
    //},
    //{
    //  action: { "method": "pod", "on": [ mixer4 ], "args": 0.7 },
    //  mod: { code: "4b", value: 1, type: 'beats', repeat: false, after: 0 }
    //},
    {
      action: { "method": "blendMode", "on": [ mixer4 ], "args": 7 },              // 0 (NOT USED)
      mod: { code: "4b", value: 500, type: 'beats', repeat: false, after: 1 }
    },




    {
      action: { "method": "blendMode", "on": [ mixer4 ], "args": 7 },              // 1
      mod: { code: "4b", value: 5, type: 'beats', repeat: false, after: 1 }
    },
    {
      action: { "method": "blendMode", "on": [ mixer4 ], "args": 17 },             // 2
      mod: { code: "4b", value: 7, type: 'beats', repeat: false, after: 2 }
    },
    {
      action: { "method": "blendMode", "on": [ mixer4 ], "args": 8 },              // 3
      mod: { code: "4b", value: 9, type: 'beats', repeat: false, after: 0 }
    },

    {
      action: { "method": "changez", "on": [ filemanager1, filemanager2 ] },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }
    },

    {
      action: { "method": "pod", "on": [ mixer4 ], "args": 0 },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }    // 5
    },
    {
      action: { "method": "pod", "on": [ mixer4 ], "args": 1 },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }    // 6
    },


    {
      action: { "internal": "jump", "on": [ testSource1 ] },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }    // 7
    },

    {
      action: { "internal": "jump", "on": [ testSource2 ] },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }    // 8
    },
    //{
    //  action: { "method": "mixMode", "with": [ mixer4 ], "args": 3 },
    //  mod: { code: "4b", value: 2, type: 'beats', repeat: false, after: 2 }
    //},
    //{
    //  action: { "method": "pod", "on": [ mixer4 ], "args": 1 },
    //  mod: { code: "4b", value: 4, type: 'beats', repeat: true, after: null }
    //},


    {
      action: { "method": "pod", "on": [ mixer4 ], "args": 0.5 },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }    // 9
    },
    {
      action: { "method": "pod", "on": [ mixer4 ], "args": 0.25 },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }    // 10
    },

    {
      action: { "method": "changez", "on": [ filemanager1 ] },                     // 11
      mod: { code: "4b", value: 6, type: 'beats', repeat: true, after: null }
    },
    {
      action: { "method": "changez", "on": [ filemanager2 ] },                     // 12
      mod: { code: "4b", value: 9, type: 'beats', repeat: true, after: null }
    },

    {
      action: { "set": "useAutoBpm", "on": [ bpm ], "args":true },              // 13
      mod: { code: "4b", value: 9, type: 'beats', repeat: true, after: null }
    },
    {
      action: { "set": "useAutoBpm", "on": [ bpm ], "args":false },               // 14
      mod: { code: "4b", value: 9, type: 'beats', repeat: true, after: null }
    },

    {
      action: { "method": "pod", "on": [ mixer5 ], "args": 0 },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }    // 15
    },
    {
      action: { "method": "pod", "on": [ mixer5 ], "args": 1 },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }    // 16
    },
    {
      action: { "method": "getSrcByTags", "on": [ filemanager3], "args": ["runner"] },                     // 17
      mod: { code: "4b", value: 9, type: 'beats', repeat: true, after: null }
    }

    //{
    //  action: { "set": "mixMode", "on": [ mixer4 ], "args": mixer4.blendmodes[  Math.floor( Math.random() * mixer4.blendmodes.length ) ] },
    //  mod: { code: "4b", value: 2, type: 'beats', repeat: true, after: null }
    //},


    /*
    ,{
      action: { "method": "changez", "on": [ filemanager1, filemanager2, filemanager3, filemanager4 ] },
      mod: {  code: "8000rs", value: 8000, type: 'random-seconds', repeat: false, after: '' }
    },{
      action: { "method": "changez", "on": [ filemanager1, filemanager2, filemanager3, filemanager4 ] },
      mod: {  code: "8rb", value: 8, type: 'random-beats', repeat: false, after: '' }
    },{
      action: { "method": "jump", "with": [ testSource1, testSource2, testSource3, testSource4 ] },
      mod: {  code: "8000s", value: 8000, type: 'seconds', repeat: false, after: '' }
    }
    */
  ]
}


myBehaviour.load(behaviour)




































/// scroll
