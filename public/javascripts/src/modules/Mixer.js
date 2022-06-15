/**
 * @summary
 *    A mixer mixes two sources together.
 *    Mixer example on codepen:
 *    <a href="https://codepen.io/xangadix/pen/zewydR" target="_blank">codepen</a>
 *
 * @description
 *   ### Mixmode
 Mixers support a [`Mixmode`](Mixer.html#mixMode).
 The Mixmode defines the curvature of the crossfade.

 In a regular crossfade, source 1 would fade out while source 2 fades in. At the center both sources are then both at 50% opacity; however, 2 sources with 50% opacity only add up to ~75% opacity, not to 100%. This means that the output is **darker** in the middle of  the crossfade then it is at both ends. This is the default _Mixmode_, the other modes play with these settings

 ```
   1: NORMAL (default),   regular, linear crossfade
   2: HARD,               switches with a hard cut at 50%
   3: NAM,                fades with an upward curvature forcing 100% opacity throughout the crossfade (lighter!)
   4: FAM,                fades with a downward curve, forcing a 'overlay' period
   5: NON DARK,           Never goes dark, 0-2 linear curve, capped at 1 and .36
   6: LEFT,               forces the pod on 0 (locks pod)
   7: RIGHT,              forces the pod on 1 (locks pod)
   8: CENTER,             forces both sources at ~66% (locks pod)
   9: BOOM                forces both sources at 100%, allows for overflow (lighter!) (locks pod)
 ```

 ### Blendmode
 Mixers also support a [`Blendmode`](Mixer.html#blendMode).
 Think of them as the a Photoshop Blendmodes. They tell the mixer how to blend Source 1 and Source 2 together.

 ```
   1 ADD (default),
   2 SUBSTRACT,
   3 MULTIPLY,
   4 DARKEN,
   5 COLOUR BURN,
   6 LINEAR_BURN,
   7 LIGHTEN,
   8 SCREEN,
   9 COLOUR_DODGE,
   10 LINEAR_DODGE,
   11 OVERLAY,
   12 SOFT_LIGHT,
   13 HARD_LIGHT,
   14 VIVID_LIGHT,
   15 LINEAR_LIGHT,
   16 PIN_LIGHT,
   17 DIFFERENCE,
   18 EXCLUSION
 ```

 Switch both mixer and blendmode in realtime:

 ```
 mixer1.mixMode()       // shows mixmode (default 1, NORMAL)
 mixer1.mixMode(8)      // set MixMode to BOOM
 mixer1.blendMode(1)    // set blendmode to ADD (default)
 mixer1.blendMode(14)   // set blendmode to VIVID_LIGHT
 ```

 Move the pod up and down over time, or fade from source1 to source2 and back
 again.
 ```
 ar c = 0;
 setInterval( function() {
   c += 0.01
   mixer1.pod ( ( Math.sin(c) * 0.5 ) + 0.5 );
 })
 ```

 *
 * @example let myMixer = new Mixer( renderer, { source1: myVideoSource, source2: myOtherMixer });
 * @constructor Module#Mixer
 * @implements Module
 * @param renderer:GlRenderer
 * @param options:Object
 * @author Sense Studios
 */

 // of 18: 1 ADD (default), 2 SUBSTRACT, 3 MULTIPLY, 4 DARKEN, 5 COLOUR BURN,
 // 6 LINEAR_BURN, 7 LIGHTEN,  8 SCREEN, 9 COLOUR_DODGE, 10 LINEAR_DODGE,
 // 11 OVERLAY, 12 SOFT_LIGHT, 13 HARD_LIGHT, 14 VIVID_LIGHT, 15 LINEAR_LIGHT,
 // 16 PIN_LIGHT, 17 DIFFERENCE, 18 EXCLUSION

 // of 8 1: NORMAL, 2: HARD, 3: NAM, 4: FAM, 5: LEFT, 6: RIGHT, 7: CENTER, 8: BOOM

/*
  class Polygon extend Shape {
    constructor(height, width) {
      this.x = super.x
      this.y = super.y
      this.height = height;
      this.width = width;
    }

    get area() {
      return this.calcArea()
    }

    // klass.area

    set area(a) {
   }

    // klass.area = 2

    calcArea() {
      return this.height * this.width;
    }

    // klass.calcArea( ... )

    static info() {
      return "lalalala info"
    }

    // Class.info()
  }
*/

var Mixer = class {

  static function_list() {
    return [["BLEND", "method","blendMode"], ["MIX", "method","mixMode"], ["POD", "set", "pod"] ]
  }

  constructor( renderer, options ) {

    // create and instance
    var _self = this;
    if (renderer == undefined) return

    // set or get uid
    if ( options.uuid == undefined ) {
      _self.uuid = "Mixer_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
    } else {
      _self.uuid = options.uuid
    }

    // add to renderer
    renderer.add(_self)

    // set options
    var _options;
    if ( options != undefined ) _options = options

    // set type
    _self.type = "Module";

    // add local variables
    var alpha1 = 1;
    var alpha2 = 0;
    var pod = 0;

    // hoist an own bpm here
    var currentBPM = 128
    var currentMOD = 1
    var currentBpmFunc = function() { return currentBPM; }
    _self.autoFade = false
    _self.fading = false

    var mixmode = 1;
    _self.mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

    var blendmode = 1;
    _self.blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ];

    var source1, source2;
    source1 = options.source1 //|| options.src1;   // Mandatory
    source2 = options.source2 //|| options.src2;   // Mandatory

    _self.init = function() {

      // add uniforms to renderer
      renderer.customUniforms[_self.uuid+'_mixmode'] = { type: "i", value: 1 }
      renderer.customUniforms[_self.uuid+'_blendmode'] = { type: "i", value: 1 }
      //renderer.customUniforms[_self.uuid+'_pod'] = { type: "f", value: 0.5 }
      renderer.customUniforms[_self.uuid+'_alpha1'] = { type: "f", value: 0.5 }
      renderer.customUniforms[_self.uuid+'_alpha2'] = { type: "f", value: 0.5 }
      renderer.customUniforms[_self.uuid+'_sampler'] = { type: "t", value: null }

      // add uniforms to fragmentshader
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_mixmode;\n/* custom_uniforms */')
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_blendmode;\n/* custom_uniforms */')
      //renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_pod;\n/* custom_uniforms */')
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha1;\n/* custom_uniforms */')
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha2;\n/* custom_uniforms */')
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')

      // add blendmodes helper, we only need it once
      if ( renderer.fragmentShader.indexOf('vec4 blend ( vec4 src, vec4 dst, int blendmode )') == -1 ) {
        renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_helpers */',
  `
  vec4 blend ( vec4 src, vec4 dst, int blendmode ) {
    if ( blendmode ==  1 ) return src + dst;
    if ( blendmode ==  2 ) return src - dst;
    if ( blendmode ==  3 ) return src * dst;
    if ( blendmode ==  4 ) return min(src, dst);
    if ( blendmode ==  5)  return vec4((src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z)),1.0);
    if ( blendmode ==  6 ) return (src + dst) - 1.0;
    if ( blendmode ==  7 ) return max(src, dst);
    if ( blendmode ==  8 ) return (src + dst) - (src * dst);
    if ( blendmode ==  9 ) return vec4((src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z)), 1.0);
    if ( blendmode == 10 ) return src + dst;
    if ( blendmode == 11 ) return vec4((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)), 1.0);
    if ( blendmode == 12 ) return vec4((src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z))), 1.0);
    if ( blendmode == 13 ) return vec4((src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)), (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z)), 1.0);
    if ( blendmode == 14 ) return vec4((src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z))),1.0);
    if ( blendmode == 15 ) return 2.0 * src + dst - 1.0;
    if ( blendmode == 16 ) return vec4((src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), (src.x > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z),1.0);
    if ( blendmode == 17 ) return abs(dst - src);
    if ( blendmode == 18 ) return src + dst - 2.0 * src * dst;
    return src + dst;
  }
  /* custom_helpers */
  `
        );
      }

      var shadercode = ""
      shadercode += "vec4 "+_self.uuid+"_output = vec4( blend( "
      shadercode += source1.uuid+"_output * "+_self.uuid+"_alpha1, "
      shadercode += source2.uuid+"_output * "+_self.uuid+"_alpha2, "
      shadercode += _self.uuid+"_blendmode ) "
      shadercode += ")"
      shadercode += " + vec4(  "+source1.uuid+"_output.a < 1.0 ? "+source2.uuid+"_output.rgba * ( "+_self.uuid+"_alpha1 - "+source1.uuid+"_output.a ) : vec4( 0.,0.,0.,0. )  ) "
      shadercode += " + vec4(  "+source2.uuid+"_output.a < 1.0 ? "+source1.uuid+"_output.rgba * ( "+_self.uuid+"_alpha2 - - "+source2.uuid+"_output.a ) : vec4( 0.,0.,0.,0. )  ) "
      shadercode += ";\n"
      shadercode += "  /* custom_main */  "

      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', shadercode )
    }

    // autofade bpm
    var starttime = (new Date()).getTime()
    var c = 0
    var cnt = 0

    // fade time
    var fadeAtTime = 0
    var fadeTime = 0
    var fadeTo = "b"
    var fadeDuration = 0

    /** @function Addon#Mixer~update */

    /**
     * @description
     *  binds _currentBpmFunc_ to a function
     *  whatever BPM _currentBpmFunc_ returns will be bpm used.
     *  it's called on update
     * @example
     *   var mixer1 = new Mixer( renderer, { source1: file, source2: file})
     *   var audioanalysis = new AudioAnalysis( renderer, { audio: file })
     *   audioanalysis.bindBPM( audioanalysis.getBPM() * 0.5 )
     * @function Module#Mixer#bindBpm
     * @param {function} binding allows for overriding internal bpm
     */

    _self.update = function() {

      if ( _self.autoFade ) { // maybe call this bpmFollow?
        // pod = currentBPM
        currentBPM = currentBpmFunc()
        c = ((new Date()).getTime() - starttime) / 1000;
        _self.pod( ( Math.sin( c * Math.PI * currentBPM * currentMOD / 60 ) / 2 + 0.5 ) )
      }

      if ( _self.fading ) { // then call this autoFade

        var now = (new Date()).getTime()
        fadeAtTime = (fadeTime - now);
        var _num = fadeAtTime/fadeDuration
        if (fadeTo =="b") _num = Math.abs(_num - 1)
        //console.log("fader...", _num, Math.abs(_num - 1), fadeAtTime, fadeTime, now, fadeDuration, fadeTo)
        if (_num < 0 ) _num = 0
        if (_num > 1 ) _num = 1

        _self.pod( _num )

        if ( fadeAtTime < 0 ) {
          _self.fading = false

          // allstop
          _num = Math.round(_num)
          _self.pod(_num)
        }
      }
    }

    /** @function Addon#Mixer~render */
    _self.render = function() {
      return pod
    }

    // ---------------------------------------------------------------------------
    // HELPERS
    // ---------------------------------------------------------------------------

    // you shouldnt be able to set these directly
    _self.alpha1 = function() { return alpha1 }
    _self.alpha2 = function() { return alpha2 }

    /**
     * @function Module#Mixer#mixMode
     * @param {integer} mixmode index of the Mixmode
     *
     * @description
     *  gets or sets the _mixMode_, there are 8 MixModes available, numbered 1-9;
     *  ```
     *  1: NORMAL (default),   regular, linear crossfade
     *  2: HARD,               switches with a hard cut at 50%
     *  3: NAM,                fades with an upward curvature forcing 100% opacity throughout the crossfade (lighter!)
     *  4: FAM,                fades with a downward curve, forcing a 'overlay' period
     *  5: NON DARK,           Never goes dark, 0-2 linear curve, capped at 1 and .36
     *  6: LEFT,               forces the pod on 0 (locks pod)
     *  7: RIGHT,              forces the pod on 1 (locks pod)
     *  8: CENTER,             forces both sources at ~66% (locks pod)
     *  9: BOOM                forces both sources at 100%, allows for overflow (lighter!) (locks pod)
     *  ```
     *
    */
    _self.mixMode = function( _num ) {
      if ( _num != undefined ) { mixmode = _num }
      return mixmode
    }

    /**
     * @description
     *  gets or sets the _blendMode_, there are 18 Blendmodes available, numbered 1-18;
     *  ```
     *  1 ADD (default),
     *  2 SUBSTRACT,
     *  3 MULTIPLY,
     *  4 DARKEN,
     *  5 COLOUR BURN,
     *  6 LINEAR_BURN,
     *  7 LIGHTEN,
     *  8 SCREEN,
     *  9 COLOUR_DODGE,
     *  10 LINEAR_DODGE,
     *  11 OVERLAY,
     *  12 SOFT_LIGHT,
     *  13 HARD_LIGHT,
     *  14 VIVID_LIGHT,
     *  15 LINEAR_LIGHT,
     *  16 PIN_LIGHT,
     *  17 DIFFERENCE,
     *  18 EXCLUSION
     *  ```
     * @function Module#Mixer#blendMode
     * @param {integer} blendmode index of the Blendmode
    */
    _self.blendMode = function( _num ) {
      if ( _num != undefined ) {
        blendmode = _num
        renderer.customUniforms[_self.uuid+'_blendmode'].value = blendmode
      }
      _self.pod( _self.pod() ) // update pod, precaution
      return blendmode
    }

    /**
     * @description the position of the handle, fader or pod. 0 is left, 1 is right
     * @function Module#Mixer#pod
     * @param {float} position position of the handle
     */
    _self.pod = function( _num ) {
      //console.log("---> POD:", _num)
      if ( _num != undefined ) {

        // set pod position
        pod = _num

        // evaluate current mix style
        // MIXMODE 1 normal mix
        if (mixmode == 1) {
          alpha1 = pod
          alpha2 = 1 - pod
        }

        // MIXMODE 2 hard mix
        if (mixmode == 2) {
          alpha1 = Math.round( pod )
          alpha2 = Math.round( 1-pod )
        }

        // MIXMODE 3 NAM mix
        if (mixmode == 3) {
          alpha1 = ( pod * 2 );
          alpha2 = 2 - ( pod * 2 );
          if ( alpha1 > 1 ) alpha1 = 1;
          if ( alpha2 > 1 ) alpha2 = 1;
        }

        // MIXMODE 4 FAM mix
        if (mixmode == 4) {
          alpha1 = ( pod * 2 );
          alpha2 = 2 - ( pod * 2 );
        }

        // MIXMODE 5 Non Dark mix
        if (mixmode == 5) {
          alpha1 = ( pod * 2 );
          alpha2 = 2 - ( pod * 2 );
          if ( alpha1 > 1 ) alpha1 = 1;
          if ( alpha2 > 1 ) alpha2 = 1;
          alpha1 += 0.36;
          alpha2 += 0.36;
        }

        // MIXMODE 6 left
        if (mixmode == 6) {
          alpha1 = 1;
          alpha2 = 0;
        }

        // MIXMODE 7 right
        if (mixmode == 7) {
          alpha1 = 0;
          alpha2 = 1;
        }

        // MIXMODE 8 center
        if (mixmode == 8) {
          alpha1 = 0.5;
          alpha2 = 0.5;
        }

        // MIXMODE 9 BOOM
        if (mixmode == 9) {
          alpha1 = 1;
          alpha2 = 1;
        }

        // DEPRICATED BECAUSE OF actual ALPHA
        // MIXMODE X ADDITIVE MIX LEFT (use with lumkey en chromkey)
        if (mixmode == 10 ) {
          alpha1 = pod
          alpha2 = 1;
        }

        // MIXMODE X ADDITIVE MIX RIGHT (use with lumkey en chromkey)
        if (mixmode == 11 ) {
          alpha1 = 1;
          alpha2 = pod
        }

        // send alphas to the shader
        renderer.customUniforms[_self.uuid+'_alpha1'].value = alpha1;
        renderer.customUniforms[_self.uuid+'_alpha2'].value = alpha2;
      }
      return pod;
    }

    /**
     * @description
     *  gets or sets the _bpm_ or beats per minutes, locally in this mixer
     *  defaults to 128
     * @function Module#Mixer#bpm
     * @param {number} bpm beats per minute
    */
    _self.bpm = function(_num) {
        if ( _num  != undefined ) currentBPM = _num
        return currentBPM
    }

    /**
     * @description
     *  gets or sets the _currentMOD_ or modifyer for the bpm
     *  this way you can modify the actual tempo, make the beats
     *  follow on half speed, or dubbel speed or *4, *2, /2, /4 etc.
     * @function Module#Mixer#bpmMod
     * @param {number} currentMod beat multiplyer for tempo
    */
    _self.bpmMod = function( _num ) {
      if ( _num  != undefined ) currentMOD = _num
      return currentMOD
    }

    /**
     * @description
     *  binds _currentBpmFunc_ to a function
     *  whatever BPM _currentBpmFunc_ returns will be bpm used.
     *  it's called on update
     * @example
     *   var mixer1 = new Mixer( renderer, { source1: file, source2: file})
     *   var audioanalysis = new AudioAnalysis( renderer, { audio: file })
     *   audioanalysis.bindBPM( audioanalysis.getBPM() * 0.5 )
     * @function Module#Mixer#bindBpm
     * @param {function} binding allows for overriding internal bpm
     */
    _self.bindBpm = function( _func ) {
        currentBpmFunc = _func
    }

    /**
     * @description
     *  sets setAutoFade true/false
     * @function Module#Mixer#setAutoFade
     * @param {boolean} autoFade to do, or do not
    */
    _self.setAutoFade = function( _bool ) {
      if ( _bool.toLowerCase() == "true" ) _self.autoFade = true
      if ( _bool.toLowerCase() == "false" ) _self.autoFade = false
    }

    /**
     * @description
     *  fades from one channel to the other in _duration_ milliseconds
     * @function Module#Mixer#fade
     * @param {float} fadeDuration the duration of the fade
    */
    _self.fade = function( _duration ) {
      var current = _self.pod()

      // starts the loop
      _self.fading = true

      var now = (new Date()).getTime()
      fadeTime = ( now + _duration );
      _self.pod() > 0.5 ? fadeTo = "a" : fadeTo = "b"
      console.log("fadeTo", fadeTo, fadeTime, now, _duration)
      fadeDuration = _duration
    }
  }
}
