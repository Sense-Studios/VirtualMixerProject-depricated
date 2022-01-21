

// VMX -------------------------------------------------------------------------

// create the main renderer
var renderer = new GlRenderer({element: 'glcanvas'});

// channels
var channel1_source = new VideoSource(renderer, { src: "" })
//var channel1_filemanager = new FileManager( channel1_source )
var channel1_effect = new ColorEffect( renderer, { source: channel1_source } )
var channel1_monitor = new Monitor( renderer, { source: channel1_effect, element: 'monitoring_canvas_1' })

var channel2_source = new VideoSource(renderer, { src: "" })
//var channel2_filemanager = new FileManager( channel2_source )
var channel2_effect = new ColorEffect( renderer, { source: channel2_source } )
var channel2_monitor = new Monitor( renderer, { source: channel2_effect, element: 'monitoring_canvas_2' })

var channel3_source = new VideoSource(renderer, { src: "" })
//var channel3_filemanager = new FileManager( channel3_source )
var channel3_effect = new ColorEffect( renderer, { source: channel3_source } )
var channel3_monitor = new Monitor( renderer, { source: channel3_effect, element: 'monitoring_canvas_3' })

var channel4_source = new VideoSource(renderer, { src: "" })
//var channel4_filemanager = new FileManager( channel4_source )
var channel4_effect = new ColorEffect( renderer, { source: channel4_source } )
var channel4_monitor = new Monitor( renderer, { source: channel4_effect, element: 'monitoring_canvas_4' })

var channel5_source = new VideoSource(renderer, { src: "" })
//var channel5_filemanager = new FileManager( channel5_source )
var channel5_effect = new ColorEffect( renderer, { source: channel5_source } )
var channel5_monitor = new Monitor( renderer, { source: channel5_effect, element: 'monitoring_canvas_5' })

var channel6_source = new VideoSource(renderer, { src: "" })
//var channel6_filemanager = new FileManager( channel6_source )
var channel6_effect = new ColorEffect( renderer, { source: channel6_source } )
var channel6_monitor = new Monitor( renderer, { source: channel6_effect, element: 'monitoring_canvas_6' })

var channel7_source = new VideoSource(renderer, { src: "" })
//var channel7_filemanager = new FileManager( channel7_source )
var channel7_effect = new ColorEffect( renderer, { source: channel7_source } )
var channel7_monitor = new Monitor( renderer, { source: channel7_effect, element: 'monitoring_canvas_7' })

var channel8_source = new VideoSource(renderer, { src: "" })
//var channel8_filemanager = new FileManager( channel8_source )
var channel8_effect = new ColorEffect( renderer, { source: channel8_source } )
var channel8_monitor = new Monitor( renderer, { source: channel8_effect, element: 'monitoring_canvas_8' })

var end_chain = new Chain( renderer, { sources: [
  channel1_effect, channel2_effect, channel3_effect, channel4_effect,
  channel5_effect, channel6_effect, channel7_effect, channel8_effect
] } );

var tap_bpm = new BPM(renderer);

// master effects
// var master_effect1 = new ColorEffect( renderer, { source: end_chain } )
// var master_effect2 = new ColorEffect( renderer, { source: master_effect1 } )

// mixer?
// var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

// preview out
// var monitor = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas' })

// final out
var output = new Output( renderer, end_chain )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

// disable looping
channel1_source.video.loop = false
channel2_source.video.loop = false
channel3_source.video.loop = false
channel4_source.video.loop = false
channel5_source.video.loop = false
channel6_source.video.loop = false
channel7_source.video.loop = false
channel8_source.video.loop = false

// c_effect.effect(14)
// contrast.effect(61)
// contrast.extra(0.4)

var bpm = tap_bpm.bpm
