/*
* Example V4
*
* Elaborate mixer that uses several control interfaces
* and chains, to emulate an Edirol v4, More or less.
*
*/

var forceFullscreen = function() {
  console.log("FULLSCREEN")
  document.body.webkitRequestFullScreen()

  //document.getElementById('mixer').removeEventListener('click', forceFullscreen);
  //document.getElementById('mixer').removeEventListener('touchstart', forceFullscreen)
}

document.getElementById('mixer').addEventListener('click', forceFullscreen)
document.getElementById('mixer').addEventListener('touchstart', forceFullscreen)

// renderer
var renderer = new GlRenderer()


  // lets not forget the bpm
  var bpm_tap = new BPM( renderer )

  // initial sources ( for now only four sources are connected)
  var source1 = new VideoSource( renderer, { src: '/video/placeholder_lg.mp4' } );
  var source2 = new VideoSource( renderer, { src: '//nabu.s3-eu-west-1.amazonaws.com/veejay/mixkit/182-720.mp4' } );
  var source3 = new VideoSource( renderer, { src: '/video/ignore/alaro_carnage_the_underground_gif_remix.mp4' } );
  var source4 = new VideoSource( renderer, { src: '//s3-eu-west-1.amazonaws.com/nabu/veejay/ziek/ZIEK_roaches_and_ants.mp4' } );

  // distortion effects work on sources directly
  var distortion_effect1 = new DistortionEffect(renderer, { source: source1 } )
  var distortion_effect2 = new DistortionEffect(renderer, { source: source2 } )
  var distortion_effect3 = new DistortionEffect(renderer, { source: source3 } )
  var distortion_effect4 = new DistortionEffect(renderer, { source: source4 } )

  // source switch
  var chain1 = new Chain( renderer, { sources: [ source1, source2, source3, source4 ] } );
  var chain2 = new Chain( renderer, { sources: [ distortion_effect1, distortion_effect2, distortion_effect3, distortion_effect4 ] } );

  // effects left
  var color_effect1 = new ColorEffect(renderer, { source: chain1 } );        // mono color effects
  var paint_effect2 = new ColorEffect(renderer, { source: chain2 } );        // paint
  var nega_effect1 = new ColorEffect(renderer, { source: color_effect1 } );  // negatief
  var multi_effect2 = new ColorEffect(renderer, { source: paint_effect2 } ); // multi ==> DISTORT!, works on source directly

  // effects right
  var luma_effect1 = new ColorEffect(renderer, { source: nega_effect1 } );         // Whitekey
  var color_effect2 = new ColorEffect(renderer, { source: multi_effect2 } );       // c-key
  var colorize_effect1 = new ColorEffect(renderer, { source: luma_effect1 } );     // Blackkey
  var feedback_effect2 = new FeedbackEffect(renderer, { source: color_effect2 } ); // feedback

  // main mixer
  var main_mixer = new Mixer( renderer, {source1: colorize_effect1, source2: feedback_effect2 } );

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

  // wire the last one to the output
  var output = new Output( renderer, trans_mixer2 )

  // start to render
  renderer.init();
  renderer.render();

  // we're done here
  document.getElementById('loader').remove()

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

  // ---------------------------------------------------------------------------
    // LEFT EFFECTS, EFFECTS A
  // ---------------------------------------------------------------------------

  // Monocolor
  document.getElementById('btn_effects_a_1').onmousedown = function() {
    if ( color_effect1.effect() != 1 ) {
      color_effect1.effect(1)
      this.classList = 'effect_a round'
    }else{
      //var calc = Math.round( document.getElementById('effects_a_control').value * 7 ) + 10
      color_effect1.effect(5) // [ 10,11,12,13,14,15,16,17 ]
      color_effect1.extra( Number(document.getElementById('effects_a_control').value) )
      this.classList = 'effect_a round greenish active blinking';
      clearBlinking( document.getElementById('btn_effects_a_1') )
    }
  }

  // Negative
  document.getElementById('btn_effects_a_2').onmousedown = function() {
    if ( nega_effect1.effect() != 1 ) {
      nega_effect1.effect(1)
      this.classList = 'effect_a round'
    }else{
      nega_effect1.effect(2)
      color_effect1.extra( Number(document.getElementById('effects_a_control').value) )
      this.classList = 'effect_a round greenish active blinking'
      clearBlinking( document.getElementById('btn_effects_a_2') )
    }
  }

  // Black-Key
  document.getElementById('btn_effects_a_3').onmousedown = function() {
    if ( luma_effect1.effect() != 1 ) {
      luma_effect1.effect(1)
      this.classList = 'effect_a round'
    }else{
      //original_mixmode = main_mixer.mixMode()
      luma_effect1.effect(50);
      color_effect1.extra( Number(document.getElementById('effects_a_control').value) )
      document.getElementById('effects_a_control').value = 0.5
      this.classList = 'effect_a round greenish active blinking'
      clearBlinking( document.getElementById('btn_effects_a_3') )
    }
  }

  // Colorize
  document.getElementById('btn_effects_a_4').onmousedown = function() {
    if ( colorize_effect1.effect() != 1 ) {
      colorize_effect1.effect(1)
      this.classList = 'effect_a round'
    }else{
      colorize_effect1.effect(53);
      this.classList = 'effect_a round greenish active'
    }
  }

  // ---------------------------------------------------------------------------
  // effects slider
  document.getElementById('effects_a_control').onmousedown = function() {
  }

  // does this work on mobile?
  document.getElementById('effects_a_control').oninput = function() {
    //console.log("effects_a_control >>", this.value)

    if ( document.getElementById('btn_effects_a_1').classList.contains('blinking') ) { // add "blinking?"
      var calc = Math.round( this.value * 7 ) + 10
      console.log("effects_a_control 1 >>", calc)
      color_effect1.effect( calc ) // [ 5, 6, 7, 8, 9, 10, 11, 12 ]
      //var cycle = [ 10, 11, 12, 13, 14, 15, 16, 17 ];
    }else{
      color_effect1.effect(1)
    }

    if ( document.getElementById('btn_effects_a_2').classList.contains('blinking') ) { // add "blinking?"
      var calc = Math.round( this.value * 4 ) + 2
      // var cycle = [ (1), 2, 3, 4, 5, 6 ]
      console.log("effects_a_control 2 >>", calc)
      nega_effect1.effect( calc ) // [2, 3, 4]
    }else{
      nega_effect1.effect(1)
    }

    if ( document.getElementById('btn_effects_a_3').classList.contains('blinking') ) { // add "blinking?"
      console.log("effects_a_control 3 >>", this.value)
      luma_effect1.extra( this.value )
    }else{
      //nega_effect1.extra(1)
    }
  }

  function clearBlinking( _exept_elm ) {
    document.querySelectorAll('.effect_a').forEach( function( _val ) {
      if ( _val != _exept_elm) {
        console.log("clear!", _val)
        if ( _val.classList.contains('active') ) _val.classList = "effect_a round greenish active"
        if ( !_val.classList.contains('active') ) _val.classList = "effect_a round"
      }
    })
  }

  // ---------------------------------------------------------------------------
    // RIGHT EFFECTS, EFFECTS B
  // ---------------------------------------------------------------------------

  // Paint
  document.getElementById('btn_effects_b_1').onmousedown = function() {
    //main_mixer.mixMode(1) // NORMAL
    if ( paint_effect2.effect() != 1 ) {
      paint_effect2.effect(1)
      this.classList = 'effect_b round '
    }else{
      paint_effect2.effect(52);
      //feedback_effect2.effect(41);
      this.classList = 'effect_b round greenish active'
    }
  }

  // Multi
  document.getElementById('btn_effects_b_2').onmousedown = function() {
    // multi
    if ( distortion_effect1.effect() == 3 || distortion_effect1.effect() == 4 ) {
      distortion_effect1.effect(1)
      distortion_effect2.effect(1)
      distortion_effect3.effect(1)
      distortion_effect4.effect(1)
      document.getElementById('btn_effects_b_3').classList = 'effect_b round '
      this.classList = 'effect_b round '
    }else{
      distortion_effect1.effect(3)
      distortion_effect2.effect(3)
      distortion_effect3.effect(3)
      distortion_effect4.effect(3)
      this.classList = 'effect_b round greenish active'
    }
  }

  // PiP
  document.getElementById('btn_effects_b_3').onmousedown = function() {
    // pip
    if ( distortion_effect1.effect() == 3 || distortion_effect1.effect() == 4 ) {
      distortion_effect1.effect(1)
      distortion_effect2.effect(1)
      distortion_effect3.effect(1)
      distortion_effect4.effect(1)
      document.getElementById('btn_effects_b_2').classList = 'effect_b round '
      this.classList = 'effect_b round '
    }else{
      distortion_effect1.effect(4)
      distortion_effect2.effect(4)
      distortion_effect3.effect(4)
      distortion_effect4.effect(4)
      this.classList = 'effect_b round greenish active'
    }
  }

  // Feedback
  document.getElementById('btn_effects_b_4').onmousedown = function() {
    // feedback
    if ( feedback_effect2.effect() != 1 ) {
      feedback_effect2.effect(1)
      this.classList = 'effect_b round '
    }else{
      feedback_effect2.effect(100)
      //feedback_effect2.effect(41);
      this.classList = 'effect_b round greenish active'
    }
  }

  // ---------------------------------------------------------------------------
  // effects slider
  document.getElementById('effects_b_control').onmousedown = function() {
  }

  document.getElementById('effects_b_control').oninput = function() {
    console.log("effects_b_control >>", parseFloat(this.value) )
    //

    if ( document.getElementById('btn_effects_b_1').classList.contains('active') ) { // add "blinking?"
      //var calc = Math.ceil( this.value * 7 ) + 5
      //console.log("color effect 1 >>", calc)
      //color_effect1.effect( calc ) // [ 5, 6, 7, 8, 9, 10, 11, 12 ]
    }else{
      //color_effect1.effect(1)
    }

    if ( document.getElementById('btn_effects_b_2').classList.contains('active') ) { // add "blinking?"
      //var calc = Math.ceil( this.value * 3 ) + 1
      //console.log("effects_a_control 2 >>", calc)
      //nega_effect1.effect( calc ) // [2, 3, 4]
      distortion_effect1.extra(this.value)
      distortion_effect2.extra(this.value)
      distortion_effect3.extra(this.value)
      distortion_effect4.extra(this.value)
    }else{
      //nega_effect1.effect(1)
    }

    if ( document.getElementById('btn_effects_b_3').classList.contains('active') ) { // add "blinking?"
      //luma_effect1.extra( this.value )
      // [1,2,3,4] // positions
      //distortion_effect1.extra(this.value)
      //distortion_effect2.extra(this.value)
      //distortion_effect3.extra(this.value)
      //distortion_effect4.extra(this.value)
    }else{
      //nega_effect1.extra(1)
    }

    if ( document.getElementById('btn_effects_b_4').classList.contains('active') ) { // add "blinking?"
      // DEPR luma_effect1.extra( this.value )
      feedback_effect2.extra(  parseFloat(this.value) )
    }else{
      // DEPR nega_effect1.extra(1)
      // feedback_effect2.extra(  parseFloat(this.value) )
    }

  }



  // ---------------------------------------------------------------------------
    // MIX EN BEAT CONTROL
  // ---------------------------------------------------------------------------

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

  document.getElementById('bpm_slide').oninput = function() {
    main_mixer.bpm(document.getElementById('bpm_slide').value)
    document.getElementById('bpm_display').textContent = Math.round(document.getElementById('bpm_slide').value)
  }

  // -----------------------------------------------------------------------------
    // MAIN POD

  document.getElementById('main_pod').oninput = function() {
    main_mixer.pod(1-document.getElementById('main_pod').value)
  }

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

//}, 200 )
