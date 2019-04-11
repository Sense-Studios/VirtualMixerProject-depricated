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
This diagram flows from bottom to top;
This particular configuration can be described as

```
  var renderer = new GlRenderer();
  var testSource1 = new GifSource(   renderer, { src: 'somefile.gif' } );
  var testSource2 = new VideoSource( renderer, { src: 'somefile.mp4' } );
  var mixer1 = new Mixer( renderer, { source1: testSource1, source2: testSource2 } );
  var output = new Output( renderer, mixer1 )

  renderer.init();
  renderer.render();

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
and allows for blending the images together. I didn't write that, but you can find a lot about it on http://www.nutty.ca/articles/blend_modes/
The code is much easier to read if you just focus on the main() function.

After the configuration is loaded, the shader is applied to a surface in a
3D scene and shown on screen.

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
        ___________
        | Mixer 1 |
        -----------
            / \
           /   \
          /     \
 ____________     ___________
 | Source 1 |     | Mixer 2 |      <-- Mixer as a Source for another Mixer
 ------------     -----------
                   / \
                  /   \
                 /     \
        __________       __________
       | Source 2 |     | Source 3 |
       ------------     ------------
```

Could be written as:

```
  var renderer = new GLrenderer()
  var videosource1 = new VideoSource( renderer, {} )
  var videosource2 = new VideoSource( renderer, {} )
  var videosource3 = new VideoSource( renderer, {} )
  var mixer1 = new Mixer( renderer, { source1: videosource1, source2: videosource2 } )
  var mixer2 = new Mixer( renderer, { source1: mixer1, source2: videosource3 } )
  var output = new Output( renderer )

  renderer.init()
  renderer.start()

```

## Add a Tapped BPM controller
So it breaks down to three main components; a _Renderer_ (output), _Modules_ (ie. mixers) and _Sources_ (ie. video or gif) in our demo. As you can see, a mixer is actually **also** a _Source_.

There are also _Addons_ like a BPM counter and _Controllers_, that allows keyboard or midi input. A BPM is created and connected to the Mixer. The BPM Addon will then start moving the handle back and forth in a set tempo. A _Controller_ finally will allow you to **tap** the BPM in sync with the music and have the mixer mix on the beat.

```
      ______________
      |  Renderer  |
      --------------
            |
            |
        _________
        | Mixer |________________
        ---------            ___|___          _________________
           / \               | BPM |--------- | TapController |
          /   \              -------          -----------------
         /     \                |
__________     _________        |
| Source |     | Mixer |________|
----------     ---------
                  / \
                 /   \
                /     \
       __________     __________
       | Source |     | Source |
       ----------     ----------

```

Can be written as:

```
  var renderer = new GLrenderer()
  var videosource1 = new VideoSource( renderer, {} )
  var videosource2 = new VideoSource( renderer, {} )
  var videosource3 = new VideoSource( renderer, {} )
  var mixer1 = new Mixer( renderer, { source1: videosource1, source2: videosource2 } )
  var mixer2 = new Mixer( renderer, { source1: mixer1, source2: videosource3 } )
  var bpm1 = new Bpm()
  var output = new Output( renderer )

  bpm1.add(mixer1)
  bpm1.add(mixer2)

  renderer.init()
  renderer.start()

  // add it to the enter key
  window.addEventListener( "keydown", function(e) {
    if (e.keyCode == 13) bpm1.tap()
  });


```

Note that the BPM can control multiple mixers at once if you don't want that. Below you'll find a breakdown of all the Modules that are sort or less available.

### The Renderer
It loads all components, it builds the shaders and starts rendering them.

```

  // availeble functions on GLRenderer instance

  add( module )
  nodes
  dispose()
  init()
  render()

  camera
  PerspectiveCamera
  scene
  Mesh  
  PlaneGeometry
  flatGeometry
  surface  
  ShaderMaterial

  fragmentShader
  vertexShader
  customDefines
  customUniforms

```

As you can see, there is a scene, in which there is a plane. On the plane, a shader material is rendered and therein is our mixer.

### Sources

[Sources Docs](https://virtualmixproject.com/docs/reference/Source.html): take a video file or an image and display it. Sources can be made from anything that can be drawn on a CanvasElement. They also include a reference to the original object like a VideoElement or an ImageElement. So you can control a video and change the src.

#### Output
Is a _Module_ Mandatory at the end of the chain, so the Renderer knows what is last.

```
var output = new Output( renderer, Source )
```

[Module Docs](https://virtualmixproject.com/docs/reference/Module.html)
[Output Docs](https://virtualmixproject.com/docs/reference/Module_Output.html)


#### Mixer
Mixes to sources through a blendMode.
exposes a `pod` which is a float between 0 and 1 that resembles the position of the mixer's pod.

```
var mixer1 = new Mixer( renderer, { source1: Source, source2: Source } );

mixer1.mixMode( 4 )
mixer1.blendMode( 3 )

mixer3.pod(0.5)
```

This is the pod, it's on the left side.

```
   LEFT (A)         RIGHT (B)
   ____
  /    \
  |    |_______________    
  |    |-------.       |
  |    /.______/       |
  |    |_______________|
  |    |
  \____/

```

Move it to the right;

```
   LEFT (A)         RIGHT (B)
                       ____
                      /    \
       _______________|    |
      |        .------|    |  
      |        \______|    |
      |_______________|    |
                      |    |
                      \____/

```

These are the available _Blendmodes_
```
1 ADD (default), 2 SUBSTRACT, 3 MULTIPLY, 4 DARKEN, 5 COLOUR BURN, 6 LINEAR_BURN, 7 LIGHTEN,  8 SCREEN, 9 COLOUR_DODGE, 10 LINEAR_DODGE, 11 OVERLAY, 12 SOFT_LIGHT, 13 HARD_LIGHT, 14 VIVID_LIGHT, 15 LINEAR_LIGHT, 16 PIN_LIGHT, 17 DIFFERENCE, 18 EXCLUSION
```

Look them up, they're almost like you know them from photoshop; https://photoblogstop.com/photoshop/photoshop-blend-modes-explained


These are the available _Mixmodes_
```
1 NORMAL, 2 HARD, 3 NAM, 4 FAM, 5 LEFT, 6 RIGHT, CENTER, BOOM
```

**1. NORMAL:** Both sides fadeout in a straight line, if the pod is exactly in the middle both sources will be 50% opaque.
**2. HARD:** This is "Hard" mix, so there is no fading, the Source switches over the other if the pod touches the middle.
**3. NAM:** A mix where the curves are parabolic (eased out) and overlayed so that both sides are never under ~75% opaque.
**4. FAM:** A more extreme version of NAM, where the alpha > 1 is not maxed out; allows for more than ~100% opaque.
**5. NON-DARK:** Boosts the alpha levels of a NAM mix allowing for a NAM with _more light_ so to speak (when you have a lot of dark material)

With the last 4 blend modes, changing the pod() value doesn't affect the mixer.

**6. LEFT:** The pod is set to the left (pod cannot be moved)
**7. RIGHT:** The pod is set to the right (pod cannot be moved)
**8. CENTER:** The pod is set to dead center (pod cannot be moved)
**9. BOOM:** Both sources are added to each other (pod cannot be moved)

[Mixer Docs](https://virtualmixproject.com/docs/reference/Module_Mixer.html)


#### Chain
WIP. A chain is much like a mixer, but it simply stacks a number of sources. Still, it can be used to chain a lot of empty channels together, from which only a few are actually _On_.
[Chain Docs](https://virtualmixproject.com/docs/reference/Module_Chain.html)

#### Switch
A switch is also a lot like a mixer, but it allows for two sources, and can `switch()`, or be set (0 or 1). A switch can be chained into complex patterns.

```
var switcher1 = new Switcher( renderer, [ Source, Source ] );
switcher1.switch()
switcher1.switch(1)
switcher1.switch(0)
```

[Switcher Docs](https://virtualmixproject.com/docs/reference/Module_Switcher.html)


### Effects

Effects can be put in a chain between the source or mixer and the output. Here's how you'd set up
a brightness and contrast chain.

*  60. Brightness
*  61. Contrast
*  62. Saturation
*  63. Hue

[Effect Docs](https://virtualmixproject.com/docs/reference/Effect.html)
[ColorEffect Docs](https://virtualmixproject.com/docs/reference/Effect_ColorEffect.html)

```

...

var brightnessEffect = ColorEffect( renderer, { src: source1, effect: 60 } );
var contrastEffect = ColorEffect( renderer, { src: brightnessEffect, effect: 61 } );
var saturationEffect = ColorEffect( renderer, { src: contrastEffect, effect: 62 } );
var hueEffect = ColorEffect( renderer, { src: saturationEffect, effect: 63 } );

var output = new Output( renderer, { src: hueEffect } );

```

### Controllers
[Controller Docs](https://virtualmixproject.com/docs/reference/Controller.html)
