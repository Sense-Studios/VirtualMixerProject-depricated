# VirtualMixerProject

Build your own video mixers in javascript. The application takes a number of _sources_ (video, gif) and mixes them together, with a Blendmode through a _mixer_.
As module output nodes are sources as mixers and other modules can be 'chained' together to build ever more elaborate mixers.
Modules expose a number of variables that can be changed and controlled in runtime through a _controller_

The VirtualMixerProject is a virtual video mixer that is driven by a chainable interface language and runs in WebGL.
A demo can be found here; http://nabu.sense-studios.com/channel/sense_beta/mixer5.

check out the docs for more info.

## Installation

1) clone the package, defaults to VirtualMixerProject/

` git clone git@github.com:Sense-Studios/VirtualMixerProject.git `

2) run the installer

` npm install `

3) start the app

` npm start `

You might want to test the program with `npm test`.
point your browser to `127.0.0.1:3000` and enjoy the show.

check out the docs for more info

## Quickstart

Make sure you include the build files.



```
  var renderer = new GlRenderer();
  var testSource1 = new GifSource(   renderer, { src: 'somefile.gif' } );
  var testSource2 = new VideoSource( renderer, { src: 'somefile.mp4' } );
  var mixer1 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
  var output = new Output( renderer, mixer1 )

  renderer.init();
  renderer.render();

```

The most basic mixer setup is laid out hereunder in ASCII art:

```
        ______________
        |  Renderer  |
        --------------
              |
              |
          _________   <--- Pod
          | Mixer |   <--- Mixmode
          ---------   <--- Blendmode
             / \
            /   \
           /     \            
  __________     __________   <--- somefile.mp4
  | Source |     | Source |   <--- play, pause, currentTime, etc. (html5 interface)
  ----------     ----------   
```
This diagram flows from bottom to top;
This particular configuration can be described as


## Roadmap

* Set up a Node editor
* Hook up Midi controller
* add configuration for Firebase
* Phase out express for lightweight server/ templating


# But Why?!

```
"Any application that can be written in JavaScript, will eventually be written in JavaScript."
-- Jeff Atwood
```
