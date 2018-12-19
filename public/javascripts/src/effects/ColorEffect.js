/**
 * @summary
 *   The color effect has a series of simple color effects
 *
 * @description
 *   Color effect allows for a series of color effect, mostly
 *   mimicing classic mixers like MX50 and V4
 *   1. black and white, 2. negative 1, 3. negative 2, 4. negative 3
 *   5. monocolor red, 6. monocolor blue 7. monocolor green, 8. monocolor yellow,
 *   9. monocolor turqoise, 10. monocolor purple, 11. sepia
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
  var currentEffect = 12

  _self.init = function() {

    console.log("Effect inits, with", _renderer)
    // add uniforms to renderer
    // renderer.customUniforms[_self.uuid+'_mixmode'] = { type: "i", value: 1 }

    // add uniforms to fragmentshader
    // _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_mixmode;\n/* custom_uniforms */')

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    //_renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_output;\n/* custom_uniforms */')

    // _output * uuid_alpha_1
    // uuid_alpha_1 * -pod
    // uuid_alpha_2 * +pod

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_helpers */',
`
vec3 effect ( vec3 src, int coloreffect ) {
  if ( coloreffect == 1  ) return vec3( src.r + src.g + src.b ) / 3.;                                                            // black and white
  if ( coloreffect == 2  ) return vec3( 1.-src.r, 1.-src.g, 1.-src.b );                                                          // negtive 1
  if ( coloreffect == 3  ) return vec3( 1./src.r-1.0, 1./src.g-1.0, 1./src.b-1.0 );                                              // negtive 2
  if ( coloreffect == 4  ) return vec3( 1./src.r-2.0, 1./src.g-2.0, 1./src.b-2.0 );                                              // negtive 3
  if ( coloreffect == 5  ) return vec3( (src.r+src.g+src.b) *3.  , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) /1.7 ) / 3.;  // mopnocolor red
  if ( coloreffect == 6  ) return vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  *3.  , (src.r+src.g+src.b) /1.7 ) / 3.;  // mopnocolor blue
  if ( coloreffect == 7  ) return vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) *3.  ) / 3.;  // mopnocolor green
  if ( coloreffect == 8  ) return vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) /1.2 ) / 3.;  // mopnocolor yellow
  if ( coloreffect == 9  ) return vec3( (src.r+src.g+src.b) *1.2 , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) *2.  ) / 3.;  // mopnocolor turqoise
  if ( coloreffect == 10 ) return vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  /1.2 , (src.r+src.g+src.b) *2.  ) / 3.;  // mopnocolor purple
  if ( coloreffect == 11 ) return vec3( src.r + src.g + src.b ) / 3. * vec3( 1.2, 1.0, 0.8 );                                    // sepia
  // swap blue-green
  // swap red-green
  // swap blue-red
  if ( coloreffect == 12 ) {
    //vec3 VideoSource_deeb350_output = ( texture2D( VideoSource_deeb350, vUv ).xyz * VideoSource_deeb350_alpha );
    //vec3 result = ( texture2D( sampler2D(src), vec2(1.,1.) ).xyz * 1.);
    //return result;
    return src.rbg;
  }
  return src;
}

/* custom_helpers */
`
    );

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = effect( '+source.uuid+'_output, 12 );\n  /* custom_main */')
  } // init


  _self.update = function() {
    // mixmode
    // blendmode
    // pod
  }

  /**
   * @description
   *  gets or sets the _effect_, there are 11 color EFFECTS available, numbered 1-11;
   *  ```
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
   * @function Module#Mixer#effect
   * @param {number} effect index of the effect
   */

  _self.effect = function( _num ){
    if ( _num != undefined ) {
      currentEffect = _num
      // update uniform ?
    }
    return currentEffect
  }
}
