Here is rundown for a standard Mixer, or rather a _Compositions_ of mixers.
It has an example of audio analysis and effects.

For a working example of AudioAnalysis, check
[demo on codepen](https://codepen.io/xangadix/pen/VRGzdYthis)

We're basically building the 'awesome' mixer here, so check
[the original awesome mixer](https://virtualmixproject.com/mixer/awesome)
and find the code for that [in the repo here](https://github.com/Sense-Studios/VirtualMixerProject/blob/master/public/compositions/awesome.js).

***

first create a renderer

```
  var renderer = new GlRenderer();
```

create sources

```
  // create some video sources, 2 for the mixer and a vhs effect
  var source1 = new VideoSource(renderer, {} );
  var source2 = new VideoSource(renderer, {} );
  var source3 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/clutter/vhs_noise3.mp4" } );

```
now create your first mixer, this will mix between source1 and source2

```
  // create a mixer, mix the two video sources
  var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

```
Crate an audio analyzer and assign it an audiostream. Can be a pls radio stream or an mp3 file providing CORS are allowed

```
  // var analysis
  var audioanalysis1 = new AudioAnalysis( renderer, { audio: 'https://virtualmixproject.com/radio/nsb' } )

```
Now setup two FileManager for the sources. FileManagers keep track of which video is currently played.
Assign it a 'set' file, which is a JSON file, with an array in it with urls of videos. Again CORS must be allowed on all files

```
  var filemanager = new FileManager( source1 )
  filemanager.load_set("https://virtualmixproject.com/sets/programs_awesome.json")

  var filemanager2 = new FileManager( source2 )
  filemanager2.load_set("https://virtualmixproject.com/sets/programs_clutter.json")

```
Now add a second mixer to mix both the first mixer with the VHS noice, that way there can be VHS noise independent
of where the first mixer is set to.
Connect the second mixer with the vhs noise source and the first mixer.

```
  // add noise
  var mixer2 = new Mixer( renderer, { source1: source3, source2: mixer1 });

```
Now we have set up our mixer, lets add some effects.
Contrast is in the CollorEffect (effect 61), let's set it to 0.4
Connect the effect to your second mixer.

Notice how we are building a Chain of Sources and Modules

```
  // add effect
  var contrast = new ColorEffect( renderer, { source: mixer2, effect: 61, extra: 0.4 } )

```
Finally we connect the Effect to the Output, and we are done here.
We init the renderer and start the update cycle.

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
 Now we can start configuring the mixer, let's et the mixmode on 2 () and the blendmode to 1 (normal)
 The pod is set a little bit to source2 but mostly in the middle

 ```
  // set noise
  mixer2.mixMode(5)
  mixer2.blendMode(1)
  mixer2.pod(0.6)

```
Now we could update the effect here too, but we already set in during initiation.
The effect library has some 64 effect, contrast is effect 61.
The 'extra' parameter has en extra setting for each effect, the level of contrast
in with this particular effect.
[Coloreffect docs](http://virtualmixproject.com/docs/reference/Effect_ColorEffect.html)


```
  contrast.effect(61)
  contrast.extra(0.4)


```
Let's add the AudioAnalysisto the mixer.pod. The mixer pod takes a number between
0 and 1 that reflects the position of the mixer. 0 for source left 1 for source right.
The audioanalysis1 gives a number between 0 and 1 that reflects the current position
between beats.

```
  audioanalysis1.add( mixer1.pod )
  audioanalysis1.mod = 1

```

Finally we come to the heart of the mixer, an update function that measures beats and triggers a number of functions.
This is where we are actual Mixing. Kind of.

'beats' is a variable that counts every beat, dice is simply a random number.
Every few beats the script checks a random number and executes a function if conditions are met.
So for example, every 16 beats there is a 38% change the video in source1 will change
every 32 beats there is a 50% change the bpm will be slowed down or sped up by half
etc.

This way most events happen on the beat, but are still random enough to provide variation.


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
var audioanalysis1 = new AudioAnalysis( renderer, { audio: 'https://virtualmixproject.com/radio/nsb' } );
var contrast = new ColorEffect( renderer, { source: mixer2 } );
var output = new Output( renderer, contrast );

renderer.init();
renderer.render();

/* ---------------------------------------------------------------------------- */

filemanager.load_set("https://virtualmixproject.com/sets/programs_awesome.json");
filemanager2.load_set("https://virtualmixproject.com/sets/programs_clutter.json");

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
