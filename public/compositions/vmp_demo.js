var renderer = new GlRenderer()



// sources
var source0 = new SolidSource( renderer, {r:0.2, g:0.4, b:0.9})
var source1 = new VideoSource( renderer, { src: 'https://s3-eu-west-1.amazonaws.com/nabu/veejay/clutter/FC240_1.mp4?r=9843759843yjkdsfh' } );
var source2 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );
var source3 = new VideoSource( renderer, { src: '/video/alaro_carnage_the_underground_gif_remix.mp4' } );
var source4 = new VideoSource( renderer, { src: '/video/placeholder.mp4' } );

var premixer = new Mixer(renderer, { source1: source0, source2: source1 } )
var trans_mixer1 = new Mixer( renderer, { source1: premixer, source2: source2 }  )
var output = new Output( renderer, trans_mixer1 )

// start to render
renderer.init();
renderer.render();

// set up file management
var filemanager1 = new FileManager( source2 )
//filemanager1.load_set("/sets/notv.json")

// configure the mixer
trans_mixer1.mixMode = 6
trans_mixer1.bpm(28)
trans_mixer1.autoFade = true

//setInterval(function() {
//  var d = Math.random()
//  if (d < 0.02) { source1.jump(); console.log('source 1 jump') }
//  if (d > 0.02 && d < 0.04) { source2.jump(); console.log('source 2 jump') }
//},200)

document.querySelectorAll('.grid_item').forEach( function(_elm, i) {
  // code to be executed

  _elm.index = i
  _elm.onclick = function(_evt) {
    console.log("clcik, +evt")
    if (this.classList.contains('active')) {
      this.classList = this.classList.toString().replace("active", "")
    }else{
      document.querySelectorAll('.grid_item').forEach( function(el) { el.classList = el.classList.toString().replace("active", "") })
      this.classList = this.classList + " active"

      // if grid item index
      console.log(_elm.index)

      if (_elm.index == 0) {
        source1.src(source2.currentSrc)
        source2.src('/video/placeholder.mp4')
      }else if (_elm.index == 1) {
        source1.src(source2.currentSrc)
        source2.src('https://s3-eu-west-1.amazonaws.com/nabu/veejay/NoTV2/VTS_01_0.mp4')
      }else if (_elm.index == 2) {
        source1.src(source2.currentSrc)
        source2.src('/video/edirol_v4.mp4')
      }else if (_elm.index == 3) {
        source1.src(source2.currentSrc)
        source2.src('/video/veejays_demoreel.mp4')
      }else if (_elm.index == 4) {
        source1.src(source2.currentSrc)
        source2.src('https://s3-eu-west-1.amazonaws.com/nabu/veejay/occupy_chaos/protest_signs/set5_w_ppl.mp4')
      }else if (_elm.index == 6) {
        source1.src(source2.currentSrc)
        source2.src('https://nabu-dev.s3.amazonaws.com/uploads/video/556b99e86465764bdf1e0000/720p_h264.mp4')
      }
    }
  }
  console.log(_elm)
})
