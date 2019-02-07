var renderer = new GlRenderer();

// create sources

var testSource1 = new VideoSource( renderer, { src: '/video/1UP_Graffiti_olympic.mp4' } );
var testSource2 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_h264.mp4' } );
// var testSource1 = new WebcamSource(renderer, {});
//var gifSource1 = new GifSource(renderer, { src: '/gif/gifshow/5b4cccdec8c97546ca88f2efc589ba58.gif' });
var gifSource1 = new GifSource(renderer, { src: '/gif/gifshow/d5a7cb46e2f15a8fed10aaf1dd00965c.gif' });

var effect1 = new FeedbackEffect(renderer, { source: gifSource1 } );

var effect2 = new ColorEffect(renderer, { source: testSource2 } );

var mixer1 = new Mixer(renderer, { source1: effect1, source2: effect2 })
// mixer1.mixMode(2)
// var mixer2 = new Mixer(renderer, { source1: gifSource2, source2: mixer1 })
// mixer1.mixMode(3)

var output = new Output( renderer, mixer1 )

renderer.init();         // init
renderer.render();       // start update & animation

// mixer1.autoFade = true
mixer1.pod(1)
mixer1.bpm = 128
mixer1.mixMode(1)

effect1.effect(100)
effect1.extra(0.5)

//effect1.effect(39)
//effect1.extra(0.4)


/// scroll
