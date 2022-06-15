
var renderer = new GlRenderer();
var source2 = new VideoSource(renderer, { src: "https://nabu.s3.eu-west-1.amazonaws.com/veejay/vunzige_deuntjes/aangeleverd/bonus+video+VD.mp4" });
var source1 = new VideoSource(renderer, { src: "https://nabu.s3.eu-west-1.amazonaws.com/veejay/vunzige_deuntjes/branded/paarroze_side.mp4" });
var key_effect = new ColorEffect( renderer, { source: source2 } )
var mixer1 = new Mixer( renderer, { source1: source1, source2: key_effect });
var output = new Output( renderer, mixer1 );
renderer.init();
renderer.render();
// #00ff01
key_effect.effect(80)
mixer1.pod(0)
