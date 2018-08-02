# VirtualMixerProject

Build your own video mixers in javascript. The application takes a number of _sources_ (video, gif) and mixes them together, with a Blendmode through a _mixer_.
As module output nodes are sources as mixers and other modules can be 'chained' together to build ever more elaborate mixers.
Modules expose a number of variables that can be changed and controlled in runtime through a _controller_

The VirtualMixerProject is a virtual video mixer that is driven by a chainable interface language and runs in WebGL.
A demo can be found here; http://nabu.sense-studios.com/channel/sense_beta/mixer5.


## Installation

1) clone the package, defaults to VirtualMixerProject/

` git clone git@github.com:Sense-Studios/VirtualMixerProject.git `

2) run the installer

` npm install `

3) start the app

` npm start `

You might want to test the program with `npm test`.
point your browser to `127.0.0.1:3000` and enjoy the show.

## Introduction

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
This diagram flows from bottom to top; two
This particular configuration is now described as

```
  var renderer = new GlRenderer();
  var testSource1 = new GifSource(   renderer, { src: 'somefile.gif' } );
  var testSource2 = new VideoSource( renderer, { src: 'somefile.mp4' } );
  var mixer1 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
  var output = new Output( renderer, mixer1 )

  renderer.init();
  renderer.render();

```

But in the future, I want to describe it as shown below and be able to edit it
in a (simple) node editor.

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

This configuration compiles to a fragment shader, that can be retrieved from
the renderer with 'renderer.fragmentShader'. This will output the shader:

```
uniform sampler2D textureTest;
uniform float wave;
uniform sampler2D GifSource_1b3cc459;
uniform vec3 GifSource_1b3cc459_output;
uniform float GifSource_1b3cc459_alpha;
uniform sampler2D VideoSource_39ce9958;
uniform vec3 VideoSource_39ce9958_output;
uniform float VideoSource_39ce9958_alpha;
uniform int Mixer_54ba1ab5_mixmode;
uniform int Mixer_54ba1ab5_blendmode;
uniform float Mixer_54ba1ab5_alpha1;
uniform float Mixer_54ba1ab5_alpha2;
uniform vec4 Mixer_54ba1ab5_output;
/* custom_uniforms */


vec3 blend ( vec3 src, vec3 dst, int blendmode ) {
  if ( blendmode ==  1 ) return src + dst;
  if ( blendmode ==  2 ) return src - dst;
  if ( blendmode ==  3 ) return src * dst;
  if ( blendmode ==  4 ) return min(src, dst);
  if ( blendmode ==  5)  return vec3((src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z)));
  if ( blendmode ==  6 ) return (src + dst) - 1.0;
  if ( blendmode ==  7 ) return max(src, dst);
  if ( blendmode ==  8 ) return (src + dst) - (src * dst);
  if ( blendmode ==  9 ) return vec3((src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z)));
  if ( blendmode == 10 ) return src + dst;
  if ( blendmode == 11 ) return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));
  if ( blendmode == 12 ) return vec3((src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z))));
  if ( blendmode == 13 ) return vec3((src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)), (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z)));
  if ( blendmode == 14 ) return vec3((src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z))));
  if ( blendmode == 15 ) return 2.0 * src + dst - 1.0;
  if ( blendmode == 16 ) return vec3((src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), (src.x > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z));
  if ( blendmode == 17 ) return abs(dst - src);
  if ( blendmode == 18 ) return src + dst - 2.0 * src * dst;
  return src + dst;
}
/* custom_helpers */

varying vec2 vUv;
void main() {
  vec3 GifSource_1b3cc459_output = ( texture2D( GifSource_1b3cc459, vUv ).xyz * GifSource_1b3cc459_alpha );
  vec3 VideoSource_39ce9958_output = ( texture2D( VideoSource_39ce9958, vUv ).xyz * VideoSource_39ce9958_alpha );
  vec3 Mixer_54ba1ab5_output = blend( GifSource_1b3cc459_output * Mixer_54ba1ab5_alpha1,VideoSource_39ce9958_output * Mixer_54ba1ab5_alpha2, Mixer_54ba1ab5_blendmode );

  gl_FragColor = vec4( Mixer_54ba1ab5_output, 1.0 );


}
```

Don't be fooled by all the math in the Blend function, it's put there by the Mixer
and allows for blending the images together.

After the configuration is loaded, the shader is applied to a surface in a
3D scene and shown on screen.

## chaining components

The configuration can be extended so we can swap Source 2 with another mixer
and have an additional source.

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
| Source |     | Mixer |      <--
----------     ---------
                  / \
                 /   \
                /     \
       __________     __________
       | Source |     | Source |
       ----------     ----------
```



## Breaking it down
abc

### The Renderer
It loads all components, it builds the shaders and starts rendering them.

```
  add( module )
  nodes
  dispose()
  init()
  render()
  camera
  PerspectiveCamera
  scene
  flatGeometry
  PlaneGeometry
  surface
  Mesh
  fragmentShader
  vertexShader
  customDefines
  customUniforms
  shaderMaterial
  ShaderMaterial
```

### Sources

#### VideoSource
abc

#### GifSource
abc

#### Solidcolor
abc

#### SVGSource
abc

#### TextSource
abc

### Modules
#### Output

```
var output = new Output( renderer, Source )
```

#### Mixer

```
var mixer1 = new Mixer( renderer, { source1: Source, source2: Source } );

mixer1.mixMode( _num )
mixer1.blendMode( _num )

mixer3.pod()
```

#### Chain
WIP

#### Switch
A switch 

```
var switcher1 = new Switcher( renderer, [ Source, Source ] );
```

### Effects
#### BlackAndWhite
abc

### Controllers
#### Firebase
#### Keyboard
#### Numpad
#### Gamepad
#### Midi
abc

### Addons
#### BPM
The BPM now has two functions;
1) it allows for tapped beat-control
2) it analyses the music and tries to come up with a BPM number

```
// create a bpm addon
var bpm = new BPM( renderer )
bpm.tap()
bpm.render()
bpm.bpm
bpm.bps
bpm.bpm_float

bpm.mod 
bpm.modUp 
bpm.modDown

bpm.useAutoBpm
bpm.audio_src
bpm.useMicrophone

// add the bpm to the mixer's pod
bpm.add( mixer1.pod )
bpm.add( mixer2.pod )
```

#### AudioAnalysis
WIP, the audio analysis is now actually all in the BPM addon. But I want to try and detect more, beside the beat, so it should all move over here.

#### Filemanager
A Filemanager downloads a large number of mp4 with metadata and plugs into a _VideoSource_. It allows for changing videos on the fly. You can set it to a button or a timer. It can select based on tags, or just random.
The Current Filemanager should be more aptly called MarduqFileManager as it takes it's content from my dayjobs' servers.

```
var filemanager = new FileManager( VideoSource )
filemanager.change()
```

#### GyphyManager
This Addon is much like the Filemanager, as that it changes the source files for the _GifSource_.
It takes a collection from Gyphy, based on a given tag; and allows switching between them.

```
var giphymanager = new GiphyManager( GifSource )
giphymanager.change()
```

### Editors
TODO

## Considerations
When running on your own machine, you should not have an issue with playback. I get even a decent framerate out of my three-year-old mobile phone. Having said that, when you put it on a webserver, you'll notice that seek-hiccups occur. Which basically means you can't
jump around in videos. I have tried every possible combination of Cloudflare configuration, Amazon S3 settings, and what have you. It's almost unsolvable to request a random in point and not have a delay when the video is not loaded at that point.  It annoys me so much that I've started experimenting with an VideoSource that actually loads multiple videos and jumps between them to switch. It works okayish, but it eats a hell of a load of bandwidth.


## Roadmap

* Set up a Node editor
* Hook up Midi controller
* add configuration for Firebase
* Phase out express for lightweight server/ templating


# But Why?!
