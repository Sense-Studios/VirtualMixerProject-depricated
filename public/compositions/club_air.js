// helpers
var showMenu = function() {
  document.getElementById("menu").classList.remove('hidden')
}

document.getElementById('gotime').onmouseup = function() {

  var selected = null
  document.querySelectorAll('input[type=radio]').forEach( function(item, i ) {
    if (item.checked ) selected = item.value
  })

  // gather data
  urlvars = "?mod="
  urlvars += document.getElementById('mod_val').value
  urlvars += "&shift="
  urlvars += document.getElementById('shift_val').value

  if (selected == "justbpm") {
    urlvars += "&bpm="
    urlvars += document.getElementById('bpm_val').value
  }

  if (selected == "radio") {

  }

  if (selected == "mic") {
    urlvars += "&mic=true"
  }

  if (selected == "go") {
    document.getElementById("menu").classList.add('hidden')
    return
  }

  window.location.href = "https://virtualmixproject.com/mixer/club_air" + urlvars + "&r=" + Math.random()*1000000
}

document.getElementById('play_button').onclick = function() {
  document.getElementById('glcanvas').requestFullscreen()
  document.getElementById('play_button').style.display = "none"
}

// -----------------------------------------------------------------------------
// document.getElementById('shift_val')

// create a renderer
var renderer = new GlRenderer();

// create some solids
var source1 = new VideoSource(renderer, { src: "https://nabu.s3.eu-west-1.amazonaws.com/veejay/club_air/Gold diamond small.mp4"} )
var source2 = new VideoSource(renderer, { src: "https://nabu.s3.eu-west-1.amazonaws.com/veejay/club_air/AIR_GRAPHICS_MINIMAL_COLOR_15.mp4"} )
var source3 = new VideoSource(renderer, { src: "https://nabu.s3.eu-west-1.amazonaws.com/veejay/club_air/Neon lines mesh beat slower.mp4"} )
//var source3 = new VideoSource(renderer, { src: "http://nabu-dev.s3.amazonaws.com/uploads/video/53e2a3ad6465761455190000/720p_5000kbps_h264.mp4?r=737324588185" } );

// get url vars
var srch = window.location.search
var urlParams = new URLSearchParams(srch);

if (srch == '') {
  console.warn("ownies, no vars, show menu")
  showMenu()
}

window.document.onkeydown  = function(e) {
  if (e.which == "192") {
    showMenu()
  }
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
    audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/nsb' } )
  }
}


// var audioanalysis1 = new AudioAnalysis( renderer, { audio: '', microphone: true } )

var filemanager = new FileManager( source1 )
filemanager.load_set("/sets/club_air.json")

var filemanager2 = new FileManager( source2 )
filemanager2.load_set("/sets/club_air.json")

var filemanager3 = new FileManager( source2 )
filemanager3.load_set("/sets/club_air.json")

// add noise
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
//mixer2.audoFade = true
audioanalysis1.add( mixer1.pod )

var mix_shift = 0.25

if ( use_shift ) {
  mix_shift = Number(urlParams.get('shift'))
}

var shifted_pod = function() {
  var float = audioanalysis1.render()
  float = float + mix_shift
  if (float > 1) float = float - 1
  mixer2.pod(float)
  return float
}

audioanalysis1.add( shifted_pod )


if ( use_mod ) {
  audioanalysis1.mod = use_mod
} else {
  audioanalysis1.mod = 0.25
}


/*
  Init local ( i hate myseld)
  setInterval( function() {
  // eu.check_set(filemanager2.set)
  })
*/

var wasSet = false
var beats = 0
var useBlendmodes = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
var useMixmodes = [ 1, 2, 3, 4, 5, 6, 9 ] //  6, 7, 8
var dice = 0
audioanalysis1.use_delay = false
setInterval(function() {
  if ( audioanalysis1.render() > 0.95 && !wasSet ) {
    if ( audioanalysis1.tempoData ) {
      console.log("beat!", audioanalysis1.mod, audioanalysis1.tempoData.confidence, audioanalysis1.tempoData.calibrating, audioanalysis1.bpm, audioanalysis1.delayed_bpm, beats, dice)
    }else{
      // return
      console.log("beat!", audioanalysis1.mod, audioanalysis1.bpm, beats, dice)
    }

    wasSet = true
    beats += 1
    dice = Math.random()
    if (beats == 2) filemanager.changez()
    if (beats == 6) filemanager2.changez()
    if (beats%6 == 0 && dice < 0.2 ) source1.jump()
    if (beats%4 == 0 && dice < 0.2 ) source2.jump()
    if (beats%16 == 0 && dice < 0.84 ) filemanager.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%12 == 0 && dice < 0.84 ) filemanager2.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%12 == 0 && dice > 0.24 ) filemanager3.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    if (beats%18 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

    if (beats%9 == 0 && dice > 0.6 ) mixer2.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    if (beats%18 == 0 && dice > 0.7 ) mixer2.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );

    if (beats%32 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.125
    if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 0.5

    if (beats%32 == 0 && dice < 0.1 ) mix_shift = 0.125
    if (beats%32 == 0 && dice > 0.5 ) mix_shift = 0.25
    if (beats%16 == 0 && dice > 0.8  ) mix_shift = 1
  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
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


//setTimeout( function() {
//  document.querySelector(".logo").classList.add("hide")
//  document.querySelector("button").classList.add("hide")
//  document.querySelector(".payoff").classList.add("hide")
//}, 15000 )

setTimeout( function() { filemanager.changez() }, 1500 )
setTimeout( function() { filemanager2.changez() }, 3000 )
setTimeout( function() { filemanager3.changez() }, 5000 ) //setTimeout(function() { source1.jump() }, 1500 )
