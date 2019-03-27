
//var testSource1 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );
//var testSource2 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );
//var testSource3 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );
//var testSource4 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );

//var testSource1 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );
//var testSource2 = new VideoSource( renderer, { src: '/video/ignore/notv/VTS_01_0.mp4' } );
var testSource3 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );
//var testSource4 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );

// var testSource1 = new SolidSource( renderer, { color: { r: 1.0, g: 0.0, b: 0.0 } } );
// var testSource2 = new SolidSource( renderer, { color: { r: 0.1, g: 1.0, b: 0.0 } } );
// var testSource3 = new SolidSource( renderer, { color: { r: 0.1, g: 0.0, b: 1.0 } } );
var testSource4 = new SolidSource( renderer, { color: { r: 1.1, g: 1.0, b: 0.5 } } );


// solid
var testSource5 = new SolidSource( renderer, { color: { r: 0.1, g: 1.0, b: 0.5 } } );

var effect1 = new ColorEffect( renderer, { source: testSource1 } )

// create some modules
var mixer1 = new Mixer( renderer, { source1: effect1, source2: testSource2 } );
var mixer2 = new Mixer( renderer, { source1: testSource3, source2: testSource4 } );
var mixer3 = new Mixer( renderer, { source1: mixer1, source2: mixer2 } );

var mixer4 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
var mixer5 = new Mixer( renderer, { source1: mixer4, source2: testSource3 } );

var switcher1 = new Switcher( renderer, { source1: mixer3, source2: mixer4 } );

// mixer5
// var effect2 = new FeedbackEffect( renderer, { source: effect1 } )

// create the filemanager addon to manage the sources
// var giphymanager1 = new GiphyManager( testSource1 )
var filemanager1 = new FileManager( testSource1 )
filemanager1.load('/sets/notv_local.json')

var filemanager2 = new FileManager( testSource2 )
filemanager2.load('/sets/notv_local.json')

var filemanager3 = new FileManager( testSource3 )
filemanager3.load('/sets/notv_local.json')

var filemanager4 = new FileManager( testSource4 )
filemanager4.load('/sets/notv_local.json')


// -----------------------------------------------------------------------------
// create a bpm addon
var bpm = new BPM( renderer )
// var audioanalysis1 = new AudioAnalysis(renderer)
//var audioanalysis1 = new AudioAnalysis(renderer)
//audioanalysis2.mod = 0.6
//audioanalysis2.disconnectOutput()

var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/audio/fear_is_the_mind_killer_audio.mp3' } )
// var audioanalysis1 = new AudioAnalysis( renderer, { microphone: true } )

// add the bpm to some of the mixer(-pod)
bpm.add( mixer4.pod )
audioanalysis1.add( mixer1.pod )

// Or add the bpm, audioAnalysier to the mixer, with a mod
// mixer4.autoFade( bpm )
// mixer4.autoFade( audioanalysis1 )

// audioanalysis1.audio.muted = true

// -----------------------------------------------------------------------------
// set the output node (needs to be last!)
//var output = new Output( renderer, switcher1 )
// var output = new Output( renderer, mixer1 )
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

//alert("oi oi oi ")
//mixer1.pod(bpm)
//bpm.add( mixer1.pod )
//audioanalysis1.add( mixer1.pod )
//audioanalysis1.add( mixer1.pod )
//audioanalysis2.add( mixer2.pod )
audioanalysis1.add(mixer1.pod)
//bpm.add(mixer2.pod)

// new bindings syntax
// mixer1.bindBpm( audioanalysis1["getBpm"] );
// mixer1.bpmMod(0.25)


// -----------------------------------------------------------------------------
// Set up Controllers
var midicontroller = new MidiController()
//midicontroller.verbose = true

// [ state, key, velocity ]
// states:
// 144 = down
// 112 = up
// 176 = sliding ( fader )
// button
midicontroller.bind( 1, function(e) {
  // key 1, e[0] = state, e[1] = key, e[2] = velocity
})

midicontroller.bind( 1, function(e) { if (e[0]==144) mixer1.autoFade = !mixer1.autoFade; mixer1.autoFade? midicontroller.send([0x90, 1, 4]) : midicontroller.send([0x90, 1, 3]); })

// fader
midicontroller.bind( 48, function(e) { testSource5.color({r: e[2]/128,              g: testSource5.color().g, b: testSource5.color().b }) })
midicontroller.bind( 49, function(e) { testSource5.color({r: testSource5.color().r, g: e[2]/128,              b: testSource5.color().b }) })
midicontroller.bind( 50, function(e) { testSource5.color({r: testSource5.color().r, g: testSource5.color().g, b: e[2]/128              }) })

midicontroller.bind( 49, function(e) { mixer1.bpmMod(e[2]/32) } )

// this is the main keypad
var midimap = [
  [ 56, 57, 58, 59, 60, 61, 62, 63 ],
  [ 48, 49, 50, 51, 52, 53, 54, 55 ],
  [ 40, 41, 42, 43, 44, 45, 46, 47 ],
  [ 32, 33, 34, 35, 36, 37, 38, 39 ],
  [ 24, 25, 26, 27, 28, 29, 30, 31 ],
  [ 16, 17, 18, 19, 20, 21, 22, 23 ],
  [  8,  9, 10, 11, 12, 13, 14, 15 ],
  [  0,  1,  2,  3,  4,  5,  6,  7 ]
]

var commands = []
midimap.forEach( function( row, i ) {
  row.forEach( function( value, j ) {
    commands.push( 0x90, value, 0 )
  });
});

setTimeout( function() {
  console.log("MIDI SEND COMMANDS");
  midicontroller.send( commands )
  commands = []
  commands.push( 0x90, 0, 3 )
  commands.push( 0x90, 1, 3 )
  commands.push( 0x90, 2, 3 )
  midicontroller.send( commands )
}, 1000 )



  //var r = ( audioanalysis1.bpm^2 ) + initial;
//  var r = ( 128^2 ) + initial;
//  r = Math.floor(Math.random() * ( 128 * 50 ) ) + 6000 + initial;
//  if ( isNaN(r) || r < 10000) r = 10000 + initial;
//  console.log("update src", r, _source.currentSrc)
//  setTimeout( updateSource, r, _source  )
//}

//gifSource1.src( '/gif/gifshow/' + gifs[ Math.floor( Math.random() * gifs.length ) ] )
//gifSource2.src( '/gif/gifshow/' + gifs[ Math.floor( Math.random() * gifs.length ) ] )

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

//mixer5.pod(0)
//mixer5.pod(0.5)
//setTimeout( function() {
  //updateSource( gifSource1, 9000 )
  //updateSource( gifSource2, 18000 )
// setTimeout( function() {
  //filemanager1.change()
  //filemanager2.change()
  //filemanager3.change()

  //bpm.audio.muted = true
  //bpm.useAutoBpm = false

//}, 500 )

bpm.mod = 0.5
bpm.useAutoBpm = false

// -----------------------------------------------------------------------------
// Testscripts ("Behaviours?")
var myBehaviour = new Behaviour( renderer, {"bpm": bpm} )

//checkBeats()

// SHOULD BE HANDLED THROUGH THE INTERFACE
/*
var blank_functions = [[".....", "",""]]
var mixer_functions = [["BLEND", "method","blendMode"], ["MIX", "method","mixMode"], ["POD", "set", "pod"] ]
var filemanager_functions = [["CHANGE", "method", "changez"], ["POD", "set","pod"] ]
var source_functions = [["JUMP","method","jump"]]
var bpm_functions = [ ["AUTO", "method", "toggleAutoBpm"],["MODDOWN", "method", "modDown"],["MODUP", "method", "modUp"],["MOD", "method", "modNum"]]
*/

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
    "VID01": { target: testSource1, functions: testSource1.function_list },
    "VID02": { target: testSource2, functions: testSource2.function_list },
    "VID03": { target: testSource3, functions: testSource3.function_list },
    "VID04": { target: testSource4, functions: testSource4.function_list },
    "MIX01": { target: mixer1, functions: mixer1.function_list },
    "MIX02": { target: mixer2, functions: mixer2.function_list },
    "MIX03": { target:  mixer3, functions: mixer3.function_list },
    "MIX04": { target:  mixer4, functions: mixer4.function_list },    // VID01 in, VID03 out
    "MIX05": { target:  mixer5, functions: mixer5.function_list },   // mixer4 in, VID03 in, --> out
    "SWC01": { target:  switcher1 , functions: switcher1.function_list },
    "FIL01": { target:  filemanager1, functions: filemanager1.function_list },
    "FIL02": { target:  filemanager2, functions: filemanager2.function_list },
    "FIL03": { target:  filemanager3, functions: filemanager3.function_list },
    "FIL04": { target:  filemanager4, functions: filemanager4.function_list },
    "BPM01":  { target: bpm, functions: bpm.function_list }
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

var u = new Utils()
u.get('/io', function(d) {
  console.log(d)
  behaviour.sheets = JSON.parse(d)
  myBehaviour.load(behaviour)
  myBehaviour.checkSheets()
})


// -----------------------------------------------------------------------------
var socket = io();
dips = false

// used in behaviour
var _beats = 0

// move this to the bpm
var checkBeats = function(_num) {
  _beats += 1
  //console.log(_beats)
  socket.emit('command', {"command":"beats", "payload": _num});
  //setTimeout( checkBeats, ((60/window.bpm_test)*1000) )
  //console.log(" IO chackbeats callee", _num, window.bpm_test )
};

//socket.emit('command', { "command":"identify", "payload": "viewer" });

socket.on('ping', function(msg) {
  // send pong, uuid
  socket.emit('pong');
})

socket.on('command', function(msg) {
  if ( msg.command != "beats" ) console.log(" IO command:", msg)

  socket.on('beats', function(msg){
    // if !dibs
    // beats = beats
    // console.log(" IO beats!")
  });

  if ( msg.command == "welcome" ) {
    console.log(" IO you are: ", msg.payload )
    socket.emit('command', {"command":"dibs", "payload": msg.payload } );
  }

  if ( msg.command == "dibs" ) {
    console.log(" IO send command dibs", msg)
    //if (msg.payload == uuid ) {
    //  dibs = true
    //  console.log(" IO Has dibs!")
    //}
  }

  if ( msg.command == "updatesheets" ) {
    console.log(" IO updatesheets", msg)
    console.log(msg.payload.sheets)
    sheets = JSON.parse(msg.payload.sheets)
    myBehaviour.sheets = JSON.parse(msg.payload.sheets)
    myBehaviour.sheet_index = parseInt(JSON.parse(msg.payload.sheetindex))
    // myBehaviour.load(behaviour)
  }
})
