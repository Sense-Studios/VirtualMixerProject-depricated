// create a renderer
var renderer = new GlRenderer();

// create some solids
var source1 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/occupy_chaos/title_credits_and_hues/xangavision.mp4" })
var source2 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/occupy_chaos/title_credits_and_hues/title.mp4" })

var source3 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/space/FC205_1.mp4" })

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
var mixer2 = new Mixer( renderer, { source1: mixer1, source2: source3 });

// var analisi
// var bpm = new BPM( renderer ) tapped beat control
var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/rap' } )

var filemanager = new FileManager( source1 )
filemanager.load_set("/sets/occupy_chaos.json")

var filemanager2 = new FileManager( source2 )
filemanager2.load_set("/sets/occupy_chaos.json")

var filemanager3 = new FileManager( source3 )
filemanager3.load_set("/sets/clutter.json")

// finally asign that mixer to the output
var output = new Output( renderer, mixer2 )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

audioanalysis1.add( mixer1.pod )
audioanalysis1.mod = 0.5

mixer2.mixMode(5)
mixer2.blendMode(1)
mixer2.pod(1.0)

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
    // if (beats%6 == 0 && dice < 0.07 ) source1.jump()
    // if (beats%4 == 0 && dice < 0.07 ) source2.jump()
    if (beats%8 == 0 && dice < 0.75 ) filemanager.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%12 == 0 && dice < 0.75 ) filemanager2.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    if (beats%11 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    if (beats%24 == 0 && dice < 0.5 ) audioanalysis1.mod = 0.5
    if (beats%24 == 0 && dice > 0.5 ) audioanalysis1.mod = 1
    if (beats%8 == 0 && dice > 0.6 ) filemanager3.changez();
    if (beats%12 == 0 && dice > 0.5 ) { mixer2.pod(0.7); mixer2.mixMode(5) }
    if (beats%12 == 0 && dice > 0.9 ) { mixer2.pod(1.4); mixer2.mixMode(5) }
    if (beats%12 == 0 && dice < 0.5 ) { mixer2.pod(1.0); mixer2.mixMode(5) }
    if (beats%12 == 0 && dice < 0.2 ) { mixer2.pod(1.0); mixer2.mixMode(1) }


  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )
