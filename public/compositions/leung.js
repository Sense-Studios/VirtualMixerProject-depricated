var renderer = new GlRenderer();

var main_src = "https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/Ballet+dancers+in+the+quiet+streets+of+Amsterdam+(Gently+Quiet%2C+Peter+Leung)+-+Dutch+National+Ballet.mp4"
/*
var sourceA = new VideoSource(renderer, {src: "https://nabu.s3-eu-west-1.amazonaws.com/veejay/abstract/tunnel_kaleido_indeo.mp4"});
var sourceB = new VideoSource(renderer, {src: "https://nabu.s3-eu-west-1.amazonaws.com/veejay/abstract/licht_PM5_45.mp4"});
var sourceC = new VideoSource(renderer, {src: "https://nabu.s3-eu-west-1.amazonaws.com/veejay/abstract/space_yellow_PM_56.mp4"});
*/

var sourceA = new VideoSource(renderer, {src: main_src});
var sourceB = new VideoSource(renderer, {src: main_src});
var sourceC = new VideoSource(renderer, {src: main_src});

var mixer_alpha = new Mixer( renderer, { source1: sourceA, source2: sourceB });
var mixer_beta = new Mixer( renderer, { source1: mixer_alpha, source2: sourceC });
var output = new Output( renderer, mixer_beta );
renderer.init();
renderer.render();

var main_mixer = 0;
var update = null;
var audio = document.getElementById("main_music")

// move to on page load, or renderer ready event ?
setTimeout( function() {
  sourceA.jump();
  sourceB.jump();
  sourceC.jump();

  document.getElementById("videoA").append(sourceA.video)
  document.getElementById("videoB").append(sourceB.video)
  document.getElementById("videoC").append(sourceC.video)
  sourceA.video.controls = true
  sourceB.video.controls = true
  sourceC.video.controls = true

  //sourceA.video.paused

  var range = document.getElementById("main_index")

  document.getElementById("startA").onclick = function() {
    sourceA.video.currentTime = 0
  }
  document.getElementById("playA").onclick = function() {
    sourceA.video.paused ? sourceA.video.play() : sourceA.video.pause()
  }
  document.getElementById("jumpA").onclick = function() {
    sourceA.jump()
  }
  document.getElementById("soloA").onclick = function() {
    range.value = 0
    mixer_alpha.pod(1)
    mixer_beta.pod(1)
  }

  document.getElementById("startB").onclick = function() {
    sourceB.video.currentTime = 0
  }
  document.getElementById("playB").onclick = function() {
    sourceB.video.paused ? sourceB.video.play() : sourceB.video.pause()
  }
  document.getElementById("jumpB").onclick = function() {
    sourceB.jump()
  }
  document.getElementById("soloB").onclick = function() {
    range.value = 0.5
    mixer_alpha.pod(0)
    mixer_beta.pod(1)
  }

  document.getElementById("startC").onclick = function() {
    sourceC.video.currentTime = 0
  }
  document.getElementById("playC").onclick = function() {
    sourceC.video.paused ? sourceC.video.play() : sourceC.video.pause()
  }
  document.getElementById("jumpC").onclick = function() {
    sourceC.jump()
  }
  document.getElementById("soloC").onclick = function() {
    range.value = 1
    mixer_alpha.pod(0)
    mixer_beta.pod(0)
  }

  // -- //

  document.getElementById("start_all").onclick = function() {
    sourceA.video.currentTime = 0
    sourceB.video.currentTime = 0
    sourceC.video.currentTime = 0
    audio.currentTime = 0
    audio.play()
  }

  document.getElementById("play_all").onclick = function() {
    sourceA.video.paused ? sourceA.video.play() : sourceA.video.pause()
    sourceB.video.paused ? sourceB.video.play() : sourceB.video.pause()
    sourceC.video.paused ? sourceC.video.play() : sourceC.video.pause()
    audio.paused ? audio.play() : audio.pause()
  }

  document.getElementById("jump_all").onclick = function() {
    sourceA.jump()
    sourceB.jump()
    sourceC.jump()
  }

  document.getElementById("audio_start").onclick = function() {
    audio.currentTime = 0
    audio.play()
  }

  document.getElementById("audio_play").onclick = function() {
    audio.paused ? audio.play() : audio.pause()
  }

  // ------------------------------------------------------------------------ //

  renderer.camera.position.z= 45

  range.value = 0.5
  mixer_alpha.pod(0)
  mixer_beta.pod(1)

}, 1000 )

var update = function() {
  window.requestAnimationFrame(update)

  var slider = document.getElementById("main_index")
  if ( slider.value < 0.5 ) {
    var mix_a = ( ( slider.value ) ) * 2
    //console.log("mix_alpha:", mix_a, mixer_alpha.pod(), mixer_beta.pod() )
    mixer_alpha.pod( 1- mix_a  )
  }

  if ( slider.value > 0.5 ) {
    var mix_b = ( ( slider.value - 0.5 ) ) * 2
    //console.log("mix_beta:", mix_b, mixer_alpha.pod(), mixer_beta.pod() )
    mixer_beta.pod( 1- mix_b )
  }
}

window.requestAnimationFrame(update)
