var renderer = new GlRenderer();

// create sources
//var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_5000kbps_h264.mp4' } );
var testSource1 = new WebcamSource(renderer, {});
var gifSource1 = new GifSource(renderer, { src: '/gif/gifshow/5b4cccdec8c97546ca88f2efc589ba58.gif' });
var gifSource2 = new GifSource(renderer, { src: '/gif/gifshow/5b4cccdec8c97546ca88f2efc589ba58.gif' });

var mixer1 = new Mixer(renderer, { source1: testSource1, source2: gifSource1 })
mixer1.mixMode(2)
var mixer2 = new Mixer(renderer, { source1: gifSource2, source2: mixer1 })
mixer1.mixMode(5)

var output = new Output( renderer, mixer2 )

// create a bpm addon
var bpm = new BPM( renderer )
var audioanalysis1 = new AudioAnalysis(renderer)
var audioanalysis2 = new AudioAnalysis(renderer)
audioanalysis2.mod = 0.6
audioanalysis2.disconnectOutput()

renderer.init();         // init
renderer.render();       // start update & animation

//mixer1.pod(bpm)
//bpm.add( mixer1.pod )
//audioanalysis1.add( mixer1.pod )
audioanalysis1.add( mixer1.pod )
audioanalysis2.add( mixer2.pod )



var gifs = [
  "2d09f2844398497960c8a39c0693b16c.gif",
  "39c7ce68ca5edd7c2caff6038d529c2a.gif",
  "5b4cccdec8c97546ca88f2efc589ba58.gif",
  "6378418073e3c0ae0d6bb6aab85e4fd8.gif",
  "6f0c35642bfb102dfbc8f7876bf95a02 (1).gif",
  "b4752f118e07ab5f3153712b3636704d.gif",
  "c4341013ac4d1db413a3ae85f63f832e.gif",
  "d5a7cb46e2f15a8fed10aaf1dd00965c.gif"
]



var updateSource = function( _source, initial = 0 ) {
  //console.log('jump', Math.random())
  //testSource1.jump()

  _source.src( '/gif/gifshow/' + gifs[ Math.floor( Math.random() * gifs.length ) ] )

  var r = ( audioanalysis1.bpm^2 ) + initial;
  r = Math.floor(Math.random() * ( audioanalysis1.bpm * 50 ) ) + 6000 + initial;
  if ( isNaN(r) || r < 10000) r = 10000 + initial;
  console.log("update src", r, _source.currentSrc)
  setTimeout( updateSource, r, _source  )
}

gifSource1.src( '/gif/gifshow/' + gifs[ Math.floor( Math.random() * gifs.length ) ] )
gifSource2.src( '/gif/gifshow/' + gifs[ Math.floor( Math.random() * gifs.length ) ] )

setTimeout( function() {
  updateSource( gifSource1, 9000 )
  updateSource( gifSource2, 18000 )
} , 200 )
