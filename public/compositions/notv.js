// create a renderer
var renderer = new GlRenderer();

// create some solids
var source1 = new VideoSource(renderer, {src:""})
var source2 = new VideoSource(renderer, {src:""})

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

var bpm = new BPM( renderer, { audio: "" })
var filemanager = new FileManager( renderer, { set: "/sets/notv.json"} )

// finally asign that mixer to the output
var output = new Output( renderer, mixer1 )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation
