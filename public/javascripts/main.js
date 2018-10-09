var renderer = new GlRenderer();

// create sources
var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource3 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource4 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );

// var testSource1 = new SolidSource( renderer, { color: { r: 1.0, g: 0.0, b: 0.0 } } );
// var testSource2 = new SolidSource( renderer, { color: { r: 0.1, g: 1.0, b: 0.0 } } );
// var testSource3 = new SolidSource( renderer, { color: { r: 0.1, g: 0.0, b: 1.0 } } );
// var testSource4 = new SolidSource( renderer, { color: { r: 1.1, g: 1.0, b: 0.5 } } );


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
filemanager1.load('/sets/example.json')

var filemanager2 = new FileManager( testSource2 )
filemanager2.load('/sets/occupy_chaos.json')

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

mixer5.pod(0)
mixer5.pod(0.5)
setTimeout( function() {
  filemanager1.change()
  filemanager2.change()
  filemanager3.change()
}, 500 )

bpm.mod = 0.125
bpm.useAutoBpm = false

// -----------------------------------------------------------------------------
// Testscripts ("Behaviours?")
var myBehaviour = new Behaviour( renderer )

var socket = io();
socket.on('beats', function(msg){
  // console.log(msg)
  // $('#messages').append($('<li>').text(msg));
});

socket.on('dips', function(msg){
  console.log(msg)
  //$('#messages').append($('<li>').text(msg));
  // if msg == yes setdips
});

socket.emit('dibs')

dips = false

socket.on('command', function(msg) {
  // console.log("command!", msg, msg.command == "updatesheets" )
  if ( msg.command == "updatesheets" ) {
    console.log(msg.payload.sheets)
    sheets = JSON.parse(msg.payload.sheets)
    myBehaviour.sheets = JSON.parse(msg.payload.sheets)
    // myBehaviour.load(behaviour)
  }
})

var _beats = 0
// move this to the bpm
var checkBeats = function(_num) {
  _beats += 1
  //console.log(_beats)
  socket.emit('command', {"command":"beats", "payload": _num});
  //setTimeout( checkBeats, ((60/window.bpm_test)*1000) )
};

//checkBeats()

// SHOULD BE HANDLED THROUGH THE INTERFACE
var blank_functions = [[".....", "",""]]
var mixer_functions = [["BLEND", "method","blendMode"], ["MIX", "method","mixMode"], ["POD", "set", "pod"] ]
var filemanager_functions = [["CHANGE", "method", "changez"], ["POD", "set","pod"] ]
var source_functions = [["JUMP","internal","jump"]]
var bpm_functions = [ ["SET", "set", "useAutoBpm"] ]

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

  composition: {
      "VID01": { target: testSource1, functions: source_functions },
      "VID02": { target: testSource2, functions: source_functions },
      "VID03": { target: testSource3, functions: source_functions },
      "VID04": { target: testSource4, functions: source_functions },
      "MIX01": { target: mixer1, functions: mixer_functions },
      "MIX02": { target: mixer2, functions: mixer_functions },
      "MIX03": { target:  mixer3, functions: mixer_functions },
      "MIX04": { target:  mixer4, functions: mixer_functions },    // VID01 in, VID03 out
      "MIX05": { target:  mixer5, functions: mixer_functions },   // mixer4 in, VID03 in, --> out
      "SWC01": { target:  switcher1 , functions: mixer_functions },
      "FIL01": { target:  filemanager1, functions: filemanager_functions },
      "FIL02": { target:  filemanager2, functions: filemanager_functions },
      "FIL03": { target:  filemanager3, functions: filemanager_functions },
      "FIL04": { target:  filemanager4, functions: filemanager_functions },
      "BPM":  { target: bpm, functions: bpm_functions }
  },


  sheets: [],

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
      action: { "method": "blendMode", "on": [ mixer5 ], "args": 7 },              // 0 (NOT USED)
      mod: { code: "4b", value: 5, type: 'beats', repeat: false, after: 1 }


    },

    {
      action: { "method": "blendMode", "on": [ mixer5 ], "args": 7 },              // 1
      mod: { code: "4b", value: 5, type: 'beats', repeat: false, after: 1 }
    },
    {
      action: { "method": "blendMode", "on": [ mixer5 ], "args": 17 },             // 2
      mod: { code: "4b", value: 7, type: 'beats', repeat: false, after: 2 }
    },
    {
      action: { "method": "blendMode", "on": [ mixer5 ], "args": 8 },              // 3
      mod: { code: "4b", value: 9, type: 'beats', repeat: false, after: 0 }
    },

    {
      action: { "method": "changez", "on": [ filemanager1, filemanager2 ] },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }
    },

    {
      action: { "method": "pod", "on": [ mixer5 ], "args": 0 },       // 4
      mod: { code: "4b", value: 11, type: 'beats', repeat: false, after: null }    // 5
    },
    {
      action: { "method": "pod", "on": [ mixer5 ], "args": 1 },       // 4
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
    },
    {
      action: { "method": "changez", "on": [ filemanager3 ] },                     // 18
      mod: { code: "4b", value: 9, type: 'beats', repeat: true, after: null }
    },


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
var u = new Utils()
u.get('/io', function(d) {
  console.log(d)
  behaviour.sheets = JSON.parse(d)
  myBehaviour.load(behaviour)
  myBehaviour.checkSheets()
})





































/// scroll
