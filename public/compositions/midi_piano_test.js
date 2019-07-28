var renderer = new GlRenderer();

var source1 = new VideoSource( renderer, {});
var source2 = new VideoSource( renderer, {});
var source3 = new VideoSource( renderer, {});
var source4 = new VideoSource( renderer, {});
var source5 = new VideoSource( renderer, {});
var source6 = new VideoSource( renderer, {});
var source7 = new VideoSource( renderer, {});
var source8 = new VideoSource( renderer, {});

// var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
var sources = [ source1, source2, source3, source4, source5, source6, source7, source8 ]
var chain = new Chain( renderer,  { sources: sources} )

var output = new Output( renderer, chain );

// ---------------------------------------------------------------------------
// render bank of 15 (white) and ten (black) keys
// assign video to each
// spread the sources over 6-8 sources and select intellegntly
// add fading controls for effect, pref. on key down velocity

var mc = new MidiController( renderer, {} );
mc.debug = true

var keys = [ 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72 ]
var videos = [
	"https://assets.mixkit.co/videos/302/302-720.mp4", // C
	"https://assets.mixkit.co/videos/303/303-720.mp4", // C#
	"https://assets.mixkit.co/videos/334/334-720.mp4", // D
	"https://assets.mixkit.co/videos/337/337-720.mp4", // D#
	"https://assets.mixkit.co/videos/341/341-720.mp4", // E
	"https://assets.mixkit.co/videos/343/343-720.mp4", // F
	"https://assets.mixkit.co/videos/344/344-720.mp4", // F#
	"https://assets.mixkit.co/videos/348/348-720.mp4", // G
	"https://assets.mixkit.co/videos/350/350-720.mp4", // G#
	"https://assets.mixkit.co/videos/351/351-720.mp4", // A
	"https://assets.mixkit.co/videos/353/353-720.mp4", // A#
	"https://assets.mixkit.co/videos/424/424-720.mp4", // B
	"https://assets.mixkit.co/videos/425/425-720.mp4", // C
	"https://assets.mixkit.co/videos/427/427-720.mp4", // C#
	"https://assets.mixkit.co/videos/431/431-720.mp4", // D
	"https://assets.mixkit.co/videos/432/432-720.mp4", // D#
	"https://assets.mixkit.co/videos/442/442-720.mp4", // E
	"https://assets.mixkit.co/videos/448/448-720.mp4", // F
	"https://assets.mixkit.co/videos/449/449-720.mp4", // F#
	"https://assets.mixkit.co/videos/453/453-720.mp4", // G
	"https://assets.mixkit.co/videos/457/457-720.mp4", // G#
	"https://assets.mixkit.co/videos/463/463-720.mp4", // A
	"https://assets.mixkit.co/videos/467/467-720.mp4", // A#
	"https://assets.mixkit.co/videos/471/471-720.mp4", // B
	"https://assets.mixkit.co/videos/472/472-720.mp4"  // C
]

var videos = [

  //                                                    00 00       C  D  E  F  G  A
  //
	"https://assets.mixkit.co/videos/302/302-720.mp4", // 48 00 C     x
	"https://assets.mixkit.co/videos/303/303-720.mp4", // 49 01 C#
	"https://assets.mixkit.co/videos/334/334-720.mp4", // 50 02 D        x
	"https://assets.mixkit.co/videos/337/337-720.mp4", // 51 03 D#
	"https://assets.mixkit.co/videos/341/341-720.mp4", // 52 04 E     x     x
	"https://assets.mixkit.co/videos/343/343-720.mp4", // 53 05 F              x
	"https://assets.mixkit.co/videos/344/344-720.mp4", // 54 06 F#       x
	"https://assets.mixkit.co/videos/348/348-720.mp4", // 55 07 G     x           x
	"https://assets.mixkit.co/videos/350/350-720.mp4", // 56 08 G#          x
	"https://assets.mixkit.co/videos/351/351-720.mp4", // 57 09 A        x     x     x
	"https://assets.mixkit.co/videos/353/353-720.mp4", // 58 10 A#
	"https://assets.mixkit.co/videos/424/424-720.mp4", // 59 11 B           x     x

	"https://assets.mixkit.co/videos/425/425-720.mp4", // 60 12 C     x        x
	"https://assets.mixkit.co/videos/427/427-720.mp4", // 61 13 C#                   x
	"https://assets.mixkit.co/videos/431/431-720.mp4", // 62 14 D        x        x
	"https://assets.mixkit.co/videos/432/432-720.mp4", // 63 15 D#
	"https://assets.mixkit.co/videos/442/442-720.mp4", // 64 16 E     x     x        x
	"https://assets.mixkit.co/videos/448/448-720.mp4", // 65 17 F        x     x
	"https://assets.mixkit.co/videos/449/449-720.mp4", // 66 18 F#
	"https://assets.mixkit.co/videos/453/453-720.mp4", // 67 19 G     x
	"https://assets.mixkit.co/videos/457/457-720.mp4", // 68 20 G#          x
	"https://assets.mixkit.co/videos/463/463-720.mp4", // 69 21 A        x     x
	"https://assets.mixkit.co/videos/467/467-720.mp4", // 70 22 A#
	"https://assets.mixkit.co/videos/471/471-720.mp4", // 71 23 B           x

	"https://assets.mixkit.co/videos/472/472-720.mp4"  // 72 24 C              x
]

var videos = [
  "//nabu-dev.s3.amazonaws.com/uploads/video/53979650646576797eb60000/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/53e2c6466465761455390000/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/53e536fc6465764182340000/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/53e537366465764182370000/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/5519f9a66465764a1f8b0000/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/551ddc8d6465764a1f2c0100/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/557e1503646576789900000f/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/5588931d64657662a3000000/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/558b39266465760a3700001b/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/55a2d0356465765d93000000/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/5674a19d6465766873000014/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/574ca66a6465763793000000/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/574ca7aa646576379300000a/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/574caac56465763793000014/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/574cac12646576379300001e/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/57d9d3626465763c5a00004c/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/57d9d3756465763c5a00004f/480p_webM.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/57d9d3fa6465763c5a000062/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/57d9d5606465763c5a000070/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/57d9d76e6465763c5a000083/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/57d9dc4a6465763c5a000091/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/582ba4976465765faa000012/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/5a3462116465767c21000066/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/5a34690d6465767c21000075/720p_webm.webm",
  "//nabu-dev.s3.amazonaws.com/uploads/video/5a59660264657609d3000000/720p_h264.mp4",
  "//nabu-dev.s3.amazonaws.com/uploads/video/5a59671c64657609d3000009/720p_webm.webm",
]

/*
var videos = ["https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/babe.mp4", "https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/dancing girl indeo.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/dansen1_zw.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/disco2_hq.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/partyppl indeo.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/dancing girl 2 indeo_1.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/dancing indeo.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/disco1_hq.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/partypeople.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/sleepy_girl.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/handen_1_1.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne1_1_1.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne2_1_1.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne_silverscreen_shine_1_1.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/handen_2.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne1_2.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne2_2.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne_silverscreen_shine_2.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/handen_3.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne1_3.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne2_3.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne_silverscreen_shine_3.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/handen_glow_shine_1_1.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne1_shine_1_1.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne2_shine_1_1.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/sun_hands_1_1.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/handen_glow_shine_2.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne1_shine_2.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne2_shine_2.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/sun_hands_2.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/handen_glow_shine_3.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne1_shine_3.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/marianne2_shine_3.mp4","https://nabu.s3-eu-west-1.amazonaws.com/veejay/dance/marianne/sun_hands_3.mp4"]
*/



keys.forEach( function( _key ) {
  mc.addEventListener( _key, function(e) { pressedKey(e) } )
})

var fadeInValue = 0.025
var fadeIn = function() {
  if ( fadeInValue > 0.12 ) { fadeInValue = 1 }
  return fadeInValue
}

var fadeOutValue = 0.025
var fadeOut = function() {
  if ( fadeOutValue > 0.12 ) { fadeOutValue = 0.25 }
  return fadeOutValue
}
var mod = 1024

mc.addEventListener( 1, function(e) { fadeInValue  = ( e[2] / mod ) + 0.0001 } )
mc.addEventListener( 2, function(e) { fadeOutValue = ( e[2] / mod ) - 0.0001 } )


// moet per source geregeld worden!
/*
mc.addEventListener( 1, function(e) { fadeInValue  = ( e[2] / mod ) + 0.0001 } )
mc.addEventListener( 2, function(e) { fadeOutValue = ( e[2] / mod ) - 0.0001 } )

mc.addEventListener( 1, function(e) { fadeInValue  = ( e[2] / mod ) + 0.0001 } )
mc.addEventListener( 2, function(e) { fadeOutValue = ( e[2] / mod ) - 0.0001 } )

mc.addEventListener( 1, function(e) { fadeInValue  = ( e[2] / mod ) + 0.0001 } )
mc.addEventListener( 2, function(e) { fadeOutValue = ( e[2] / mod ) - 0.0001 } )
*/


sources.forEach( ( _source) => { _source.isDown = false } )
sources.forEach( ( _source) => { _source.isAvailable = true } )


function pressedKey(e) {
  console.log("pressed key: ", e )
  if (e[0] == 144) {
    // DOWN!
    console.log("start", videos[e[1]-48] )

    // find first availabe source lnk
    var first_available_source = null
    var first_available_source_chain_id = -1

    sources.forEach( ( _source, i ) => {
      if ( _source.currentSrc == videos[e[1]-48] ) {
        console.log("already assigned")
        first_available_source = _source
        first_available_source_chain_id = i
        return;
      }

      if ( _source.isAvailable && first_available_source == null) {
        first_available_source = _source
        first_available_source_chain_id = i
      }
    })

    console.log(" first availabe source is: ", first_available_source, first_available_source_chain_id )

    if ( first_available_source != null ) {
      if ( first_available_source.currentSrc == videos[e[1]-48] ) {
        first_available_source.jump()
      }else{
        first_available_source.src( videos[e[1]-48] )
        chain.setChainLink( first_available_source_chain_id, 0)
      }
      first_available_source.isDown = true
      first_available_source.isAvailable = false
    }else{
      console.warn("You ran our of sources")
    }

  } else if (e[0] == 128) {
    // UP!
    // source1.isDown = false
    // release last source?
    sources.forEach( ( _source, i ) => {
      if ( _source.currentSrc == videos[ e[1]-48] ) {
        _source.isDown = false
      }
    })
  }
}

function fader() {
  // each chainLink not < 0 fadeout
  if (renderer == undefined) return
  for(var i = 1; i < 9; i++ ) {
    var _alpha = chain.getChainLink(i-1, _alpha )

    if ( _alpha > 0 && !window['source' + i].isDown ) {
      var newalpha = Number(_alpha - fadeOut())
      chain.setChainLink(i-1, newalpha ) // adjustable
      //console.log('source' + 1, newalpha, fadeOut())

    } else if ( _alpha <= 1 && window['source' + i].isDown ) {

      var newalpha = Number(_alpha + fadeIn())
      chain.setChainLink(i-1, newalpha ) // adjustable
      console.log("add alpha", i-1, newalpha, fadeIn())

    } else if ( chain.getChainLink(i-1) <= 0 && !window['source' + i].isAvailable ) {
      window['source' + i].isAvailable = true
      chain.setChainLink(i-1, 0 )
    }
  }
}

function update() {
  fader()
  requestAnimationFrame(update)
}
requestAnimationFrame(update)

renderer.init();
renderer.render();
