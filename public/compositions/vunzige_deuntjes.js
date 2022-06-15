// helpers
var showMenu = function() {
  document.getElementById("menu").classList.remove('hidden')
}

document.getElementById('gotime').onmouseup = function() {
  console.log("go time!")
  var selected = null
  document.querySelectorAll('input[type=radio]').forEach( function(item, i ) {
    if (item.checked ) selected = item.value
  })

  // gather data
  var urlvars = ""
  //urlvars += document.getElementById('mod_val').value
  //urlvars += "&shift="
  //urlvars += document.getElementById('shift_val').value

  //if (selected == "justbpm") {
  //  urlvars += "&bpm="
  //  urlvars += document.getElementById('bpm_val').value
  //}

  if (selected == "radio") {
    urlvars += "?morer=2333233"
  }

  if (selected == "mic") {
    urlvars += "?mic=true"
  }

  if (selected == "go") {
    urlvars += "?morer=2333233"
  }

  console.log("https://virtualmixproject.com/mixer/vunzige_deuntjes" + urlvars + "&r=" + Math.random()*1000000)
  window.location.href = "https://virtualmixproject.com/mixer/vunzige_deuntjes" + urlvars + "&r=" + Math.random()*1000000
}

document.getElementById('play_button').onclick = function() {
  document.getElementById('glcanvas').requestFullscreen()
  document.getElementById('play_button').style.display = "none"
}



// document.getElementById('shift_val')

// create a renderer
var renderer = new GlRenderer();

// create some solids
var source1 = new VideoSource(renderer, { src: "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 10.mp4"} )
var source2 = new VideoSource(renderer, { src: "https://nabu.s3.eu-west-1.amazonaws.com/veejay/vunzige_deuntjes/branded/brand_logo_anim_spinning_pins_weirder_alpha.mp4"} )
var source3 = new VideoSource(renderer, { src: "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/sense/jukebox.mp4"} )
//var source3 = new VideoSource(renderer, { src: "http://nabu-dev.s3.amazonaws.com/uploads/video/53e2a3ad6465761455190000/720p_5000kbps_h264.mp4?r=737324588185" } );

// get url vars
var srch = window.location.search
var urlParams = new URLSearchParams(srch);

if (srch == '') {
  console.warn("ownies, no vars, show menu")
  showMenu()
}

var program = 1
window.document.onkeydown  = function(e) {
  if ( e.which == "192" || e.which == "80" ) {
    document.getElementById('play_button').style.display = "block"
    showMenu()
    document.exitFullscreen()
  }

  // 1- 9
  console.log("switch!")
  switch (e.which) {
    case 48: // 0
      program  = 0
      break;

    case 49: // 1
      program  = 1
      break;

    case 50: // 2
      program  = 2
      break;

    case 51: // 3
      program  = 3
      break;

    case 52: // 4
      program  = 4
      break;

    case 53: // 5
      program  = 5
      break;

    case 54: // 6
      program  = 6
      break;

    case 55: // 7
      program  = 7
      break;

    case 56: // 8
      program  = 8
      break;

    case 57: // 9
      program  = 9
      break;

    case 96: // 0
      program  = 0
      break;

    case 97: // 1
      program  = 1
      break;

    case 98: // 2
      program  = 2
      break;

    case 99: // 3
      program  = 3
      break;

    case 100: // 4
      program  = 4
      break;

    case 101: // 5
      program  = 5
      break;

    case 102: // 6
      program  = 6
      break;

    case 103: // 7
      program  = 7
      break;

    case 104: // 8
      program  = 8
      break;

    case 105: // 9
      program  = 9
      break;

      // program 101, 102, 103..

    case 67: // c
      selectRandomMovie(source1)
      selectRandomMovie(source2)
      selectRandomMovie(source3)
      break;

    case 82: // r
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
      break;

    default:
      break;
  }


  console.log(e.which, program)
}


var use_mic = false
if ( urlParams.get('mic') ) {
  use_mic = urlParams.get('mic')
}

var use_only_bpm = false
if ( urlParams.get('bpm') ) {
  use_only_bpm = urlParams.get('bpm')
}

var use_mod = false
if ( urlParams.get('mod') ) {
  use_mod = urlParams.get('mod')
}

var use_shift = false
if ( urlParams.get('shift') ) {
  use_shift = true
}

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
var mixer2 = new Mixer( renderer, { source1: mixer1, source2: source3 });

// var analisi
// var bpm = new BPM( renderer ) tapped beat control
// var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/nsb' } )
//var audioanalysis1 = new AudioAnalysis( renderer, { audio: 'http://37.220.36.51:8906/;?type=http&nocache=' + Math.round( Math.random() * 100000 )  } )
//var audioanalysis1 = new AudioAnalysis( renderer, { audio: 'https://nsbradio.co.uk/play.php' } )
//var audioanalysis1 = new AudioAnalysis( renderer, { audio: 'https://443-1.autopo.st/130/;' } )

var audioanalysis1 = null
if ( use_only_bpm ) {
  audioanalysis1 = new BPM( renderer ) // tapped beat control
  audioanalysis1.bpm = use_only_bpm
} else {
  if ( use_mic ) {
    var audioanalysis1 = new AudioAnalysis( renderer, { audio: '', microphone: true } )
  } else {
    //audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/nsb' } )
    audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/rap' } )
  }
}


// var audioanalysis1 = new AudioAnalysis( renderer, { audio: '', microphone: true } )

var filemanager = new FileManager( source1 )
//filemanager.load_set("/sets/vunzige_deuntjes.json")
filemanager.load_set("/sets/vunzige_deuntjes_v2.json")

var filemanager2 = new FileManager( source2 )
//filemanager2.load_set("/sets/vunzige_deuntjes.json")
filemanager2.load_set("/sets/vunzige_deuntjes_v2.json")

var filemanager3 = new FileManager( source3 )
//filemanager3.load_set("/sets/vunzige_deuntjes_branded.json")
filemanager3.load_set("/sets/vunzige_deuntjes_v2.json")


// add noise9
// var mixer2 = new Mixer( renderer, { source1: source3, source2: mixer1 });

// add effect
// var contrast = new ColorEffect( renderer, { source: mixer2 } )

// finally asign that mixer to the output
var output = new Output( renderer, mixer2 )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

/* ----------------------------------------------------------------------------
   And we are away
   ---------------------------------------------------------------------------- */

// set noise
// mixer2.mixMode(5)
// mixer2.blendMode(1)
// mixer2.pod(0)

// contrast.effect(61)
// contrast.extra(0.4)
//mixer2.bindBpm( function() { return audioanalysis1.getBpm()/4 } );
//mixer2.autoFade = true
// audioanalysis1.add( mixer1.pod )

if ( use_shift ) {
  mix_shift = Number(urlParams.get('shift'))
}

var shifted_pod = function() {
  var float = audioanalysis1.render()
  float = float + mix_shift
  //float = Math.abs(float - ( 1 + mix_shift ) )

  if (float > 1) {
    float = 1 - ( float - 1 )
  }

  if (float < 0) {
    float = Math.abs(float)
  }
  if (float > 0) float = 0
  return float
}

if ( use_mod ) {
  audioanalysis1.mod = use_mod
} else {
  audioanalysis1.mod = 1
}


// audioanalysis1.add( shifted_pod )

/*
  Init local ( i hate myseld)
  setInterval( function() {
  // eu.check_set(filemanager2.set)
  })
*/
var never_together = [
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 1 (1).mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 10.mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 2.mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 3 (1).mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 4 (1).mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 5 (1).mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 6.mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 7 (1).mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 7 (1).mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 8 (1).mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/logos_donkerder/SCENE 9 (1).mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/aangeleverd/SCENE 1.mp4",
  "https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/branded/artist_vunzige_deuntjes_soundsystem_2.mp4"
]

var selectRandomMovie = function( _source ) {
  console.log("[rr] select random movie: ", _source )
  // its all the same set anyway s
  //   filemanager.setTimeout
  var rand = Math.floor( Math.random() * filemanager.set.length )
  var randomVideo = filemanager.set[ rand ]


  //filemanager.set.includes()

  // check_uniqueness, this should include current source
  if ( source1.video.src == randomVideo || source2.video.src == randomVideo || source3.video.src == randomVideo ) {
    console.log("[rr] return random movie")
    selectRandomMovie( _source )
    return
  }

  if ( never_together.includes(randomVideo) ) {
    console.log("[rr] movie is in never together")

    // check never together, this should NOT include current source
    // never_together.includes( decodeURI( source2.video.src ) )
    if (
      ( never_together.includes( decodeURI( source1.video.src ) ) && _source != source1 ) ||
      ( never_together.includes( decodeURI( source2.video.src ) ) && _source != source2 ) ||
      ( never_together.includes( decodeURI( source3.video.src ) ) && _source != source3 ) ) {
      console.log("[rr] there is a never together on a different node")
      selectRandomMovie( _source )
      return
    }

  }

  _source.src(randomVideo)

  console.log("[rr] changed source!", rand, randomVideo)
  console.log("[rr] ", source1.video.src)
  console.log("[rr] ", source2.video.src)
  console.log("[rr] ", source3.video.src)

}

var wasSet = false
var beats = 00
var mix_shift = 0.25

/*
1 ADD (default),  <<
2 SUBSTRACT,
3 MULTIPLY,
4 DARKEN,
5 COLOUR BURN,
6 LINEAR_BURN,
7 LIGHTEN,        <<
8 SCREEN,         <<
9 COLOUR_DODGE,   <<
10 LINEAR_DODGE,  <<
11 OVERLAY,
12 SOFT_LIGHT,
13 HARD_LIGHT,
14 VIVID_LIGHT,
15 LINEAR_LIGHT,
16 PIN_LIGHT,
17 DIFFERENCE,    <<
18 EXCLUSION      <<
*/

var useBlendmodes = [ 1 ] //13, //,  7, 8, 9, 10, 17, 18

/*
1: NORMAL (default),   regular, linear crossfade
2: HARD,               switches with a hard cut at 50%
3: NAM,                fades with an upward curvature forcing 100% opacity throughout the crossfade (lighter!)
4: FAM,                fades with a downward curve, forcing a 'overlay' period
5: NON DARK,           Never goes dark, 0-2 linear curve, capped at 1 and .36
6: LEFT,               forces the pod on 0 (locks pod)
7: RIGHT,              forces the pod on 1 (locks pod)
8: CENTER,             forces both sources at ~66% (locks pod)
9: BOOM                forces both sources at 100%, allows for overflow (lighter!) (locks pod)
*/

var useMixmodes = [ 1, 2, 3, 4, 5, 6 ] //  6, 7, 8, 9
var dice = 0
var oldprogram = 0
var monitor = false
var time = 0
var clock = 0.001
var count = 0
audioanalysis1.use_delay = true

setInterval(function() {

  var hasbeat = false
  var doOnce = false
  count += 1
  time += clock

  if (monitor) {
    if (count%30 == 0) console.log(mixer1.pod(), mixer2.pod(), audioanalysis1.delayed_bpm, audioanalysis1.bpm, mix_shift, time )
  }

  // keep monitoring those beats
  if ( audioanalysis1.render() > 0.95 && !wasSet ) {
    wasSet = true
    hasbeat = true
    beats += 1
    dice = Math.random()

    if ( audioanalysis1.tempoData ) {
      console.log("beat!", beats, audioanalysis1.mod, audioanalysis1.tempoData.confidence, audioanalysis1.tempoData.calibrating, audioanalysis1.bpm, audioanalysis1.delayed_bpm, beats, dice)
    }else{
      // return
      console.log("beat!", beats, audioanalysis1.mod, audioanalysis1.bpm, beats, dice)
    }
  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
  }


  // ----

  if (oldprogram != program) {
    doOnce = true
    oldprogram = program
  }

  if (program == 0) {
    if (doOnce) {
      console.log("start program 0")
      source3.src("https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/branded/logo_white.mp4")
    }

    audioanalysis1.mod = 0
    mixer1.pod(0)
    mixer2.pod(0)
    mixer1.blendMode(1)
    mixer1.mixMode(1)
    mixer2.blendMode(1)
    mixer2.mixMode(1)
  }


  if (program == 1) {
    if (doOnce) {
      console.log("start program 1")
      useBlendmodes = [ 1 ]
      useMixmodes = [ 1, 2 ]
      audioanalysis1.mod = 0.125
      mix_shift = 0
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 0.5
      source2.video.playbackRate = 0.5
      source3.video.playbackRate = 0.5
      mixer1.pod(0)
      mixer2.pod(1)
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
    }

    if (hasbeat) {
      if (beats%2 == 0) mixer1.fade(1600)
      if (beats%4 == 0 && Math.random() < 0.2 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.1 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.1 ) { selectRandomMovie(source1); console.log("changez 1") }
      if (beats%4 == 0 && Math.random() < 0.1 ) { selectRandomMovie(source2); console.log("changez 2") }
      if (beats%4 == 0 && Math.random() < 0.25 ) { selectRandomMovie(source3); console.log("changez 3") }
    }
  }

  if (program == 2) {
    if (doOnce) {
      console.log("start program 2")
      useBlendmodes = [ 1 ]
      useMixmodes = [ 1, 2 ]
      audioanalysis1.mod = 0.250
      mix_shift = 0
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 0.5
      source2.video.playbackRate = 0.5
      source3.video.playbackRate = 0.5
      mixer1.pod(0)
      mixer2.pod(1)
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
    }

    if (hasbeat) {
      if (beats%2 == 0) mixer1.fade(1200)
      if (beats%4 == 0 && Math.random() < 0.3 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.15 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.2 ) { selectRandomMovie(source1); console.log("changez 1") }
      if (beats%4 == 0 && Math.random() < 0.2 ) { selectRandomMovie(source2); console.log("changez 2") }
      if (beats%4 == 0 && Math.random() < 0.5 ) { selectRandomMovie(source3); console.log("changez 3") }
    }
  }

  if (program == 3) {
    if (doOnce) {
      console.log("start program 3")
      useBlendmodes = [ 1 ]
      useMixmodes = [ 1, 2 ]
      audioanalysis1.mod = 0.250
      mix_shift = 0
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 0.66
      source2.video.playbackRate = 0.66
      source3.video.playbackRate = 0.66
      mixer1.pod(0)
      mixer2.pod(1)
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
    }

    if (hasbeat) {
      if (beats%2 == 0) mixer1.fade(800)
      if (beats%4 == 0 && Math.random() < 0.4 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.2 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.25 ) { selectRandomMovie(source1); console.log("changez 1") }
      if (beats%4 == 0 && Math.random() < 0.25 ) { selectRandomMovie(source2); console.log("changez 2") }
      if (beats%4 == 0 && Math.random() < 0.5 ) { selectRandomMovie(source3); console.log("changez 3") }
    }
  }

  if (program == 4) {
    if (doOnce) {
      console.log("start program 4")
      useBlendmodes = [ 1 ]
      useMixmodes = [ 1, 2 ]
      audioanalysis1.mod = 0.250
      mix_shift = 0
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 0.75
      source2.video.playbackRate = 0.75
      source3.video.playbackRate = 0.75
      mixer1.pod(0)
      mixer2.pod(1)
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
    }

    if (hasbeat) {
      if (beats%2 == 0) mixer1.fade(800)
      if (beats%4 == 0 && Math.random() < 0.4 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.2 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source1); console.log("changez 1") }
      if (beats%4 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source2); console.log("changez 2") }
      if (beats%4 == 0 && Math.random() < 0.5 ) { selectRandomMovie(source3); console.log("changez 3") }
    }
  }

  if (program == 5) {
    if (doOnce) {
      console.log("start program 5")
      useBlendmodes = [ 1 ]
      useMixmodes = [ 1, 2 ]
      audioanalysis1.mod = 0.5
      mix_shift = 0
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 1
      source2.video.playbackRate = 1
      source3.video.playbackRate = 1
      mixer1.pod(0)
      mixer2.pod(1)
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
    }

    if (hasbeat) {
      mixer1.fade(500)
      if (beats%4 == 0 && Math.random() < 0.4 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.2 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.33 ) { selectRandomMovie(source1); console.log("changez 1") }
      if (beats%4 == 0 && Math.random() < 0.33 ) { selectRandomMovie(source2); console.log("changez 2") }
      if (beats%4 == 0 && Math.random() < 0.66 ) { selectRandomMovie(source3); console.log("changez 3") }
    }
  }

  if (program == 6) {
    if (doOnce) {
      console.log("start program 6")
      useBlendmodes = [ 1, 17, 3 ]
      useMixmodes = [ 1, 2, 3, 4, 5, 6 ]
      audioanalysis1.mod = 0.666
      mix_shift = 0
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 1
      source2.video.playbackRate = 1
      source3.video.playbackRate = 1
      mixer1.pod(0)
      mixer2.pod(1)
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
    }

    if (hasbeat) {
      mixer1.fade(500)
      if (beats%4 == 0 && Math.random() < 0.4 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.2 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.33 ) { selectRandomMovie(source1); console.log("changez 1") }
      if (beats%4 == 0 && Math.random() < 0.33 ) { selectRandomMovie(source2); console.log("changez 2") }
      if (beats%4 == 0 && Math.random() < 0.66 ) { selectRandomMovie(source3); console.log("changez 3") }
    }
  }

  if (program == 7) {
    if (doOnce) {
      console.log("start program 7")
      useBlendmodes = [ 1, 17, 3 ]
      useMixmodes = [ 1, 2, 3, 4, 5, 6 ]
      audioanalysis1.mod = 0.75
      mix_shift = 0
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 1
      source2.video.playbackRate = 1
      source3.video.playbackRate = 1
      mixer1.pod(0)
      mixer2.pod(1)
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
    }

    if (hasbeat) {
      mixer1.fade(500)
      if (beats%4 == 0 && Math.random() < 0.4 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.2 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.4 ) { selectRandomMovie(source1); console.log("changez 1") }
      if (beats%4 == 0 && Math.random() < 0.4 ) { selectRandomMovie(source2); console.log("changez 2") }
      if (beats%4 == 0 && Math.random() < 0.7 ) { selectRandomMovie(source3); console.log("changez 3") }
    }
  }

  if (program == 8) {
    if (doOnce) {
      console.log("start program 8")
      useBlendmodes = [ 1, 17, 3 ]
      useMixmodes = [ 1, 2, 3, 4, 5, 6 ]
      audioanalysis1.mod = 0.75
      mix_shift = 0
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 1.25
      source2.video.playbackRate = 1.25
      source3.video.playbackRate = 1.25
      mixer1.pod(0)
      mixer2.pod(1)
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
    }

    if (hasbeat) {
      mixer1.fade(500)
      if (beats%4 == 0 && Math.random() < 0.4 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.2 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source1); console.log("changez 1") }
      if (beats%4 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source2); console.log("changez 2") }
      if (beats%4 == 0 && Math.random() < 0.5 ) { selectRandomMovie(source3); console.log("changez 3") }
    }
  }

  if (program == 9) {
    if (doOnce) {
      console.log("start program 9")
      useBlendmodes = [ 1, 17, 3 ]
      useMixmodes = [ 1, 2, 3, 4, 5, 6 ]
      audioanalysis1.mod = 1
      mix_shift = 0
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 1.5
      source2.video.playbackRate = 1.5
      source3.video.playbackRate = 1.5
      mixer1.pod(0)
      mixer2.pod(1)
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
    }

    if (hasbeat) {
      mixer1.fade(250)
      if (beats%4 == 0 && Math.random() < 0.2 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.1 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%4 == 0 && Math.random() < 0.1 ) { selectRandomMovie(source1); console.log("changez 1") }
      if (beats%4 == 0 && Math.random() < 0.2 ) { selectRandomMovie(source2); console.log("changez 2") }
      if (beats%4 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source3); console.log("changez 3") }
    }
  }

  // old programs
  if (program == 101) {

    if (doOnce) {
      console.log("start program old 1")
      audioanalysis1.mod = 0.125
      useMixmodes = [ 1, 2, 3, 4, 5, 6 ]
      useBlendmodes = [ 1, 17, 3 ]
      mix_shift = 0.5
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 0.5
      source2.video.playbackRate = 0.5
      source3.video.playbackRate = 0.5

      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
      //useBlendmodes = [ 1 ] //13,
      //useMixmodes = [ 1, 2 ] //  6, 7, 8
    }
    // holy fucking shit
    // mix_shift = audioanalysis1.render()

    if (hasbeat) {


      if (beats%2 == 0 && Math.random() < 0.5 ) { selectRandomMovie(source1); console.log("1") }
      if (beats%2 == 0 && Math.random() < 0.5 ) { selectRandomMovie(source2); console.log("2") }
      if (beats%2 == 0 && Math.random() < 0.8 ) { selectRandomMovie(source3); console.log("3") }

      // every beat
      //if (beats%1 == 0 && Math.random() < 0.5 ) source1.jump()
      //if (beats%1 == 0 && Math.random() < 0.5 ) source2.jump()
      //if (beats%1 == 0 && Math.random() < 0.5 ) source3.jump()

      if (beats%3 == 0 && Math.random() < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%3 == 0 && Math.random() < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

      // init only
      //if (beats == 2) selectRandomMovie(source1)
      //if (beats == 3) selectRandomMovie(source2)
      //if (beats == 4) selectRandomMovie(source3)

      //if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 1"); selectRandomMovie(source1);  } //setTimeout(function() { source1.jump() }, 1500 )
      //if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 2"); selectRandomMovie(source2); } //setTimeout(function() { source1.jump() }, 1500 )
      //if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 3"); selectRandomMovie(source3); } //setTimeout(function() { source1.jump() }, 1500 )


      //if (beats%12 == 0 && dice > 0.4 ) mixer2.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      //if (beats%16 == 0 && dice > 0.7 ) mixer2.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

      //if (beats%32 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.125
      //if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 0.25
      //if (beats%32 == 0 && dice > 0.8 ) audioanalysis1.mod = 0.5

      //if (beats%32 == 0 && dice < 0.1 ) mix_shift = 0.125
      //if (beats%32 == 0 && dice > 0.5 ) mix_shift = 0.25
      //if (beats%16 == 0 && dice > 0.8  ) mix_shift = 1
    }
  }

  if (program == 102) {
    if (doOnce) {
      audioanalysis1.mod = 0.250
      mix_shift = 0.5
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 0.75
      source2.video.playbackRate = 0.75
      source3.video.playbackRate = 0.75
    }

    if (hasbeat) {
      // every beat
      if (beats%2 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source1); console.log("1") }
      if (beats%2 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source2); console.log("2") }
      if (beats%2 == 0 && Math.random() < 0.5 ) { selectRandomMovie(source3); console.log("3") }

      // every beat
      //if (beats%1 == 0 && Math.random() < 0.5 ) source1.jump()
      //if (beats%1 == 0 && Math.random() < 0.5 ) source2.jump()
      //if (beats%1 == 0 && Math.random() < 0.5 ) source3.jump()

      if (beats%3 == 0 && Math.random() < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%3 == 0 && Math.random() < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    }
  }

  if (program == 103) {

    if (doOnce) {
      audioanalysis1.mod = 0.32
      mix_shift = 0.5
      audioanalysis1.use_delay = true
      source1.video.playbackRate = 1
      source2.video.playbackRate = 1
      source3.video.playbackRate = 1
      //selectRandomMovie(source1)
      //selectRandomMovie(source2)
      //selectRandomMovie(source3)
    }

    if (hasbeat) {
      // every beat
      if (beats%2 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source1); console.log("1") }
      if (beats%2 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source2); console.log("2") }
      if (beats%2 == 0 && Math.random() < 0.5 ) { selectRandomMovie(source3); console.log("3") }

      // every beat
      //if (beats%1 == 0 && Math.random() < 0.5 ) source1.jump()
      //if (beats%1 == 0 && Math.random() < 0.5 ) source2.jump()
      //if (beats%1 == 0 && Math.random() < 0.5 ) source3.jump()

      if (beats%3 == 0 && Math.random() < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%3 == 0 && Math.random() < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    }
  }

  if (program == 104) {

    if (doOnce) {
      audioanalysis1.mod = 0.5
      mix_shift = 0.5
      audioanalysis1.use_delay = false
      source1.video.playbackRate = 1
      source1.video.playbackRate = 1
      source1.video.playbackRate = 1
      selectRandomMovie(source1)
      selectRandomMovie(source2)
      selectRandomMovie(source3)
    }

    if (hasbeat) {
      // every beat
      if (beats%2 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source1); console.log("1") }
      if (beats%2 == 0 && Math.random() < 0.3 ) { selectRandomMovie(source2); console.log("2") }
      if (beats%2 == 0 && Math.random() < 0.5 ) { selectRandomMovie(source3); console.log("3") }

      // every beat
      //if (beats%1 == 0 && Math.random() < 0.5 ) source1.jump()
      //if (beats%1 == 0 && Math.random() < 0.5 ) source2.jump()
      //if (beats%1 == 0 && Math.random() < 0.5 ) source3.jump()

      if (beats%3 == 0 && Math.random() < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%3 == 0 && Math.random() < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    }
  }

  if (program == 105) {

      if (doOnce) {
        audioanalysis1.mod = 0.5
        clock = 0.001
        mix_shift = Math.sin(time)
        audioanalysis1.use_delay = true
        source1.video.playbackRate = 1
        source1.video.playbackRate = 1
        source1.video.playbackRate = 1
        selectRandomMovie(source1)
        selectRandomMovie(source2)
        selectRandomMovie(source3)
      }

      if (hasbeat) {
        // every beat
        //if (beats%6 == 0 && dice < 0.2 ) source1.jump()
        //if (beats%4 == 0 && dice < 0.2 ) source2.jump()

        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 1"); selectRandomMovie(source1);  } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 2"); selectRandomMovie(source2); } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 3"); selectRandomMovie(source3); } //setTimeout(function() { source1.jump() }, 1500 )

        if (beats%8 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
        if (beats%12 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

        if (beats%12 == 0 && dice > 0.4 ) mixer2.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
        if (beats%16 == 0 && dice > 0.7 ) mixer2.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

        if (beats%32 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.125
        if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 0.25
        if (beats%32 == 0 && dice > 0.8 ) audioanalysis1.mod = 0.5

        if (beats%32 == 0 && dice < 0.1 ) mix_shift = 0.125
        if (beats%32 == 0 && dice > 0.5 ) mix_shift = 0.25
        if (beats%16 == 0 && dice > 0.8  ) mix_shift = 1
      }
    }

    if (program == 106) {

      if (doOnce) {
        audioanalysis1.mod = 0.75
        mix_shift = 0.5
        audioanalysis1.use_delay = true
        source1.video.playbackRate = 1
        source2.video.playbackRate = 1
        source3.video.playbackRate = 1
        selectRandomMovie(source1)
        selectRandomMovie(source2)
        selectRandomMovie(source3)
      }

      if (hasbeat) {
        // every beat
        //if (beats%6 == 0 && dice < 0.2 ) source1.jump()
        //if (beats%4 == 0 && dice < 0.2 ) source2.jump()

        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 1"); selectRandomMovie(source1);  } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 2"); selectRandomMovie(source2); } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 3"); selectRandomMovie(source3); } //setTimeout(function() { source1.jump() }, 1500 )

        if (beats%8 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
        if (beats%12 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

        if (beats%12 == 0 && dice > 0.4 ) mixer2.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
        if (beats%16 == 0 && dice > 0.7 ) mixer2.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

        if (beats%32 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.125
        if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 0.25
        if (beats%32 == 0 && dice > 0.8 ) audioanalysis1.mod = 0.5

        if (beats%32 == 0 && dice < 0.1 ) mix_shift = 0.125
        if (beats%32 == 0 && dice > 0.5 ) mix_shift = 0.25
        if (beats%16 == 0 && dice > 0.8  ) mix_shift = 1
      }
    }

    if (program == 107) {

      if (doOnce) {
        audioanalysis1.mod = 0.8
        clock = 0.01
        mix_shift = mix_shift = Math.sin(time)
        audioanalysis1.use_delay = true
        source1.video.playbackRate = 1.25
        source2.video.playbackRate = 1.25
        source3.video.playbackRate = 1.25
        selectRandomMovie(source1)
        selectRandomMovie(source2)
        selectRandomMovie(source3)
      }

      if (hasbeat) {
        // every beat
        // every beat
        //if (beats%3 == 0 && dice < 0.2 ) source1.jump()
        //if (beats%4 == 0 && dice < 0.2 ) source2.jump()

        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 1"); selectRandomMovie(source1);  } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 2"); selectRandomMovie(source2); } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.5 ) { console.log("change FM 3"); selectRandomMovie(source3); } //setTimeout(function() { source1.jump() }, 1500 )

        if (beats%2 == 0 && Math.random() < 0.2 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
        if (beats%2 == 0 && Math.random() < 0.2 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      }
    }

    if (program == 108) {

      if (doOnce) {
        audioanalysis1.mod = 1
        mix_shift = 0.5
        audioanalysis1.use_delay = true
        source1.video.playbackRate = 1.33
        source2.video.playbackRate = 1.33
        source3.video.playbackRate = 1.33
        selectRandomMovie(source1)
        selectRandomMovie(source2)
        selectRandomMovie(source3)
      }

      mix_shift = audioanalysis1.render()

      if (hasbeat) {
        // every beat
        //if (beats%3 == 0 && dice < 0.2 ) source1.jump()
        //if (beats%4 == 0 && dice < 0.2 ) source2.jump()

        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 1"); selectRandomMovie(source1);  } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 2"); selectRandomMovie(source2); } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.5 ) { console.log("change FM 3"); selectRandomMovie(source3); } //setTimeout(function() { source1.jump() }, 1500 )

        if (beats%2 == 0 && Math.random() < 0.2 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
        if (beats%2 == 0 && Math.random() < 0.2 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

        //if (beats%2 == 0 && Math.random() > 0.4 ) mixer2.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
        //if (beats%2 == 0 && Math.random() > 0.7 ) mixer2.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

        //if (beats%8 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.125
        //if (beats%8 == 0 && dice > 0.5 ) audioanalysis1.mod = 0.25
        //if (beats%8 == 0 && dice > 0.8 ) audioanalysis1.mod = 0.5

        //if (beats%32 == 0 && dice < 0.1 ) mix_shift = 0.125
        //if (beats%32 == 0 && dice > 0.5 ) mix_shift = 0.25
        //if (beats%16 == 0 && dice > 0.8  ) mix_shift = 1
      }
    }

    if (program == 109) {

      if (doOnce) {
        audioanalysis1.mod = 1.5
        clock = 0.1
        mix_shift = mix_shift = mix_shift = Math.sin(time) //audioanalysis1.render()
        audioanalysis1.use_delay = false
        source1.video.playbackRate = 1.5
        source1.video.playbackRate = 1.5
        source1.video.playbackRate = 1.5
        selectRandomMovie(source1)
        selectRandomMovie(source2)
        selectRandomMovie(source3)
      }

      if (hasbeat) {
        // every beat
        //if (beats%3 == 0 && dice < 0.2 ) source1.jump()
        //if (beats%4 == 0 && dice < 0.2 ) source2.jump()

        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 1"); selectRandomMovie(source1);  } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.2 ) { console.log("change FM 2"); selectRandomMovie(source2); } //setTimeout(function() { source1.jump() }, 1500 )
        if (beats%4 == 0 && Math.random() < 0.5 ) { console.log("change FM 3"); selectRandomMovie(source3); } //setTimeout(function() { source1.jump() }, 1500 )

        if (beats%2 == 0 && Math.random() < 0.2 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
        if (beats%2 == 0 && Math.random() < 0.2 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      }
    }
}, 1 )

/*
"https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/free-loops_EDM_Triangles_Scroll_Horizontal_White_DXV.mp4",
"https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/free-loops_EDM_Triangles_Scroll_Vertical_Purple_DXV.mp4",
"https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/free-loops_Stylish_Orange_Circles_Close_Up_Endless_Visual_DXV3.mp4",
"https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/free-loops_Stylish_Orange_Circles_Endless_Visual_DXV3.mp4",
"https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/Smoke_Dark_11_Videvo.mp4",
"https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/Stars - 69826.mp4",
"https://cdn.virtualmixproject.com/veejay/vunzige_deuntjes/stars sky 1 loop reverse.mp4"
*/

// setTimeout( function() { selectRandomMovie(source1) }, 1500 )
// setTimeout( function() { selectRandomMovie(source2) }, 3000 )
// setTimeout( function() { selectRandomMovie(source3) }, 5000 ) //setTimeout(function() { source1.jump() }, 1500 )

//setTimeout( function() {
//  document.querySelector(".logo").classList.add("hide")
//  document.querySelector("button").classList.add("hide")
//  document.querySelector(".payoff").classList.add("hide")
//}, 15000 )
