

var renderer = new GlRenderer();
// var sourceA = new VideoSource(renderer, {src: "https://cdn.virtualmixproject.com/veejay/leung/The+Same+Space+cam+2+test_GRAY.mp4"});

// source is low ass trailer
var sourceA = new VideoSource(renderer, {src: "https://cdn.virtualmixproject.com/veejay/leung/TSS+Top+FINAL+FINAL+w_+audio.mp4"});
var sourceB = new VideoSource(renderer, {src: "https://cdn.virtualmixproject.com/veejay/leung/TSS+close+FINAL+FINAL_1.mp4"});
var sourceC = new VideoSource(renderer, {src: "https://cdn.virtualmixproject.com/veejay/leung/TSS+low+FINAL+FINAL.mp4"});

//var sourceA = new VideoSource(renderer, {src: "https://cdn.virtualmixproject.com/veejay/leung/TSS+Top+FINAL+FINAL+w_+audio.mp4"});
//var sourceB = new VideoSource(renderer, {src: "https://cdn.virtualmixproject.com/veejay/leung/TSS+close+FINAL+FINAL_1.mp4"});
//var sourceC = new VideoSource(renderer, {src: "https://cdn.virtualmixproject.com/veejay/leung/TSS+low+FINAL+FINAL.mp4"});

let chain = new Chain( renderer, { sources: [ sourceA, sourceB, sourceC ] } );
var output = new Output( renderer, chain );

renderer.camera.position.z = 24
renderer.init();
renderer.render();

var main_mixer = 0;
var update = null;
var audio = document.getElementById("main_music")
var range = document.getElementById("main_index")

// move to on page load, or renderer ready event ?
setTimeout( function() {
  sourceA.video.pause();
  sourceB.video.pause();
  sourceC.video.pause();

  document.getElementById("videoA").append(sourceA.video)
  document.getElementById("videoB").append(sourceB.video)
  document.getElementById("videoC").append(sourceC.video)
  sourceA.video.controls = false
  sourceB.video.controls = false
  sourceC.video.controls = false

  var vA = document.getElementById('videoA')
  vA.onclick = vA.ontouchstart = function() { //= vA.onmouseover
    // solo A
    vA.classList.add("selected");
    vB.classList.remove("selected");
    vC.classList.remove("selected");
    fadeChain(0);
  }

  var vB = document.getElementById('videoB')
  vB.onclick = vB.ontouchstart = function() { // = vB.onmouseover
    // solo B
    vA.classList.remove("selected");
    vB.classList.add("selected");
    vC.classList.remove("selected");
    fadeChain(1);
  }

  var vC = document.getElementById('videoC')
  vC.onclick = vC.ontouchstart = function() { //  = vC.onmouseover
    // solo C
    vA.classList.remove("selected");
    vB.classList.remove("selected");
    vC.classList.add("selected");
    fadeChain(2);
  }
}, 2 )


var old_win_x = window.innerWidth
var old_win_y = window.innerHeight
window.checkResize = function() {
  if ( old_win_x != window.innerWidth || old_win_y != window.innerHeight ) {
    console.log("resize!")
    old_win_x = window.innerWidth
    old_win_y = window.innerHeight
    setTimeout( function() { window.resize() }, 400)
    //window.location.reload()

  }

}

var update = function() {
  window.checkResize()
  window.requestAnimationFrame(update)

  if ( Math.abs( sourceA.video.currentTime - audio.currentTime ) > 0.5 ) {
    if ( !sourceA.video.seeking ) sourceA.video.currentTime = audio.currentTime; console.log("diff A non seeking")
    console.log("diff A")
  }

  if ( Math.abs( sourceB.video.currentTime - audio.currentTime ) > 0.5 ) {
    if ( !sourceB.video.seeking ) sourceB.video.currentTime = audio.currentTime; console.log("diff A non seeking")
    console.log("diff B")
  }

  if ( Math.abs( sourceC.video.currentTime - audio.currentTime ) > 0.5 ) {
    if ( !sourceC.video.seeking ) sourceC.video.currentTime = audio.currentTime; console.log("diff A non seeking")
    console.log("diff C")
  }

  audio.paused ? sourceA.video.pause() : sourceA.video.play()
  audio.paused ? sourceB.video.pause() : sourceB.video.play()
  audio.paused ? sourceC.video.pause() : sourceC.video.play()
  audio.paused ? document.getElementById('play_button').style.display = "block" : document.getElementById('play_button').style.display = "none"
}

// -------------------------------------------------------------------------- //
var mod = 0.04
var fadeInterval = null

function fadeChain( _num ) {
  var allset = 0
  clearInterval(fadeInterval)
  fadeInterval = setInterval( function() {
    var done = 0
    chain.sources.forEach(( source, i) => {
      if ( i == _num ) {
        // count up untill 1
        var alpha = chain.getChainLink(i)
        if (alpha < 1) {
          alpha += mod
        }else{
          alpha = 1
          done += 1
        }
      }else{
        // count down untill 0
        var alpha = chain.getChainLink(i)
        if (alpha > 0) {
          alpha -= mod
        }else{
          alpha = 0
          done += 1
        }
      }
      chain.setChainLink(i, alpha  )
    });

    if ( done == chain.sources.length ) {
      clearInterval( fadeInterval )
      console.log("fade done")
    } else {
      //console.log("trr... ", done)
    }

  }, 10 )
}

// -------------------------------------------------------------------------- //
var resize_elm = document.getElementById('main_screen')
var resize = function() {
  console.log("resize renderer")
  renderer.element = resize_elm
  renderer.width = renderer.element.offsetWidth
  renderer.height = renderer.element.offsetHeight
  renderer.resize()
}

// -------------------------------------------------------------------------- //

document.getElementById('main_screen').onclick = function() {
  audio.paused ? audio.play() : audio.pause()
}

// -------------------------------------------------------------------------- //

document.getElementById('play_button').onclick = function() {
  setTimeout( function() { audio.play(); }, 100 )
}

// -------------------------------------------------------------------------- //
// Modal

document.getElementById('credits').onclick = function() {
  document.getElementById('credits_modal').classList.add("opened")
  document.getElementById('modal_background').classList.add("opened")
}

document.getElementById('credits_modal').onclick = function() {
  document.getElementById('credits_modal').classList.remove("opened")
  document.getElementById('modal_background').classList.remove("opened")
}

// ---------------------------------------------------------------------------//
// Quality
document.getElementById('sd_button').onclick = function() {
  setQuality("SD")
  document.getElementById('sd_button').classList.add('selected')
  document.getElementById('hd_button').classList.remove('selected')
}

document.getElementById('hd_button').onclick = function() {
  setQuality("HD")
  document.getElementById('sd_button').classList.remove('selected')
  document.getElementById('hd_button').classList.add('selected')
}

// source is low ass trailer
var setQuality = function(_quality) {
  if (_quality == "HD")  {
    sourceA.src('https://cdn.virtualmixproject.com/veejay/leung/TSS+Top+FINAL+FINAL+w_+audio.mov')
    sourceB.src('https://cdn.virtualmixproject.com/veejay/leung/TSS+close+FINAL+FINAL.mov')
    sourceC.src('https://cdn.virtualmixproject.com/veejay/leung/TSS+low+FINAL+FINAL.mov')
  }else{
    sourceA.src('https://cdn.virtualmixproject.com/veejay/leung/TSS+Top+FINAL+FINAL+w_+audio.mp4')
    sourceB.src('https://cdn.virtualmixproject.com/veejay/leung/TSS+close+FINAL+FINAL_1.mp4')
    sourceC.src('https://cdn.virtualmixproject.com/veejay/leung/TSS+low+FINAL+FINAL.mp4')
  }
}

// -------------------------------------------------------------------------- //
// MAIN

// init
window.addEventListener('resize', resize)
window.resize()
//renderer.resize = function() {}
chain.setChainLink(0, 1)
chain.setChainLink(1, 0)
chain.setChainLink(2, 0)

//start
update()
