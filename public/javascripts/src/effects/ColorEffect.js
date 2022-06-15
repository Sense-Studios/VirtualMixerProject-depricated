ColorEffect.prototype = new Effect(); // assign prototype to marqer
ColorEffect.constructor = ColorEffect;  // re-assign constructor

/**
 * @summary
 *   The color effect has a series of color effects, ie. implements a series of operations on rgba
 *   Effects Example on codepen:
 *   <a href="https://codepen.io/xangadix/pen/eXLGwJ" target="_blank">codepen</a>
 *
 *
 * @description
 *   Color effect allows for a series of color effect, mostly
 *   mimicing classic mixers like MX50 and V4
 *  ```
 *  1. Normal (default),
 *
 *  //  negatives
 *  2. Negative 1,
 *  3. Negative 2,
 *  4. Negative 3,
 *  5. Negative 4,
 *  6. Negative 5,
 *
 *  // monocolors
 *  10. Monocolor red,
 *  11. Monocolor blue,
 *  12. Monocolor green,
 *  13. Monocolor yellow,
 *  14. Monocolor turqoise,
 *  15. Monocolor purple,
 *  16. Sepia,
 *  17. Sepia,
 *
 *  // color swapping
 *  [20-46], swaps colors like rgb => gbg => rga => etc.
 *
 *  // keying, use extra(float) for finetuning
 *  50. Luma key (black key, white key?)
 *  51. Green key
 *
 *  // old school, use extra(float) for finetuning
 *  52. Paint
 *  53. Colorize
 *
 *  // image processing ( http://blog.ruofeidu.com/postprocessing-brightness-contrast-hue-saturation-vibrance/ )
 *  60. Brightness
 *  61. Contrast
 *  62. Saturation
 *  63. Hue
 *  64. Hard black edge. black/white.

    70. CCTV

 *  ```


 *
 * @example
 *   let myEffect = new ColorEffect( renderer, { source: myVideoSource, effect: 1 });
 *
 * @constructor Effect#ColorEffect
 * @implements Effect
 * @param renderer:GlRenderer
 * @param options:Object
 * @author Sense Studios
 */
function ColorEffect( _renderer, _options ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( _options.uuid == undefined ) {
    _self.uuid = "ColorEffect_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = _options.uuid
  }

  // add to renderer
  _renderer.add(_self)

  _self.type = "Effect"
  _self.debug = false

  var source = _options.source // mandatory
  var currentEffect = 1
  if ( _options.effect != undefined ) currentEffect = _options.effect
  var currentExtra = 0.8
  if ( _options.extra != undefined ) currentExtra = _options.currentExtra

  _self.init = function() {
    // add uniforms to renderer
    _renderer.customUniforms[_self.uuid+'_currentcoloreffect'] = { type: "i", value: currentEffect}
    _renderer.customUniforms[_self.uuid+'_extra'] = { type: "f", value: currentExtra }

    // add uniforms to fragmentshader
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_currentcoloreffect;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_extra;\n/* custom_uniforms */')

    if ( renderer.fragmentShader.indexOf('vec4 coloreffect ( vec4 src, int currentcoloreffect, float extra, vec2 vUv )') == -1 ) {
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_helpers */',
`
/*
float rand ( float seed ) {
  return fract(sin(dot(vec2(seed) ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 displace(vec2 co, float seed, float seed2) {
  vec2 shift = vec2(0);
  if (rand(seed) > 0.5) {
      shift += 0.1 * vec2(2. * (0.5 - rand(seed2)));
  }
  if (rand(seed2) > 0.6) {
      if (co.y > 0.5) {
          shift.x *= rand(seed2 * seed);
      }
  }
  return shift;
}

vec4 interlace(vec2 co, vec4 col) {
  if (int(co.y) % 3 == 0) {
      return col * ((sin(time * 4.) * 0.1) + 0.75) + (rand(time) * 0.05);
  }
  return col;
}
*/

vec4 coloreffect ( vec4 src, int currentcoloreffect, float extra, vec2 vUv ) {
  if ( currentcoloreffect == 1 ) return vec4( src.rgba );                                                                                              // normal

  // negative
  // negative 3 (reversed channel)
  if ( currentcoloreffect == 2  ) return vec4( 1.-src.r, 1.-src.g, 1.-src.b, src.a );
  // negative 3 (inverted channel high)
  if ( currentcoloreffect == 3  ) return vec4( 1./src.r-1.0, 1./src.g-1.0, 1./src.b-1.0, src.a );
  // negative 3 (inverted channel, low)
  if ( currentcoloreffect == 4  ) return vec4( 1./src.r-2.0, 1./src.g-2.0, 1./src.b-2.0, src.a );
  // negative 4 (inverted colors, inverted bw )
  if ( currentcoloreffect == 5  ) return vec4( src.g + src.b / 2., src.r + src.b / 2., src.r + src.b / 2., src.a );
  // negative 5 (normal colors, inverted b/w)
  if ( currentcoloreffect == 6  ) return vec4( ( (src.r/2.) + ( ( ( (vec3( src.r + src.g + src.b ) / 3.) * -1.) + 1. ).r) ), ( (src.g/2.) + (( ( (vec3( src.r + src.g + src.b ) / 3.) * -1.) + 1. ).g) ), ( (src.b/2.) + ( ( ( (vec3( src.r + src.g + src.b ) / 3.) * -1.) + 1. ).b) ), src.a );

  // monocolor
  if ( currentcoloreffect == 10 ) return vec4( vec3( src.r + src.g + src.b ) / 3., src.a );                                                            // black and white
  if ( currentcoloreffect == 11 ) return vec4( vec3( (src.r+src.g+src.b) *3.  , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) /1.7 ) / 3., src.a );  // mopnocolor red
  if ( currentcoloreffect == 12 ) return vec4( vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  *3.  , (src.r+src.g+src.b) /1.7 ) / 3., src.a );  // mopnocolor blue
  if ( currentcoloreffect == 13 ) return vec4( vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) *3.  ) / 3., src.a );  // mopnocolor green
  if ( currentcoloreffect == 14 ) return vec4( vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) /1.2 ) / 3., src.a );  // mopnocolor yellow
  if ( currentcoloreffect == 15 ) return vec4( vec3( (src.r+src.g+src.b) *1.2 , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) *2.  ) / 3., src.a );  // mopnocolor turqoise
  if ( currentcoloreffect == 16 ) return vec4( vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  /1.2 , (src.r+src.g+src.b) *2.  ) / 3., src.a );  // mopnocolor purple
  if ( currentcoloreffect == 17 ) return vec4( vec3( src.r + src.g + src.b ) / 3. * vec3( 1.2, 1.0, 0.8 ), src.a);                                     // sepia

  // color swapping
  if ( currentcoloreffect == 20 ) return vec4( src.rrra );
  if ( currentcoloreffect == 21 ) return vec4( src.rrga );
  if ( currentcoloreffect == 22 ) return vec4( src.rrba );
  if ( currentcoloreffect == 23 ) return vec4( src.rgra );
  if ( currentcoloreffect == 24 ) return vec4( src.rgga );
  if ( currentcoloreffect == 25 ) return vec4( src.rbra );
  if ( currentcoloreffect == 26 ) return vec4( src.rbga );
  if ( currentcoloreffect == 27 ) return vec4( src.rbba );
  if ( currentcoloreffect == 28 ) return vec4( src.grra );
  if ( currentcoloreffect == 29 ) return vec4( src.grga );
  if ( currentcoloreffect == 30 ) return vec4( src.grba );
  if ( currentcoloreffect == 31 ) return vec4( src.ggra );
  if ( currentcoloreffect == 32 ) return vec4( src.ggga );
  if ( currentcoloreffect == 33 ) return vec4( src.ggba );
  if ( currentcoloreffect == 34 ) return vec4( src.gbra );
  if ( currentcoloreffect == 35 ) return vec4( src.gbga );
  if ( currentcoloreffect == 36 ) return vec4( src.gbba );
  if ( currentcoloreffect == 37 ) return vec4( src.brra );
  if ( currentcoloreffect == 38 ) return vec4( src.brga );
  if ( currentcoloreffect == 39 ) return vec4( src.brba );
  if ( currentcoloreffect == 40 ) return vec4( src.bgra );
  if ( currentcoloreffect == 41 ) return vec4( src.bgga );
  if ( currentcoloreffect == 42 ) return vec4( src.bgba );
  if ( currentcoloreffect == 43 ) return vec4( src.bbra );
  if ( currentcoloreffect == 44 ) return vec4( src.bbga );
  if ( currentcoloreffect == 45 ) return vec4( src.bbba );

  // lum key
  if ( currentcoloreffect == 50 ) {
    float red = clamp( src.r, extra, 1.) == extra ? .0 : src.r;
    float green = clamp( src.g, extra, 1.) == extra ? .0 : src.g;
    float blue = clamp( src.b, extra, 1.) == extra ? .0 : src.b;
    float alpha = red + green + blue == .0 ? .0 : src.a;
    return vec4( red, green, blue, alpha );
  }

  // color key; Greenkey
  if ( currentcoloreffect == 51 ) {
    return vec4( src.r, clamp( src.r, extra, 1.) == extra ? .0 : src.g, src.b, clamp( src.r, extra, 1.) == extra ? .0 : src.a );
  }

  // paint
  if ( currentcoloreffect == 52 ) {
    // return vec4( floor( src.r * extra ) / extra, floor( src.g * extra ) / extra, floor( src.b * extra ) / extra, src.a  );
    // devide the image up in color bars
    vec4 pnt = vec4(
      src.x < .1 ? .1 : src.x < .2 ? .2 : src.x < .3 ? .3 : src.x < .4 ? .4 : src.x < .5 ? .5 : src.x < .6 ? .6 : src.x < .7 ? .7 : src.x < .8 ? .8 : src.x < .9 ? .9 : src.x,
      src.y < .1 ? .1 : src.y < .2 ? .2 : src.y < .3 ? .3 : src.y < .4 ? .4 : src.y < .5 ? .5 : src.y < .6 ? .6 : src.y < .7 ? .7 : src.y < .8 ? .8 : src.y < .9 ? .9 : src.y,
      src.z < .1 ? .1 : src.z < .2 ? .2 : src.z < .3 ? .3 : src.z < .4 ? .4 : src.z < .5 ? .5 : src.z < .6 ? .6 : src.z < .7 ? .7 : src.z < .8 ? .8 : src.z < .9 ? .9 : src.z,
      src.a
    );

    return pnt;
  }

  // colorise
  if ( currentcoloreffect == 53 ) {

    // TODO: mix paint and colorize together?

    // devide the image up in color bars
    vec4 pnt = vec4(
      src.x < .1 ? .1 : src.x < .2 ? .2 : src.x < .3 ? .3 : src.x < .4 ? .4 : src.x < .5 ? .5 : src.x < .6 ? .6 : src.x < .7 ? .7 : src.x < .8 ? .8 : src.x < .9 ? .9 : src.x,
      src.y < .1 ? .1 : src.y < .2 ? .2 : src.y < .3 ? .3 : src.y < .4 ? .4 : src.y < .5 ? .5 : src.y < .6 ? .6 : src.y < .7 ? .7 : src.y < .8 ? .8 : src.y < .9 ? .9 : src.y,
      src.z < .1 ? .1 : src.z < .2 ? .2 : src.z < .3 ? .3 : src.z < .4 ? .4 : src.z < .5 ? .5 : src.z < .6 ? .6 : src.z < .7 ? .7 : src.z < .8 ? .8 : src.z < .9 ? .9 : src.z,
      src.a
    );

    // colorize effect, fill the colors with random values
    ( pnt.r == .1 || pnt.g == .1 || pnt.b == .1 ) ? pnt.rgb = vec3( 1.0, 0.0, 0.0) : pnt.rgb;
    ( pnt.r == .2 || pnt.g == .2 || pnt.b == .2 ) ? pnt.rgb = vec3( 0.0, 1.0, 0.0) : pnt.rgb;
    ( pnt.r == .3 || pnt.g == .3 || pnt.b == .3 ) ? pnt.rgb = vec3( 0.0, 0.0, 1.0) : pnt.rgb;
    ( pnt.r == .4 || pnt.g == .4 || pnt.b == .4 ) ? pnt.rgb = vec3( 1.0, 1.0, 0.0) : pnt.rgb;
    ( pnt.r == .5 || pnt.g == .5 || pnt.b == .5 ) ? pnt.rgb = vec3( 0.0, 1.0, 1.0) : pnt.rgb;
    ( pnt.r == .6 || pnt.g == .6 || pnt.b == .6 ) ? pnt.rgb = vec3( 1.0, 0.0, 1.0) : pnt.rgb;
    ( pnt.r == .7 || pnt.g == .7 || pnt.b == .7 ) ? pnt.rgb = vec3( 1.0, 0.49, 0.49) : pnt.rgb;
    ( pnt.r == .8 || pnt.g == .8 || pnt.b == .8 ) ? pnt.rgb = vec3( 0.49, 1.0, 0.49) : pnt.rgb;
    ( pnt.r == .9 || pnt.g == .9 || pnt.b == .9 ) ? pnt.rgb = vec3( 0.49, 0.49, 1.0) : pnt.rgb;

    return pnt;
  }

  // BRIGHTNESS [ 0 - 1 ]
  // http://blog.ruofeidu.com/postprocessing-brightness-contrast-hue-saturation-vibrance/
  if ( currentcoloreffect == 60 ) {
    return vec4( src.rgb + extra, src.a );
    //return vec4( src.rgb ^ (extra+1), src.a );
  }

  // CONTRAST [ 0 - 3 ]
  if ( currentcoloreffect == 61 ) {
    extra = extra * 3.;
    float t = 0.5 - extra * 0.5;
    src.rgb = src.rgb * extra + t;
    return vec4( src.rgb, src.a );
  }

  // SATURATION [ 0 - 5 ]
  if ( currentcoloreffect == 62 ) {
    extra = extra * 5.;
    vec3 luminance = vec3( 0.3086, 0.6094, 0.0820 );
    float oneMinusSat = 1.0 - extra;
    vec3 red = vec3( luminance.x * oneMinusSat );
    red.r += extra;

    vec3 green = vec3( luminance.y * oneMinusSat );
    green.g += extra;

    vec3 blue = vec3( luminance.z * oneMinusSat );
    blue.b += extra;

    return mat4(
      red,     0,
      green,   0,
      blue,    0,
      0, 0, 0, 1 ) * src;
  }

  // SHIFT HUE
  if ( currentcoloreffect == 63 ) {
    vec3 P = vec3(0.55735) * dot( vec3(0.55735), src.rgb );
    vec3 U = src.rgb - P;
    vec3 V = cross(vec3(0.55735), U);
    src.rgb = U * cos( extra * 6.2832) + V * sin( extra * 6.2832) + P;
    return src;
  }

  // hard black edge
  if ( currentcoloreffect == 64 ) {
    src.r + src.g + src.b > extra * 3.0? src.rgb = vec3( 1.0, 1.0, 1.0 ) : src.rgb = vec3( 0.0, 0.0, 0.0 );
    return src;
  }

  // greenkey
  if ( currentcoloreffect == 80 ) {
    float temp_g = src.g;

    //if ( src.g > 0.99 ) { // 135
    if ( src.g > 0.2 && src.r < 0.2 && src.b < 0.2 ){
      src.r = 0.0;
      src.g = 0.0;
      src.b = 0.0;
      src.a = 0.0;
    }

    if ( src.g > 0.2 && src.r < 0.2 && src.b < 0.2 ){
      src.r + src.g + src.b > extra * 3.0? src.rgb = vec3( 1.0, 1.0, 1.0 ) : src.rgb = vec3( 0.0, 0.0, 0.0 );
    }


    float maxrb = max( src.r, src.b );
    float k = clamp( (src.g-maxrb)*5.0, 0.0, 1.0 );

    //float ll = length( src );
    //src.g = min( src.g, maxrb*0.8 );
    //src = ll*normalize(src);

    return vec4( mix(src.xyz, vec3(0.0, 0.0, 0.0), k), src.a );

    //return vec4( src.xyz, src.a );
    //return src;
  }

  // greenkey 2
  if ( currentcoloreffect == 81 ) {

    float maxrb = max( src.r, src.b );
    float k = clamp( (src.g-maxrb)*5.0, 0.0, 1.0 );

    //

    //float ll = length( src );
    //src.g = min( src.g, maxrb*0.8 );
    //src = ll*normalize(src);

    //else

    //float dg = src.g;
    //src.g = min( src.g, maxrb*0.8 );
    //src += dg - src.g;

    //#endif

    vec3 bg = src.xyz;
    bg.r = 0.0;
    bg.g = 0.0;
    bg.b = 0.0;

    return vec4( mix(src.xyz, bg, k), mix( 1.0, 0.0, k) );
    //return src;
  }

  if ( currentcoloreffect == 70 ) {
    return src;
  }





  // default
  return src;
}

/* custom_helpers */
`
    );
  }

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_main */', '\
vec4 '+_self.uuid+'_output = coloreffect( '+source.uuid+'_output, ' + _self.uuid+'_currentcoloreffect' + ', '+ _self.uuid+'_extra' +', vUv );\n  /* custom_main */');
  } // init

  _self.update = function() {}

  /* ------------------------------------------------------------------------ */

  /**
   * @description
   *  gets or sets the _effect_, there are 11 color EFFECTS available, numbered 1-11;
   *  ```
   *  1. Normal (default),
   *
   *  //  negatives
   *  2. Negative 1,
   *  3. Negative 2,
   *  4. Negative 3,
   *  5. Negative 4,
   *  6. Negative 5,
   *
   *  // monocolors
   *  10. Monocolor red,
   *  11. Monocolor blue,
   *  12. Monocolor green,
   *  13. Monocolor yellow,
   *  14. Monocolor turqoise,
   *  15. Monocolor purple,
   *  16. Sepia,
   *  17. Sepia,
   *
   *  // color swapping
   *  [20-46], swaps colors like rgb => gbg => rga => etc.
   *
   *  // other, use extra(float) for finetuning
   *  50. Luma key
   *  51. Green key
   *  52. Paint
   *  53. Colorize
   *  ```

   * @function Effect#ColorEffect#effect
   * @param {number} effect index of the effect
   */

   /**
    * @description currentColoreffect number
    * @function Effect#ColorEffect#effect
    * @param {Number} effectnumber currentColoreffect number 1
    */

  _self.effect = function( _num ){
    if ( _num != undefined ) {
      currentEffect = _num
      console.log("effect set to: ", currentEffect)
      renderer.customUniforms[_self.uuid+'_currentcoloreffect'].value = currentEffect
      // update uniform ?
    }

    return currentEffect
  }

  /**
   * @description the extra, for several effects
   * @function Effect#ColorEffect#extra
   * @param {float} floatValue between 0 and 1
   */

  _self.extra = function( _num ){
    if ( _num != undefined ) {
      currentExtra = _num
      renderer.customUniforms[_self.uuid+'_extra'].value = currentExtra
      // update uniform ?
    }

    if (_self.debug) console.log("extra set to: ", currentExtra)
    return currentExtra
  }
}
