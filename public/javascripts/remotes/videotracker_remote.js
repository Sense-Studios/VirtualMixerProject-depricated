var myfunction = function() {
  alert("hello there")
}


// create the main renderer
var renderer = new GlRenderer({element: 'glcanvas'});

// sources
var source1 = new VideoSource(renderer, { src: "/video/placeholder.mp4" })
var source2 = new VideoSource(renderer, { src: "/video/16MMDUSTproc.mp4" })

// mixer
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

// preview out
var monitor = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas' })

var monitor1 = new Monitor( renderer, { source: source1, element: 'monitoring_canvas_1' })
var monitor2 = new Monitor( renderer, { source: source2, element: 'monitoring_canvas_2' })
var monitor3 = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas_3' })



// add some effects
var contrast = new ColorEffect( renderer, { source: mixer1 } )
var c_effect = new ColorEffect( renderer, { source: contrast } )

var monitor4 = new Monitor( renderer, { source: contrast, element: 'monitoring_canvas_4' })
var monitor5 = new Monitor( renderer, { source: source1, element: 'monitoring_canvas_5' })

var monitor6 = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas_6' })
var monitor7 = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas_7' })
var monitor8 = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas_8' })
var monitor9 = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas_9' })
var monitor10 = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas_10' })

// final out
var output = new Output( renderer, c_effect )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

c_effect.effect(14)
contrast.effect(61)
contrast.extra(0.4)
