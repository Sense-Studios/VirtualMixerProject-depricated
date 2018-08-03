# VirtualMixerProject

Build your own video mixers in javascript. The application takes a number of _sources_ (video, gif) and mixes them together, with a blendmode through through a _mixer_.
As module output nodes are sources as, mixers and other modules can be 'chained' together to build ever more elaborate mixers.
Modules expose a number of variables that can be changed and controlled in runtime through a _controller_


## Installation

1) clone the package, defaults to VirtualMixerProject/

` git clone git@github.com:Sense-Studios/VirtualMixerProject.git `

2) run the installer

` npm install `

3) start the app

` npm start `

You might want to test the program with `npm test`


## Introduction

The most basic mixer setup is laid out hereunder in ascii art:

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
__________     __________
| Source |     | Source |
----------     ----------

```
This diagram flows from bottom to top; two

This particular configuration can be described as:

```

  var my_renderer = {
    my_source_1 = {
      type = VideoSource,
      src = "somefile.mp4"
    },
    my_source_2 = {
      type = GifSource,
      src = "somefile.gif"
    },
    my_mixer_1 = {
      type = Mixer,
      src1 = my_source_1,
      src1 = my_source_2,
      pod: 0.5,
      mixmode: 1,
      blendmode: 1
    }
  }



```

Note that configuration files are interpreted from top to bottom; so make sure that `my_source_1`
is defined before you plug it into `my_mixer_1`

After the configuration is loaded, it will generate a fragment shader,
which is applied to a surface in a 3D scene.


The most

```
      ______________
      |  Renderer  |
      --------------
            |
            |
        _________
        | Mixer |
        ---------
           / \
          /   \
         /     \
__________     _________
| Source |     | Mixer |
----------     ---------
                  / \
                 /   \
                /     \
       __________     __________
       | Source |     | Source |
       ----------     ----------



```

## Elements
abc

### The Renderer
abc

### Sources
abc

### Modules
abc

### Effects
abc

### Controllers
abc

### Addons
abc

### Editors
TODO

# Roadmap

* Set up a Node editor
* Hook up Midi controller
* add configuration for Firebase
* Phase out express for lightweight server/ templating
