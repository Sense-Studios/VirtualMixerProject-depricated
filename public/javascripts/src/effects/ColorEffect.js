ColorEffect.prototype = new Effect(); // assign prototype to marqer
ColorEffect.constructor = ColorEffect;  // re-assign constructor

/**
 * @summary
 *   The color effect has a series of simple color effects
 *
 * @description
 *   Color effect allows for a series of color effect, mostly
 *   mimicing classic mixers like MX50 and V4
<<<<<<< HEAD
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
=======
 *   ```
 *    1. black and white, 2. negative 1, 3. negative 2, 4. negative 3
 *    5. monocolor red, 6. monocolor blue 7. monocolor green, 8. monocolor yellow,
 *    9. monocolor turqoise, 10. monocolor purple, 11. sepia
 *   ```
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
 *
 * @example
 *   let myEffect = new ColorEffect( renderer, { source1: myVideoSource, effect: 1 });
 *
 * @constructor Effect#ColorEffect
 * @implements Effect
 * @param renderer:GlRenderer
 * @param options:Object
 * @author Sense Studios
 */

// fragment
// vec3 b_w = ( source.x + source.y + source.z) / 3
// vec3 amount = source.xyz + ( b_w.xyx * _alpha )
// col = vec3(col.r+col.g+col.b)/3.0;
// col = vec4( vec3(col.r+col.g+col.b)/3.0, _alpha );

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

  var source = _options.source
  var currentEffect = _options.effect
  var currentEffect = 1
  var currentExtra = 0.8

  _self.init = function() {
    // add uniforms to renderer
    _renderer.customUniforms[_self.uuid+'_currentcoloreffect'] = { type: "i", value: 1 }
    _renderer.customUniforms[_self.uuid+'_extra'] = { type: "f", value: 2.0 }

    // add uniforms to fragmentshader
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_currentcoloreffect;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_extra;\n/* custom_uniforms */')

    if ( renderer.fragmentShader.indexOf('vec4 coloreffect ( vec4 src, int currentcoloreffect, float extra, vec2 vUv )') == -1 ) {
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_helpers */',
`
vec4 coloreffect ( vec4 src, int currentcoloreffect, float extra, vec2 vUv ) {
  if ( currentcoloreffect == 1 ) return vec4( src.rgba );                                                                                              // normal

  // negative
  if ( currentcoloreffect == 2  ) return vec4( 1.-src.r, 1.-src.g, 1.-src.b, src.a );                                                                  // negtive 1
  if ( currentcoloreffect == 3  ) return vec4( 1./src.r-1.0, 1./src.g-1.0, 1./src.b-1.0, src.a );                                                      // negtive 2
  if ( currentcoloreffect == 4  ) return vec4( 1./src.r-2.0, 1./src.g-2.0, 1./src.b-2.0, src.a );                                                      // negtive 3
<<<<<<< HEAD
  if ( currentcoloreffect == 5  ) return vec3( src.g + src.b / 2., src.r + src.b / 2., src.r + src.b / 2. );                                           // negtive 4
  if ( currentcoloreffect == 6  )
    vec3 orig = src.rgb;
    vec3 bw = src.rgb = vec3( src.r + src.g + src.b ) / 3.;
    vec3 nega = ( bw.rgb * -1.) + 1.;
    return src.rgb = vec3(
        ( (orig.r/2.) + (nega.r) ),
        ( (orig.g/2.) + (nega.g) ),
        ( (orig.b/2.) + (nega.b) )
    );
  }


  // monocolor
  if ( currentcoloreffect == 10  ) return vec4( vec3( src.r + src.g + src.b ) / 3., src.a );                                                            // black and white
  if ( currentcoloreffect == 11 ) return vec4( vec3( (src.r+src.g+src.b) *3.  , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) /1.7 ) / 3., src.a );  // mopnocolor red
  if ( currentcoloreffect == 12  ) return vec4( vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  *3.  , (src.r+src.g+src.b) /1.7 ) / 3., src.a );  // mopnocolor blue
  if ( currentcoloreffect == 13  ) return vec4( vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) *3.  ) / 3., src.a );  // mopnocolor green
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
=======

  // monocolor
  if ( currentcoloreffect == 5  ) return vec4( vec3( src.r + src.g + src.b ) / 3., src.a );                                                            // black and white
  if ( currentcoloreffect == 6  ) return vec4( vec3( (src.r+src.g+src.b) *3.  , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) /1.7 ) / 3., src.a );  // mopnocolor red
  if ( currentcoloreffect == 7  ) return vec4( vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  *3.  , (src.r+src.g+src.b) /1.7 ) / 3., src.a );  // mopnocolor blue
  if ( currentcoloreffect == 8  ) return vec4( vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) *3.  ) / 3., src.a );  // mopnocolor green
  if ( currentcoloreffect == 9  ) return vec4( vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) /1.2 ) / 3., src.a );  // mopnocolor yellow
  if ( currentcoloreffect == 10 ) return vec4( vec3( (src.r+src.g+src.b) *1.2 , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) *2.  ) / 3., src.a );  // mopnocolor turqoise
  if ( currentcoloreffect == 11 ) return vec4( vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  /1.2 , (src.r+src.g+src.b) *2.  ) / 3., src.a );  // mopnocolor purple
  if ( currentcoloreffect == 12 ) return vec4( vec3( src.r + src.g + src.b ) / 3. * vec3( 1.2, 1.0, 0.8 ), src.a);                                     // sepia

  // color swapping
  if ( currentcoloreffect == 13 ) return vec4( src.rrra );
  if ( currentcoloreffect == 14 ) return vec4( src.rrga );
  if ( currentcoloreffect == 15 ) return vec4( src.rrba );
  if ( currentcoloreffect == 16 ) return vec4( src.rgra );
  if ( currentcoloreffect == 17 ) return vec4( src.rgga );
  if ( currentcoloreffect == 18 ) return vec4( src.rbra );
  if ( currentcoloreffect == 19 ) return vec4( src.rbga );
  if ( currentcoloreffect == 20 ) return vec4( src.rbba );
  if ( currentcoloreffect == 21 ) return vec4( src.grra );
  if ( currentcoloreffect == 22 ) return vec4( src.grga );
  if ( currentcoloreffect == 23 ) return vec4( src.grba );
  if ( currentcoloreffect == 24 ) return vec4( src.ggra );
  if ( currentcoloreffect == 25 ) return vec4( src.ggga );
  if ( currentcoloreffect == 26 ) return vec4( src.ggba );
  if ( currentcoloreffect == 27 ) return vec4( src.gbra );
  if ( currentcoloreffect == 28 ) return vec4( src.gbga );
  if ( currentcoloreffect == 29 ) return vec4( src.gbba );
  if ( currentcoloreffect == 30 ) return vec4( src.brra );
  if ( currentcoloreffect == 31 ) return vec4( src.brga );
  if ( currentcoloreffect == 32 ) return vec4( src.brba );
  if ( currentcoloreffect == 33 ) return vec4( src.bgra );
  if ( currentcoloreffect == 34 ) return vec4( src.bgga );
  if ( currentcoloreffect == 35 ) return vec4( src.bgba );
  if ( currentcoloreffect == 36 ) return vec4( src.bbra );
  if ( currentcoloreffect == 37 ) return vec4( src.bbga );
  if ( currentcoloreffect == 38 ) return vec4( src.bbba );

  // lum key
  if ( currentcoloreffect == 39 ) {
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
    float red = clamp( src.r, extra, 1.) == extra ? .0 : src.r;
    float green = clamp( src.g, extra, 1.) == extra ? .0 : src.g;
    float blue = clamp( src.b, extra, 1.) == extra ? .0 : src.b;
    float alpha = red + green + blue == .0 ? .0 : src.a;
    return vec4( red, green, blue, alpha );
  }

  // color key; Greenkey
<<<<<<< HEAD
  if ( currentcoloreffect == 51 ) {
=======
  if ( currentcoloreffect == 40 ) {
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
    return vec4( src.r, clamp( src.r, extra, 1.) == extra ? .0 : src.g, src.b, clamp( src.r, extra, 1.) == extra ? .0 : src.a );
  }

  // paint
<<<<<<< HEAD
  if ( currentcoloreffect == 52 ) {
=======
  if ( currentcoloreffect == 41 ) {
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
    //return vec4( floor( src.r * extra ) / extra, floor( src.g * extra ) / extra, floor( src.b * extra ) / extra, src.a  );
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
<<<<<<< HEAD
  if ( currentcoloreffect == 53 ) {
=======
  if ( currentcoloreffect == 42 ) {
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b

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

  // wipes (move these to mixer?)
  //if ( gl_FragCoord.x > 200.0 ) {
  //  return vec4(0.0,0.0,0.0,0.0);
  //}else {
  //  return src;
  //}
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
<<<<<<< HEAD
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

=======
   *  1. BlackAndWhite (default),
   *  2. Negative 1,
   *  3. Negative 2,
   *  4. Negative 3,
   *  5. Monocolor red,
   *  6. Monocolor blue,
   *  7. Monocolor green,
   *  8. Monocolor yellow,
   *  9. Monocolor turqoise,
   *  10. Monocolor purple,
   *  11. Sepia,
   *  ```
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
   * @function Effect#ColorEffect#effect
   * @param {number} effect index of the effect
   */

<<<<<<< HEAD
   /**
    * @description currentColoreffect number
    * @function Effect#ColorEffect#effect
    * @param {Number} effectnumber currentColoreffect number 1
    */
=======
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
  _self.effect = function( _num ){
    if ( _num != undefined ) {
      currentEffect = _num
      renderer.customUniforms[_self.uuid+'_currentcoloreffect'].value = currentEffect
      // update uniform ?
    }

    console.log("effect set to: ", currentEffect)
    return currentEffect
  }

<<<<<<< HEAD
  /**
   * @description the extra, for several effects
   * @function Effect#ColorEffect#extra
   * @param {float} floatValue between 0 and 1
   */
=======
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
  _self.extra = function( _num ){
    if ( _num != undefined ) {
      currentExtra = _num
      renderer.customUniforms[_self.uuid+'_extra'].value = currentExtra
      // update uniform ?
    }

    console.log("extra set to: ", currentExtra)
    return currentExtra
  }
}
