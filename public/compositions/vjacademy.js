// create a renderer
var renderer = new GlRenderer();

// create some solids
var source1 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/vjacademy/vjacademy_intro.mp4" } )
var source2 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/vjacademy/vjacademy_intro.mp4" } )

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

// var analisi
// var bpm = new BPM( renderer ) tapped beat control
var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/trance' } )

var filemanager = new FileManager( source1 )
filemanager.load_set("/sets/vjacademy2010-2018.json")

var filemanager2 = new FileManager( source2 )
filemanager2.load_set("/sets/vjacademy2010-2018.json")

// finally asign that mixer to the output
var output = new Output( renderer, mixer1 )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

audioanalysis1.add( mixer1.pod )
audioanalysis1.mod = 0.5

setTimeout( function() {
  source1.currentTime(20)
  source2.currentTime(40)
}, 500 )

var wasSet = false
var beats = 0
var useBlendmodes = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
var useMixmodes = [ 1, 2, 3, 4, 5, 9 ]
var dice = 0
setInterval(function() {
  if ( audioanalysis1.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    dice = Math.random()
    console.log("beat!", beats, dice)
    if (beats == 2) filemanager.changez()
    if (beats == 6) filemanager2.changez()
    if (beats%6 == 0 && dice < 0.2 ) source1.jump()
    if (beats%4 == 0 && dice < 0.2 ) source2.jump()
    if (beats%16 == 0 && dice < 0.64 ) filemanager.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%12 == 0 && dice < 0.74 ) filemanager2.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    if (beats%11 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    if (beats%32 == 0 && dice < 0.4 ) audioanalysis1.mod = 0.5
    if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 1
  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )
