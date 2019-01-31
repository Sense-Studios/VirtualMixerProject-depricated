// create a renderer
var renderer = new GlRenderer();

// create some solids
var source1 = new VideoSource(renderer, {})
var source2 = new VideoSource(renderer, {})

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

// var analisi
// var bpm = new BPM( renderer ) tapped beat control
var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/nsb' } )

var filemanager = new FileManager( source1 )
filemanager.load_set("/sets/notv.json")

var filemanager2 = new FileManager( source2 )
filemanager2.load_set("/sets/notv.json")

// finally asign that mixer to the output
var output = new Output( renderer, mixer1 )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

audioanalysis1.add( mixer1.pod )

var wasSet = false
var beats = 0
setInterval(function() {
  if ( audioanalysis1.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    console.log("beat!", beats)
    if (beats == 2) filemanager.changez()
    if (beats == 6) filemanager2.changez()
    if (beats%6 == 0) source1.jump()
    if (beats%4 == 0) source2.jump()
    if (beats%16 == 0) filemanager.changez()
    if (beats%12 == 0) filemanager2.changez()
  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )
