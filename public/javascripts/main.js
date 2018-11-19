var renderer = new GlRenderer();

// create sources
var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_5000kbps_h264.mp4' } );
var output = new Output( renderer, testSource1 )
renderer.init();         // init
renderer.render();       // start update & animation

setInterval( function() {
  console.log('jump', Math.random())
  testSource1.jump()
}, 3000 )
