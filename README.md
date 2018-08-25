# VirtualMixerProject

The VirtualMixerProject is a virtual video mixer that is driven by a chainable interface language and runs in WebGL.
A demo can be found here; http://nabu.sense-studios.com/channel/sense_beta/mixer5.

Build your own video mixers in javascript. The application takes a number of _sources_ ( video, gif, svg,  whathaveyou ) and mixes them together with a Blendmode.
Mixers and Sources are interchangable, so the output of a _mixer_ can serve as a _source_ for another mixer. So a serie of layers can be 'stached' or 'chained' together to build ever more elaborate mixers.

Modules expose a number of variables that can be changed and controlled at runtime through a _controller_. Usually a _controller_ connects a set of keys on the keyboard or the input of a gamepad with variables of the mixers.

Check more detailed info the docs at: https://github.com/Sense-Studios/VirtualMixerProject/tree/master/docs
Or continue with the Quickstart

## Installation

1) clone the package, defaults to VirtualMixerProject/

`$ git clone git@github.com:Sense-Studios/VirtualMixerProject.git `

2) run the installer

`$ VirtualMixerProject/ npm install `

3) start the app

`$ VirtualMixerProject/  npm start `

You might want to test the program with `npm test`.
point your browser to `127.0.0.1:3000` and enjoy the show.

check out the docs for more info

## Quickstart

Make sure you include the build files. (and in this order)

```    
  vendor-min.js
  mixer-min.js

```

Write a minimum of Webpage:

```

<html>
  <head>
    <script src="vendor-min.js">
    <script src="mixer-min.js">    
  </head>
  <body>
    <canvas/>
  </body>
</html>

```

And some javascript

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
* Phase out jQuery
* Phase out ThreeJS


# But Why?!

```
"Any application that can be written in JavaScript, will eventually be written in JavaScript."
-- Jeff Atwood
```
