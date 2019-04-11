// create a renderer
var renderer = new GlRenderer();

// create some solids
// var source1 = new VideoSource( renderer, { src: "/video/ignore/The.Matrix.1999.720p.BrRip.264.YIFY.mp4" })
// var source2 = new VideoSource( renderer, { src: "/video/ignore/The.Matrix.1999.720p.BrRip.264.YIFY.mp4" })
var source3 = new VideoSource( renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/space/FC205_1.mp4" } );
//var source3 = new VideoSource( renderer, { src: "http://nabu-dev.s3.amazonaws.com/uploads/video/53e2a3ad6465761455190000/720p_5000kbps_h264.mp4?r=737324588185" } );

var source1 = new VideoSource( renderer, { src: "/video/ignore/le_sacre/lsdp_nathalie_kasatikina.mp4" })
var source2 = new VideoSource( renderer, { src: "/video/ignore/le_sacre/lsdp_maurice_bejart.mp4" })
// var source3 = new VideoSource( renderer, { src: "/video/ignore/le_sacre/lsdp_ballets_russes.mp4" })
//var source3 = new VideoSource( renderer, { src: "/video/ignore/le_sacre/le_sacre_in_bloom.mp4" })

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

// var analisi
// var bpm = new BPM( renderer ) tapped beat control
var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/astros' } )

var filemanager = new FileManager( source1 )
filemanager.load_set("/sets/programs_awesome.json")

var filemanager2 = new FileManager( source2 )
filemanager2.load_set("/sets/programs_clutter.json")

var filemanager3 = new FileManager( source3 )
filemanager3.load_set("/sets/clutter2.json")

// add noise
var mixer2 = new Mixer( renderer, { source1: source3, source2: mixer1});

// finally asign that mixer to the output
var output = new Output( renderer, mixer2 )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

// set noise
mixer2.mixMode(5)
mixer2.blendMode(11)
mixer2.pod(0.6)
//mixer2.bindBpm( function() { return audioanalysis1.getBpm()/4 } );
//mixer2.audoFade = true

audioanalysis1.add( mixer1.pod )
audioanalysis1.mod = 1

var wasSet = false
var beats = 0
var useBlendmodes = [ 1, 7, 8, 9, 10, 17, 18 ] // 13
var useMixmodes = [ 1, 2, 6, 7, 5, 3, 4, 5, 9 ] //  6, 7, 8
var dice = 0
setInterval(function() {
  if ( audioanalysis1.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    dice = Math.random()
    console.log("beat!", beats, dice)
    //if (beats == 2) filemanager.changez()
    if (beats == 2) source1.jump()
    if (beats == 6) source2.jump()
    //if (beats == 6) filemanager2.changez()
    if (beats%6 == 0 && dice < 0.2 ) source1.jump()
    if (beats%4 == 0 && dice < 0.2 ) source2.jump()
    //if (beats%16 == 0 && dice < 0.64 ) filemanager.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%16 == 0 && dice < 0.64 ) source1.jump() //setTimeout(function() { source1.jump() }, 1500 )
    //if (beats%12 == 0 && dice < 0.64 ) filemanager2.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%12 == 0 && dice < 0.64 ) source2.jump();
    if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    if (beats%18 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    if (beats%16 == 0 && dice > 0.75 ) audioanalysis1.mod = 1
    if (beats%32 == 0 && dice < 0.5 ) audioanalysis1.mod = 0.5
    if (beats%32 == 0 && dice < 0.4 ) audioanalysis1.mod = 0.25
    if (beats%32 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.125

    if (beats%8 == 0 && dice > 0.50 ) filemanager3.changez()

    if (beats%12 == 0 && dice > 0.40 ) mixer2.blendMode(1)
    if (beats%12 == 0 && dice > 0.60 ) mixer2.blendMode(11)
    // if (beats%12 == 0 && dice > 0.80 ) mixer2.blendMode(13)
    // if (beats%12 == 0 && dice > 0.90 ) mixer2.blendMode(3)

  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )