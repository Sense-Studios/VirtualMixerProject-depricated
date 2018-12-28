/*
* Example V4
*
* Elaborate mixer that uses several control interfaces
* and chains, to emulate an Edirol v4, More or less.
*
*/

// renderer
var renderer = new GlRenderer()

// sources
var source1 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );
var source2 = new VideoSource( renderer, { src: '/video/1UP_Graffiti_olympic.mp4' } );
var source3 = new VideoSource( renderer, { src: '/video/alaro_carnage_the_underground_gif_remix.mp4' } );
var source4 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );

// distortion effects work on sources directly
// var distortion_effect1 = new DistortionEffect(renderer, { source: source1 } )
// var distortion_effect2 = new DistortionEffect(renderer, { source: source2 } )
// var distortion_effect3 = new DistortionEffect(renderer, { source: source3 } )
// var distortion_effect4 = new DistortionEffect(renderer, { source: source4 } )

// source switch
// var chain1 = new Chain( renderer, { sources: [ distortion_effect1, distortion_effect2, distortion_effect3, distortion_effect4 ] } );
// var chain2 = new Chain( renderer, { sources: [ distortion_effect1, distortion_effect2, distortion_effect3, distortion_effect4 ] } );

var chain1 = new Chain( renderer, { sources: [ source1, source2, source3, source4 ] } );
var chain2 = new Chain( renderer, { sources: [ source1, source2, source3, source4 ] } );

// mono color effects
var color_effect1 = new ColorEffect(renderer, { source: chain1 } );
var color_effect2 = new ColorEffect(renderer, { source: chain2 } );

// negatief
var nega_effect1 = new ColorEffect(renderer, { source: color_effect1 } );
var nega_effect2 = new ColorEffect(renderer, { source: color_effect2 } );

// main mixer
var main_mixer = new Mixer( renderer, {source1: nega_effect1, source2: nega_effect2 } );

// transformers
// mix transformer signals (white and black)
var trans_white = new SolidSource( renderer, { color: { r:1.0, g:1.0, b:1.0 } } );
var trans_black = new SolidSource( renderer, { color: { r:0.0, g:0.0, b:0.0 } } );
var trans_mixer1 = new Mixer( renderer, { source1: main_mixer, source2: chain1 }  )
var trans_mixer2 = new Mixer( renderer, { source1: trans_mixer1, source2: chain2 }  )

// mix transformers chain1 and 2
var trans_mixer1 = new Mixer( renderer, { source1: main_mixer, source2: chain1 }  )
var trans_mixer2 = new Mixer( renderer, { source1: trans_mixer1, source2: chain2 }  )

// blackout
// var blackout = new SolidSource( renderer, { r:0.0, g:0.0, b:0.0 } );
// var blackout_mixer = new Mixer( renderer, { source1: trans_mixer2, source2: blackout })

var bpm_tap = new BPM( renderer )

// wire the last one to the output
var output = new Output( renderer, trans_mixer2 )

// start to render
renderer.init();
renderer.render();

// -----------------------------------------------------------------------------

// (re) set the mixer
chain1.setAll(0)
chain1.setChainLink(0, 1)
chain2.setAll(0)
chain2.setChainLink(1, 1)
trans_mixer1.pod(1)
trans_mixer2.pod(1)
// blackout_mixer.pod(1)
main_mixer.pod(0)

// -----------------------------------------------------------------------------

// Add interaction

var changeInterval = null
document.getElementById('main_pod').onmousedown = function() {
  clearInterval(changeInterval)
  changeInterval = setInterval( function() {
    main_mixer.pod(1-document.getElementById('main_pod').value)
  }, 50 )
}

document.getElementById('main_pod').onmouseup = function() { clearInterval(changeInterval) }
document.body.onmouseup = function() { clearInterval(changeInterval) }

document.getElementById('btn_switch_a_1').onclick = function() {
  chain1.setAll(0)
  chain1.setChainLink(0, 1)
  document.querySelectorAll('.switch_a')[0].childNodes.forEach(function(elm) { elm.classList = ""})
  this.classList = 'active'
}

document.getElementById('btn_switch_a_2').onclick = function() {
  chain1.setAll(0)
  chain1.setChainLink(1, 1)
  document.querySelectorAll('.switch_a')[0].childNodes.forEach(function(elm) { elm.classList = ""})
  this.classList = 'active'
}

document.getElementById('btn_switch_a_3').onclick = function() {
  chain1.setAll(0)
  chain1.setChainLink(2, 1)
  document.querySelectorAll('.switch_a')[0].childNodes.forEach(function(elm) { elm.classList = ""})
  this.classList = 'active'
}

document.getElementById('btn_switch_a_4').onclick = function() {
  chain1.setAll(0)
  chain1.setChainLink(3, 1)
  document.querySelectorAll('.switch_a')[0].childNodes.forEach(function(elm) { elm.classList = ""})
  this.classList = 'active'
}

document.getElementById('btn_switch_b_1').onclick = function() {
  chain2.setAll(0)
  chain2.setChainLink(0, 1)
  document.querySelectorAll('.switch_b')[0].childNodes.forEach(function(elm) { elm.classList = ""})
  this.classList = 'active'
}

document.getElementById('btn_switch_b_2').onclick = function() {
  chain2.setAll(0)
  chain2.setChainLink(1, 1)
  document.querySelectorAll('.switch_b')[0].childNodes.forEach(function(elm) { elm.classList = ""})
  this.classList = 'active'
}

document.getElementById('btn_switch_b_3').onclick = function() {
  chain2.setAll(0)
  chain2.setChainLink(2, 1)
  document.querySelectorAll('.switch_b')[0].childNodes.forEach(function(elm) { elm.classList = ""})
  this.classList = 'active'
}

document.getElementById('btn_switch_b_4').onclick = function() {
  chain2.setAll(0)
  chain2.setChainLink(3, 1)
  document.querySelectorAll('.switch_b')[0].childNodes.forEach(function(elm) { elm.classList = ""})
  this.classList = 'active'
}

/*
document.getElementById('btn_effects_a_1').onclick = function() {
  console.log("oi")
  color_effect1.effect(1)
}

document.getElementById('btn_effects_a_2').onclick = function() {
  console.log("oi")
}

document.getElementById('btn_effects_a_3').onclick = function() {
  console.log("oi")
}

document.getElementById('btn_effects_a_4').onclick = function() {
  console.log("oi")
}
*/
document.getElementById('btn_transform_a').onmousedown = function() { trans_mixer1.pod(0) }
document.getElementById('btn_transform_a').onmouseup = function() { trans_mixer1.pod(1) }
document.getElementById('btn_transform_b').onmousedown = function() { trans_mixer2.pod(0)  }
document.getElementById('btn_transform_b').onmouseup = function() { trans_mixer2.pod(1) }
