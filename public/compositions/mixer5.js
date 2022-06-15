// -----------------------------------------------------------------------------


// Proposed configuration 1 (not working yet)

/*
var RenderTree = {
  type: Mixer,
  src1: {
    type: Mixer,
    pod: 0,
    blendmode: 1,
    mix: 4,
    src1: {
      type: VideoSource,
      src: ""
    },
    src2: {
      type: VideoSource,
      src: ""
    }
  },
  src2: "",
  pod: {
    type: BPM,
    name: "BPM"
  }
}
*/


var renderer = new GlRenderer();

// ## SOURCES ##################################################################

// create sources
var testSource1 = new GifSource(   renderer, { src: '//nabu.sense-studios.com/assets/nabu_themes/sense/slowclap.gif' } );
var testSource2 = new VideoSource( renderer, { src: '/video/ignore/1UP_Graffiti_olympic.mp4' } );
var testSource3 = new VideoSource( renderer, { src: '/video/ignore/alaro_carnage_the_underground_gif_remix.mp4' } );
var testSource4 = new VideoSource( renderer, { src: '/video/ignore/1UP_Graffiti_olympic.mp4' } );

var clutter = new VideoSource( renderer, { src: '/video/16MMDUSTproc.mp4' } );


// solid
var testSource5 = new SolidSource( renderer, { color: { r: 0.1, g: 1.0, b: 0.5 } } );

// text
var testSource6 = new TextSource( renderer, {} );
var testSource6 = new GifSource(   renderer, { src:'/gif/gifshow/5b4cccdec8c97546ca88f2efc589ba58.gif' } );

// ## MODULES ##################################################################

// create 2 mixers, A/B and mixer/B
var mixer1 = new Mixer( renderer, { source1: testSource6, source2: testSource3 } );
var mixer3 = new Mixer( renderer, { source1: testSource1, source2: mixer1 } );
mixer3.mixMode(3) // NAM

// create a mixer, simple a/b
var mixer4 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
var mixer5 = new Mixer( renderer, { source1: mixer1, source2: clutter } );
mixer5.mixMode(9)

var switcher1 = new Switcher( renderer, { source1: mixer5, source2: mixer3 } );

// ## ADDONS ##################################################################

// create the filemanager addon for the sources
// var giphymanager1 = new GiphyManager( testSource1 )
var filemanager2 = new FileManager( testSource2 )
var filemanager3 = new FileManager( testSource3 )
var filemanager4 = new FileManager( testSource4 )

// ## OUTPUT ###################################################################

// set the output node (needs to be last!)
var output = new Output( renderer, switcher1 )
//var output = new Output( renderer, testSource6 )

// create a bpm addon
var bpm = new BPM( renderer )
//var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/nsb' } )
var analysis1 = new AudioAnalysis( renderer, { microphone: true })
var analysis1 = new AudioAnalysis( renderer, {})

// ## CONTROLLERS ##############################################################

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

// add the bpm to the mixer (-pod)
analysis1.add( mixer4.pod )
analysis1.add( mixer1.pod )

// ## DELAYED START ############################################################

// -----------------------------------------------------------------------------
// AFTER LOAD Settings
setTimeout( function() {
  //filemanager1.change()
  //filemanager2.change()
  //filemanager3.change()
  //filemanager4.change()
  console.log("GO GO GO")
  switcher1.doSwitch(0)
  mixer3.pod(0)
  //filemanager2.change()
  //filemanager3.change()
}, 3200)


// ---------------------------------------------------------------------------
// Below are a series of scripts that I'd like to call "behaviours"
// they will be moved from the main funcite into an Addon, but I'm not entirely
// ready for that yet.
// ---------------------------------------------------------------------------

// Testscripts

var changez_mod = 32000
var jump_mod = 12000
var scratch_mod = 64000
var blend_mod = 16000

// this is a hokey pokey controller
// call this a behaviour?

/*
function changez() {
  if (Math.random() > 0.5 ) {
    filemanager2.change("awesome")
    console.log("CAHNGEZ 2")
  }else{
    filemanager3.change("runner")
    console.log("CAHNGEZ 3")
  }
  var r = changez_mod / bpm.bps
  setTimeout( function() {
    changez()
  }, r )
};
changez()

*/

function change_blendmode() {
  //var r = Math.floor( Math.random() * blend_mod )
  var r = blend_mod / bpm.bps
  setTimeout( function() {
    change_blendmode()
  }, r )

  // only use a subset of the mixmodes
  var use = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
  var br = use[Math.floor( Math.random() * use.length )]
  mixer1.blendMode( br );
  console.log("BLENDMODE", br)
    // of 18: 1 ADD (default), 2 SUBSTRACT, 3 MULTIPLY, 4 DARKEN, 5 COLOUR BURN,
    // 6 LINEAR_BURN, 7 LIGHTEN,  8 SCREEN, 9 COLOUR_DODGE, 10 LINEAR_DODGE,
    // 11 OVERLAY, 12 SOFT_LIGHT, 13 HARD_LIGHT, 14 VIVID_LIGHT, 15 LINEAR_LIGHT,
    // 16 PIN_LIGHT, 17 DIFFERENCE, 18 EXCLUSION
}
change_blendmode()

function change_mixmode() {
  var r =  ( Math.random() * blend_mod ) / bpm.bps
  setTimeout( function() {
    var use = [ 0, 1, 2, 3, 6, 7]
    change_mixmode( use[ Math.floor(Math.random()*use.length)] );
  }, r )

  var mr = Math.ceil( Math.random() * 9 )
  mixer1.mixMode( mr );
  console.log("MIXMODE", mr)
}
change_mixmode()

function jumps() {
  var r =  ( Math.random() * jump_mod ) / bpm.bps
  setTimeout( function() {
    jumps()
  }, r )

  try {
    if (Math.random() > 0.5 ) {
      testSource2.video.currentTime = Math.random() * testSource2.video.duration
      console.log("src 2 jumps")
    }else{
      testSource3.video.currentTime = Math.random() * testSource3.video.duration
      console.log("src 3 jumps")
    }
  }catch(err) {}
};
jumps()

// be careful with scratch, especially running online it runs with bad performance
function scratch() {
  var r =  ( Math.random() * scratch_mod ) * bpm.bps
  setTimeout( function() {
    scratch()
  }, r )

  try {
    var rq = ( Math.random() * 0.6 ) + 0.7
    //var rq = Math.pow( (Math.random() * 0.5), 0.3 )
    if ( Math.random() > 0.5 ) {
      testSource2.video.playbackRate = rq //+ 0.7
      console.log("src 1 scxratches", rq)
    }else{
      testSource3.video.playbackRate = rq //+ 0.7
      console.log("src 1 scxratches", rq)
    }
  }catch(err) { console.log("err:", err)}
};
scratch()

// https://stackoverflow.com/questions/43710173/upload-and-play-audio-file-j

function handleFiles(event) {
    var files = event.target.files;
    console.log("oid", files, audio.src)
    analysis1.audio.src = URL.createObjectURL(files[0])
    analysis1.audio.play()
    //audio.src = URL.createObjectURL(files[0])
    //audio.play()
    // $("#src").attr("src", URL.createObjectURL(files[0]));
    //document.getElementById("audio").load();
}

var wasSet = false
var beats = 0
var dica = 0

setInterval(function() {
  if ( analysis1.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    dice = Math.random()
    console.log("beat!", beats, dice, analysis1.bpm, analysis1.bpm_float)
  }

  if ( analysis1.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )

document.getElementById("upload").addEventListener("change", handleFiles, false);
