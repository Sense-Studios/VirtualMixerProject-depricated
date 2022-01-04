var renderer = new GlRenderer();
var source1 = new VideoSource(renderer, {});
var source2 = new VideoSource(renderer, {});
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

// var bpm = new BPM( renderer ) tapped beat control
// var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/nsb' } )
var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/audio/Astral Projection - Ambient Galaxy.mp3' } )
//var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/audio/ignore/Song of the Sisters.mp3' } )
//var audioanalysis1 = new AudioAnalysis( renderer, { audio: 'http://37.220.36.51:8906/;?type=http&nocache=' + Math.round( Math.random() * 100000 )  } )
//var audioanalysis1 = new AudioAnalysis( renderer, { audio: 'https://nsbradio.co.uk/play.php' } )

var filemanager = new FileManager( source1 )
filemanager.load_set("/sets/dune_local.json")

var filemanager2 = new FileManager( source2 )
filemanager2.load_set("/sets/dune_local.json")

// add effect
var contrast = new ColorEffect( renderer, { source: mixer1 } )

var output = new Output( renderer, contrast );
renderer.init();
renderer.render();

audioanalysis1.add( mixer1.pod )
audioanalysis1.mod = 0.0625

contrast.effect(61)
contrast.extra(0.4)


var wasSet = false
var beats = 0
var useBlendmodes = [ 1, 7, 8, 9, 10, 18 ] // 17, 13,
var useMixmodes = [ 1, 2, 3, 1, 2, 3, 6, 7 ] //  6, 7, 8  3, 4, 5, 6, 7, 9
var dice = 0
setInterval(function() {

  //bpm: 134
  //calibrating: false
  //confidence: "high"
  //foundpeaks: (39) [Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
  //peaks: (4000) [empty × 6, Array(2), empty × 179, Array(2), empty × 50, Array(2), empty × 54, Array(2), empty × 63, Array(2), empty × 99, Array(2), empty × 159, Array(2), empty × 79, Array(2), empty × 50, Array(2), empty × 50, Array(2), empty × 63, Array(2), empty × 253, Array(2), empty × 85, Array(2), empty × 139, Array(2), empty × 169, Array(2), empty × 53, Array(2), empty × 55, Array(2), empty × 53, Array(2), empty × 54, Array(2), empty × 60, Array(2), empty × 162, Array(2), empty × 59, //Array(2), empty × 229, Array(2), empty × 159, Array(2), empty × 55, Array(2), empty × 53, Array(2), empty × 55, Array(2), empty × 113, Array(2), empty × 229, Array(2), empty × 59, Array(2), empty × 159, Array(2), empty × 164, Array(2), empty × 50, Array(2), empty × 59, Array(2), empty × 53, Array(2), empty × 50, Array(2), empty × 78, Array(2), empty × 215, Array(2), empty × 50, Array(2), empty × 137]
  //tempoCounts: (46) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]


  //monit
  document.getElementById('monit-bpm').textContent =          Math.round( audioanalysis1.bpm * 100 ) / 100
  document.getElementById('monit-delayed_bpm').textContent =  Math.round( audioanalysis1.delayed_bpm * 100 ) / 100
  document.getElementById('monit-mod').textContent =          audioanalysis1.mod
  document.getElementById('monit-count').textContent =        Math.round( audioanalysis1.count * 100 ) / 100
  document.getElementById('monit-sec').textContent =          Math.round( audioanalysis1.sec * 100 ) / 100
  document.getElementById('monit-bpm-float').textContent =    Math.round( audioanalysis1.bpm_float * 100 ) / 100
  document.getElementById('monit-bpm-1').textContent =        audioanalysis1.tempoData.calibrating
  document.getElementById('monit-bpm-2').textContent =        audioanalysis1.tempoData.confidence
  document.getElementById('monit-bpm-3').textContent =        audioanalysis1.tempoData.foundpeaks.length
  document.getElementById('monit-bpm-4').textContent =        audioanalysis1.tempoData.tempoCounts.length


  if ( audioanalysis1.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    dice = Math.random()
    console.log("beat!", beats, dice, mixer1.mixMode(), mixer1.blendMode(), audioanalysis1.mod)
    if (beats == 2) filemanager.changez()
    if (beats == 6) filemanager2.changez()
    //if (beats%6 == 0 && dice < 0.2 ) source1.jump()
    //if (beats%4 == 0 && dice < 0.2 ) source2.jump()
    if (beats%4 == 0 && dice < 0.64 ) filemanager.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%3 == 0 && dice < 0.64 ) filemanager2.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    //if (beats%8 == 0 && dice < 0.54 ) filemanager.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    //if (beats%4 == 0 && dice < 0.44 ) filemanager2.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    if (beats%18 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    if (beats%32 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.125
    if (beats%32 == 0 && dice < 0.5 ) audioanalysis1.mod = 0.25
    if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 0.5
  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )
