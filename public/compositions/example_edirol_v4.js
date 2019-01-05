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

// lumakey
var luma_effect1 = new ColorEffect(renderer, { source: nega_effect1 } );
var luma_effect2 = new ColorEffect(renderer, { source: nega_effect2 } );

// colorize
var colorize_effect1 = new ColorEffect(renderer, { source: luma_effect1 } );
var colorize_effect2 = new ColorEffect(renderer, { source: luma_effect2 } );


// main mixer
var main_mixer = new Mixer( renderer, {source1: colorize_effect1, source2: colorize_effect2 } );

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

// Set up the mixer
chain1.setAll(0)
chain1.setChainLink(0, 1)
chain2.setAll(0)
chain2.setChainLink(1, 1)
trans_mixer1.pod(1)
trans_mixer2.pod(1)
main_mixer.pod(0.5)
// blackout_mixer.pod(0)

// Some helper vars
var original_mixmode = 1

// -----------------------------------------------------------------------------
  // LEFT EFFECTS

document.getElementById('btn_effects_a_1').onmousedown = function() {
  //main_mixer.mixMode(1) // NORMAL
  var cycle = [ 5, 6 , 7, 8, 9, 10, 11, 12 ];
  if ( color_effect1.effect() != 1 ) {
    color_effect1.effect(1)
    this.classList = 'mix_control round '
  }else{
    color_effect1.effect(5)
    this.classList = 'mix_control round greenish active';
  }
}

document.getElementById('btn_effects_a_2').onmousedown = function() {
  //main_mixer.mixMode(1) // NORMAL
  var cycle = [ 2, 3, 4 ]
  if ( nega_effect1.effect() != 1 ) {
    nega_effect1.effect(1)
    this.classList = 'mix_control round '
  }else{
    nega_effect1.effect(2)
    this.classList = 'mix_control round greenish active'
  }
}

document.getElementById('btn_effects_a_3').onmousedown = function() {
  //main_mixer.mixMode(1) // NORMAL  //main_mixer.mixMode(1) // NORMAL
  if ( luma_effect1.effect() != 1 ) {
    luma_effect1.effect(1)
    main_mixer.mixMode( original_mixmode );
    this.classList = 'mix_control round '
  }else{
    original_mixmode = main_mixer.mixMode()
    luma_effect1.effect(39);
    main_mixer.mixMode(10);
    this.classList = 'mix_control round greenish active'
  }
}

document.getElementById('btn_effects_a_4').onmousedown = function() {
  //main_mixer.mixMode(1) // NORMAL
  if ( colorize_effect1.effect() != 1 ) {
    colorize_effect1.effect(1)
    this.classList = 'mix_control round '
  }else{
    colorize_effect1.effect(41);
    this.classList = 'mix_control round greenish active'
  }
}

document.getElementById('effects_a_control').onmousedown = function() {
}


// -----------------------------------------------------------------------------
  // MIX EN BEAT CONTROL

// Add interaction
document.getElementById('bpm_control_mix').onmousedown = function() {
  main_mixer.mixMode(1) // NORMAL
  original_mixmode = 1
  document.querySelectorAll('.mix_control').forEach(function(elm) { elm.classList = elm.classList.toString().replace("active", "")})
  main_mixer.mixMode() == 1 ? this.classList = 'mix_control round greenish active' : this.classList = 'mix_control round greenish';
}

document.getElementById('bpm_control_wipe').onmousedown = function() {
  main_mixer.mixMode(2) // HARD
  original_mixmode = 2
  document.querySelectorAll('.mix_control').forEach(function(elm) { elm.classList = elm.classList.toString().replace("active", "")})
  main_mixer.mixMode() == 2 ? this.classList = 'mix_control round greenish active' : this.classList = 'mix_control round greenish';
}

document.getElementById('bpm_control_efx').onmousedown = function() {
  main_mixer.mixMode(3) // NON DARK
  original_mixmode = 3
  document.querySelectorAll('.mix_control').forEach(function(elm) { console.log( elm.classList ); elm.classList = elm.classList.toString().replace("active", "")})
  main_mixer.mixMode() == 3 ? this.classList = 'mix_control round greenish active' : this.classList = 'mix_control round greenish';
}

document.getElementById('bpm_control_bpm_sync').onmousedown = function() {
  main_mixer.autoFade = !main_mixer.autoFade;
  main_mixer.autoFade ? this.classList = 'round redish active' : this.classList = 'round redish';
}

// -----------------------------------------------------------------------------
  // BPM TAP EN SLIDER

document.getElementById('bpm_tab').onmousedown = function() {
  bpm_tap.tap()
  main_mixer.bpm(bpm_tap.bpm)
  document.getElementById('bpm_display').textContent = Math.round(bpm_tap.bpm)
}

var changeInterval_bpm_slide = null
document.getElementById('bpm_slide').onmousedown = function() {
  clearInterval(changeInterval_bpm_slide)
  changeInterval_bpm_slide = setInterval( function() {
    main_mixer.bpm(document.getElementById('bpm_slide').value)
    document.getElementById('bpm_display').textContent = Math.round(main_mixer.bpm())
  }, 50 )
}
document.getElementById('bpm_slide').onmouseup = function() { clearInterval(changeInterval_bpm_slide) }
document.body.onmouseup = function() { clearInterval(changeInterval_bpm_slide) }

// -----------------------------------------------------------------------------
  // MAIN POD

var changeInterval_main_pod = null
document.getElementById('main_pod').onmousedown = function() {
  clearInterval(changeInterval_main_pod)
  changeInterval_main_pod = setInterval( function() {
    main_mixer.pod(1-document.getElementById('main_pod').value)
  }, 50 )
}
document.getElementById('main_pod').onmouseup = function() { clearInterval(changeInterval_main_pod) }
document.body.onmouseup = function() { clearInterval(changeInterval_main_pod) }

// -----------------------------------------------------------------------------
  // LEFT SOURCE SWITCHES

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

// -----------------------------------------------------------------------------
  // RIGHT SOURCE SWITCHES

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

// -----------------------------------------------------------------------------
  // TRANSFORMERS

document.getElementById('btn_transform_a').onmousedown = function() { trans_mixer1.pod(0) }
document.getElementById('btn_transform_a').onmouseup = function() { trans_mixer1.pod(1) }
document.getElementById('btn_transform_b').onmousedown = function() { trans_mixer2.pod(0)  }
document.getElementById('btn_transform_b').onmouseup = function() { trans_mixer2.pod(1) }

// -----------------------------------------------------------------------------
  // TESTS

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
