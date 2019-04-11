Here is rundown for a standard Mixer, or rather a _Compositions_ of mixers.
It has an example of audio analysis and effects.

create a renderer

```
  var renderer = new GlRenderer();
```

create sources

```
  // create some solids
  var source1 = new VideoSource(renderer, {} );
  var source2 = new VideoSource(renderer, {} );
  var source3 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/clutter/vhs_noise3.mp4" } );
  create sources

```
verhaal

```
  // create a mixer, mix red and green
  var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

```
verhaal

```
  // var analisi
  var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/nsb' } )

```
verhaal

```
  var filemanager = new FileManager( source1 )
  filemanager.load_set("/sets/programs_awesome.json")

  var filemanager2 = new FileManager( source2 )
  filemanager2.load_set("/sets/programs_clutter.json")

```
verhaal

```
  // add noise
  var mixer2 = new Mixer( renderer, { source1: source3, source2: mixer1 });

```
verhaal

```
  // add effect
  var contrast = new ColorEffect( renderer, { source: mixer2, effect: 61, extra: 0.4 } )

```
verhaal

```
  // finally asign that mixer to the output
  var output = new Output( renderer, contrast )

  // initialize the renderer and start the renderer
  renderer.init();         // init
  renderer.render();       // start update & animation

  /* ----------------------------------------------------------------------------
     And we are away
     ---------------------------------------------------------------------------- */

 ```
 verhaal

 ```
  // set noise
  mixer2.mixMode(5)
  mixer2.blendMode(1)
  mixer2.pod(0.6)

```
verhaal

```
  contrast.effect(61)
  contrast.extra(0.4)

  or



```
verhaal

```
  audioanalysis1.add( mixer1.pod )
  audioanalysis1.mod = 1

```

Finally we come to the heart of the mixer, an update function that measures beats and triggers a number of functions.




```
  var wasSet = false
  var beats = 0
  var useBlendmodes = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
  var useMixmodes = [ 1, 2, 3, 4, 5, 6, 9 ] //  6, 7, 8
  var dice = 0

  setInterval(function() {

    if ( audioanalysis1.render() > 0.99 && !wasSet ) {
      wasSet = true
      beats += 1
      dice = Math.random()
      console.log("beat!", beats, dice)

      if (beats == 2) filemanager.changez()
      if (beats == 6) filemanager2.changez()

      if (beats%6 == 0 && dice < 0.2 ) source1.jump()
      if (beats%4 == 0 && dice < 0.2 ) source2.jump()
      if (beats%16 == 0 && dice < 0.64 ) filemanager.changez(); //setTimeout(function() { source1.jump() }, 1500 )
      if (beats%12 == 0 && dice < 0.64 ) filemanager2.changez(); //setTimeout(function() { source1.jump() }, 1500 )
      if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%18 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%32 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.5
      if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 1
    }

    if ( audioanalysis1.render() < 0.01 ) {
      wasSet = false
    }

  }, 1 )

```

Here it is all together:

```
var renderer = new GlRenderer();
var source1 = new VideoSource(renderer, {} );
var source2 = new VideoSource(renderer, {} );
var source3 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/clutter/vhs_noise3.mp4" } );
var filemanager = new FileManager( source1 );
var filemanager2 = new FileManager( source2 );
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
var mixer2 = new Mixer( renderer, { source1: source3, source2: mixer1 });
var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/nsb' } );
var contrast = new ColorEffect( renderer, { source: mixer2 } );
var output = new Output( renderer, contrast );

renderer.init();
renderer.render();

/* ---------------------------------------------------------------------------- */

filemanager.load_set("/sets/programs_awesome.json");
filemanager2.load_set("/sets/programs_clutter.json");

mixer2.mixMode(5);
mixer2.blendMode(1);
mixer2.pod(0.6);

contrast.effect(61)
contrast.extra(0.4)

audioanalysis1.add( mixer1.pod )
audioanalysis1.mod = 1

var wasSet = false
var beats = 0
var useBlendmodes = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
var useMixmodes = [ 1, 2, 3, 4, 5, 6, 9 ] //  6, 7, 8
var dice = 0
setInterval(function() {
  if ( audioanalysis1.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    dice = Math.random()
    console.log("beat!", beats, dice)

    if (beats == 2) filemanager.changez()
    if (beats == 6) filemanager2.changez()

    if (beats%6 == 0 && dice < 0.2 ) source1.jump()
    if (beats%4 == 0 && dice < 0.2 ) source2.jump()
    if (beats%16 == 0 && dice < 0.64 ) filemanager.changez();
    if (beats%12 == 0 && dice < 0.64 ) filemanager2.changez();
    if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[ Math.floor( Math.random() * useBlendmodes.length ) ] );
    if (beats%18 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[ Math.floor( Math.random() * useMixmodes.length ) ] );
    if (beats%32 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.5
    if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 1
  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )
```
