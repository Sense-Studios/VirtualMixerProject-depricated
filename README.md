# VirtualMixerProject

The VirtualMixerProject is a virtual video mixer that can be build through a chainable interface and runs in WebGL.
There is a website: [VirtualMixerProject.com](https://virtualmixproject.com/).
There you can find examples and 'channels', which are basically auto-mixed sets of video files.
or gifs. Or SVG (soon) or ...

<img src="https://virtualmixproject.com/images/vmp_demo/vmp_logo.png" style="float: left;margin: 20px;width: 100px;">

it comes in a package for use on your website or an npm build for use on your local DMZ.

With these tools, you can Build your own video mixers in JavaScript. The application takes a number of _sources_ ( video, gif, svg,  whathaveyou ) and allows you to crossfades them.
Mixers and Sources are interchangeable, so the output of a one _mixer_ can serve as a _source_ for another _mixer_.

In this way a series of layers can be 'stacked' or 'chained' together to build even more elaborate mixers. You can also add effects and interfaces to your mixers and we have
support for _gamepads_ en _midi_ devices.

Check more detailed info the docs at: https://github.com/Sense-Studios/VirtualMixerProject/tree/master/docs

Or continue with the Quickstart

## Installation

1) clone the package, defaults to VirtualMixerProject/

```
  $ git clone git@github.com:Sense-Studios/VirtualMixerProject.git
```

2) run the installer

```
  $ VirtualMixerProject/ npm install
```

3) start the app

```
  $ VirtualMixerProject/  npm start
```

4) Go to 127.0.0.1:3000 and enjoy the show!

Check more detailed info the docs at: https://github.com/Sense-Studios/VirtualMixerProject/tree/master/docs

Or continue with the Quick start

## Quickstart

Make sure you include the build files. (and in this order) from the `/build` directory:

```    
  https://virtualmixproject.com/javascripts/build/vendor-min.js
  https://virtualmixproject.com/javascripts/build/mixer-min.js

```

Write a little of Webpage:

```
<html>
  <head>
    <script src="https://virtualmixproject.com/javascripts/build/vendor-min.js"></script>
    <script src="https://virtualmixproject.com/javascripts/build/mixer-min.js"></script>  
  </head>
  <body>
    <canvas/>
    <script>

      // this is the actual code for the mixer
      var renderer = new GlRenderer();
      var testSource1 = new GifSource(   renderer, { src: 'path/to/somefile.gif' } );
      var testSource2 = new VideoSource( renderer, { src: 'path/to/somefile.mp4' } );
      var mixer1 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
      var output = new Output( renderer, mixer1 )

      renderer.init();
      renderer.render();

      // done!
    </script>
  </body>
</html>

```

The most basic mixer setup is laid out hereunder in ASCII art:

```
    ____________     ____________   <--- src: somefile.mp4
    | Source 1 |     | Source 2 |   <--- play(), pause(), currentTime(), etc. (html5 interface)
    ------------     ------------   
               \     /
                \   /
                 \ /
              _________   <--- Pod (float)
              | Mixer |   <--- Mixmode (number)
              ---------   <--- Blendmode (number)
                  |
                  |
            ______________
            |   Output   |            
            --------------


```
This diagram flows from top to bottom. By defauld the [**`pod`**](Mixer.html#pod) of the _mixer_ is set to 0, so we see `Source 1` in our `Output`.
Set the `pod` to 1 to show the `Source 2`. Or set it to any value in between to mix the two sources together.

```
mixer1.pod(0)    // default shows Source 1
mixer1.pod(1)    // shows Source 2
mixer1.pod(0.5)  // shows both sources at 50%, not that this is darker as both add to only ~75% opacity
mixer1.pod(0.75) // shows Source 1 at ~25% opacity and Source 2 at ~75% opacity ( ~90% total opacity )

// add a function that moves the mixer handle from left to right.
var c = 0;
setInterval( function() {
  c += 0.01
  mixer1.pod ( ( Math.sin(c) * 0.5 ) + 0.5 );
})

```
See it al wired up on [CodePen](https://codepen.io/xangadix/pen/zewydR).


## Further Reading

* Limitations
* Build instructions
* References
* Roadmap

## Roadmap

* Set up a Node editor
* ~~Hook up Midi controller~~
* add wipe MixModes
* add configuration for Firebase
* Phase out express for lightweight server/ templating
* ~~Phase out jQuery~~
* Phase out ThreeJS


# But Why?!

```
"Any application that can be written in JavaScript, will eventually be written in JavaScript."
-- Jeff Atwood
```
