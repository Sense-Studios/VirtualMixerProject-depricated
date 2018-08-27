// -----------------------------------------------------------------------------
// SETTINGS

// -----------------------------------------------------------------------------
// create the renderr
// var renderer = new GlRenderer();


// -----------------------------------------------------------------------------
// add your sources
// var gifSource = new GifSource(  renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );

//var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource3 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource4 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource5 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource6 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource7 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource8 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource9 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource10 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource11 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource12 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource13 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource14 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource15 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );

// there is a maximum of 16 sources (samplers)


//  var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/5611abde6465762b80000000/720p_h264.mp4', uuid: 'testSource2' } );
//  var testSource3 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/5611abde6465762b80000000/720p_h264.mp4', uuid: 'testSource3' } );
//  var videosource3 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/557c48876465763a3b000004/720p_h264.mp4' } );
//  var videosource4 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/5519f9a66465764a1f8b0000/720p_h264.mp4' } );
//  var videosource2 = new VideoSource(renderer, {} );

// -----------------------------------------------------------------------------
// add your modules
//var mixer1 = new Mixer( renderer, { source1: videosource3, source2: testSource2 } );
//var mixer2 = new Mixer( renderer, { source1: mixer1, source2: testSource1 } );

// examples
// var filemanager1 = new Filemanager( testSource1, { tags: ['awesome', 'manga']} )
// var filemanager2 = new Filemanager( testSource2, { tags: ['runner', 'clutter']} )
// var mixer1 = new Mixer(renderer, testSource1, testSource1 );
// var chain = new Chain( renderer, { "sources": [ testSource1, testSource2, videosource3 ], "alphas": [ 1.0, 1.0, 1.0 ] } );
// var feedback = new Feedback( renderer, source )
// var black_and_white  = BlackAndWhite( renderer, source )

// crete renderer

var renderer = new GlRenderer();

// create sources
// var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
//var testSource1 = new GifSource( renderer, { src: '' } );
var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource3 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource4 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );

// var testSource1 = new SolidSource( renderer, { color: { r: 1.0, g: 0.0, b: 0.0 } } );
// var testSource2 = new SolidSource( renderer, { color: { r: 0.0, g: 1.0, b: 0.0 } } );
// var testSource3 = new SolidSource( renderer, { color: { r: 0.0, g: 0.0, b: 1.0 } } );
// var testSource4 = new SolidSource( renderer, { color: { r: 1.0, g: 1.0, b: 0.0 } } );

// solid
var testSource5 = new SolidSource( renderer, { color: { r: 0.1, g: 1.0, b: 0.5 } } );

// create a mixer
var mixer1 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
var mixer2 = new Mixer( renderer, { source1: testSource3, source2: testSource4 } );
var mixer3 = new Mixer( renderer, { source1: mixer1, source2: mixer2 } );

var mixer4 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );


var switcher1 = new Switcher( renderer, [ mixer3, mixer4 ] );


// create the filemanager addon for the sources
var giphymanager1 = new GiphyManager( testSource1 )
var filemanager1 = new FileManager( testSource1 )
var filemanager2 = new FileManager( testSource2 )
var filemanager3 = new FileManager( testSource3 )
var filemanager4 = new FileManager( testSource4 )

// create a bpm addon
var bpm = new BPM( renderer )

// add the bpm to the mixer (-pod)
bpm.add( mixer4.pod )


// -----------------------------------------------------------------------------
// set the output node (needs to be last!)
var output = new Output( renderer, switcher1 )
//var output = new Output( renderer, testSource1 )

// -----------------------------------------------------------------------------
// add a controller to mixer and bpm
var numpad1 = new NumpadBpmMixerControl( renderer, mixer1, bpm )
numpad1.addBpm(bpm)
numpad1.addMixer( mixer1 )
numpad1.addMixer( mixer2 )
numpad1.addMixer( mixer3 )
numpad1.addMixer( mixer4 )
// nupad1.addFileManager

//var keyboard1 = new KeyboardMixerControl( renderer, mixer1, bpm )

// var gamepad = new GamePad( renderer, mixer1, mixer2, mixer3 )
// var gamepad1 = new GamePadDiagonalControl( renderer, mixer1, mixer2, mixer3 )
// var gamepad2 = new GamePadVerticalControl( renderer, mixer1, mixer2, mixer3, mixer4, mixer5, mixer6, mixer7 )
var firebase1 = new FireBaseControl( renderer, mixer1, mixer2, mixer3 )
// firebase1.addMixer( mixer1 ) ?
// firebase1.addMixer( mixer2 ) ?
// firebase1.addMixer( mixer3 ) ?
// firebase1.addFileManager( filemanager1) ?

// -----------------------------------------------------------------------------
renderer.init();         // init
renderer.render();       // start update & animation


// -----------------------------------------------------------------------------

/*
// here is what a reset looks like:
renderer.dispose()
var testSource5 = new SolidSource( renderer, { color: { r: 0.1, g: 1.0, b: 0.5 } } );
var output = new Output( renderer, testSource5 )
renderer.init();         // init
renderer.render();       // start update & animation
*/

/*
// here is what a bpm composition looks like
renderer.dispose()
var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
var mixer1 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
var bpm = new BPM( renderer )
bpm.add( mixer1.pod )
var output = new Output( renderer, testSource5 )
renderer.init();         // init
renderer.render();       // start update & animation
*/

setTimeout( function() {
  //filemanager1.change()
  //filemanager2.change()
  //filemanager3.change()
  //filemanager4.change()

}, 12000)





// -----------------------------------------------------------------------------
// Testscripts ("Behaviours?")


var changez_mod = 12000
var jump_mod = 7200
var scratch_mod = 12000

// this is a hokey pokey controller
// call this a behaviour?

function changez() {
  if (Math.random() > 0.25 ) {
    filemanager1.change();
  }else if (Math.random() > 0.50 ) {
    filemanager2.change();
  }else if (Math.random() > 0.75 ) {
    filemanager3.change();
  }else{
    filemanager4.change();
  }
  var r = Math.floor( Math.random() * changez_mod )
  setTimeout( function() {
    changez()
  }, r )
};
changez()


/*
function jumps() {
  var r = Math.floor( Math.random() * jump_mod )
  setTimeout( function() {
    jumps()
  }, r )

  try {
    if (Math.random() > 0.5 ) {
      testSource1.video.currentTime = Math.random() * testSource1.video.duration
      console.log("src 1 jumps")
    }else{
      testSource2.video.currentTime = Math.random() * testSource2.video.duration
      console.log("src 2 jumps")
    }
  }catch(err) {}
};
jumps()


function scratch() {
  var r = Math.floor( Math.random() * scratch_mod )
  setTimeout( function() {
    scratch()
  }, r )

  try {
    var rq = ( Math.random() * 0.6 ) + 0.7
    //var rq = Math.pow( (Math.random() * 0.5), 0.3 )
    if ( Math.random() > 0.5 ) {
      testSource1.video.playbackRate = rq //+ 0.7
      console.log("src 1 scxratches", rq)
    }else{
      testSource2.video.playbackRate = rq //+ 0.7
      console.log("src 1 scxratches", rq)
    }
  }catch(err) { console.log("err:", err)}
};
scratch()
*/
