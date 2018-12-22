ColorEffect.prototype = new Effect(); // assign prototype to marqer
ColorEffect.constructor = ColorEffect;  // re-assign constructor

/**
 * @summary
 *   The color effect has a series of simple color effects
 *
 * @description
 *   Color effect allows for a series of color effect, mostly
 *   mimicing classic mixers like MX50 and V4
 *   ```
 *    1. black and white, 2. negative 1, 3. negative 2, 4. negative 3
 *    5. monocolor red, 6. monocolor blue 7. monocolor green, 8. monocolor yellow,
 *    9. monocolor turqoise, 10. monocolor purple, 11. sepia
 *   ```
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

  var dpr = window.devicePixelRatio;
  var textureSize = 128 * dpr;
  var data = new Uint8Array( textureSize * textureSize * 3 );
  //var dataTexture = new THREE.DataTexture( canvasElement );
  //var dataTexture = new THREE.DataTexture( data, textureSize, textureSize, THREE.RGBFormat );
  //dataTexture.minFilter = THREE.NearestFilter;
	//dataTexture.magFilter = THREE.NearestFilter;
	//dataTexture.needsUpdate = true;

  var canvasElement, canvasContext, tempTexture


  _self.init = function() {

    // create canvas
    canvasElement = document.createElement('canvas');
    canvasElement.width = 1024;
    canvasElement.height = 1024;
    canvasElementContext = canvasElement.getContext( '2d' );
    canvasElementContext.fillStyle = "#FF0000";
    canvasElementContext.fillRect( 0, 0, 500,500)

    console.log("ColorEffect inits, with", _renderer)
    // add uniforms to renderer
    _renderer.customUniforms[_self.uuid+'_currentcoloreffect'] = { type: "i", value: 100 }
    //_renderer.customUniforms[_self.uuid+'_currentcoloreffect'] = { type: "t", value: null }
    // _renderer.customUniforms[_self.uuid+'_effectsampler'] = { type: "t", value: tempTexture }
    //_renderer.customUniforms[_self.uuid+'_sampler'] = { type: "t", value: null }

    // add uniforms to fragmentshader
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_currentcoloreffect;\n/* custom_uniforms */')

    // _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_currentcoloreffect;\n/* custom_uniforms */')
    // _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D  '+_self.uuid+'_effectsampler;\n/* custom_uniforms */')
    // _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D  '+_self.uuid+'_noisesampler;\n/* custom_uniforms */')

    // uniform float noiseScale;
    // uniform float time;
    // uniform float baseSpeed;


    //_renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_output;\n/* custom_uniforms */')

    // _output * uuid_alpha_1
    // uuid_alpha_1 * -pod
    // uuid_alpha_2 * +pod
    if ( renderer.fragmentShader.indexOf('vec3 coloreffect ( vec3 src, int currentcoloreffect, vec2 vUv )') == -1 ) {
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_helpers */',
`
vec3 coloreffect ( vec3 src, int currentcoloreffect, vec2 vUv ) {
  if ( currentcoloreffect == 1  ) return vec3( src.r + src.g + src.b ) / 3.;                                                            // black and white
  if ( currentcoloreffect == 2  ) return vec3( 1.-src.r, 1.-src.g, 1.-src.b );                                                          // negtive 1
  if ( currentcoloreffect == 3  ) return vec3( 1./src.r-1.0, 1./src.g-1.0, 1./src.b-1.0 );                                              // negtive 2
  if ( currentcoloreffect == 4  ) return vec3( 1./src.r-2.0, 1./src.g-2.0, 1./src.b-2.0 );                                              // negtive 3
  if ( currentcoloreffect == 5  ) return vec3( (src.r+src.g+src.b) *3.  , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) /1.7 ) / 3.;  // mopnocolor red
  if ( currentcoloreffect == 6  ) return vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  *3.  , (src.r+src.g+src.b) /1.7 ) / 3.;  // mopnocolor blue
  if ( currentcoloreffect == 7  ) return vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) *3.  ) / 3.;  // mopnocolor green
  if ( currentcoloreffect == 8  ) return vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) /1.2 ) / 3.;  // mopnocolor yellow
  if ( currentcoloreffect == 9  ) return vec3( (src.r+src.g+src.b) *1.2 , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) *2.  ) / 3.;  // mopnocolor turqoise
  if ( currentcoloreffect == 10 ) return vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  /1.2 , (src.r+src.g+src.b) *2.  ) / 3.;  // mopnocolor purple
  if ( currentcoloreffect == 11 ) return vec3( src.r + src.g + src.b ) / 3. * vec3( 1.2, 1.0, 0.8 );                                    // sepia

  // color swapping
  if ( currentcoloreffect == 12 ) return vec3( src.rrr );
  if ( currentcoloreffect == 13 ) return vec3( src.rrg );
  if ( currentcoloreffect == 14 ) return vec3( src.rrb );
  if ( currentcoloreffect == 15 ) return vec3( src.rgr );
  if ( currentcoloreffect == 16 ) return vec3( src.rgg );
  if ( currentcoloreffect == 17 ) return vec3( src.rgb ); // normal
  if ( currentcoloreffect == 18 ) return vec3( src.rbr );
  if ( currentcoloreffect == 19 ) return vec3( src.rbg );
  if ( currentcoloreffect == 20 ) return vec3( src.rbb );
  if ( currentcoloreffect == 21 ) return vec3( src.grr );
  if ( currentcoloreffect == 22 ) return vec3( src.grg );
  if ( currentcoloreffect == 23 ) return vec3( src.grb );
  if ( currentcoloreffect == 24 ) return vec3( src.ggr );
  if ( currentcoloreffect == 25 ) return vec3( src.ggg );
  if ( currentcoloreffect == 26 ) return vec3( src.ggb );
  if ( currentcoloreffect == 27 ) return vec3( src.gbr );
  if ( currentcoloreffect == 28 ) return vec3( src.gbg );
  if ( currentcoloreffect == 29 ) return vec3( src.gbb );
  if ( currentcoloreffect == 30 ) return vec3( src.brr );
  if ( currentcoloreffect == 31 ) return vec3( src.brg );
  if ( currentcoloreffect == 32 ) return vec3( src.brb );
  if ( currentcoloreffect == 33 ) return vec3( src.bgr );
  if ( currentcoloreffect == 34 ) return vec3( src.bgg );
  if ( currentcoloreffect == 35 ) return vec3( src.bgb );
  if ( currentcoloreffect == 36 ) return vec3( src.bbr );
  if ( currentcoloreffect == 37 ) return vec3( src.bbg );
  if ( currentcoloreffect == 38 ) return vec3( src.bbb );
  return src.rgb;
}

/* custom_helpers */
`
    );
  }

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = coloreffect( '+source.uuid+'_output, ' + _self.uuid+'_currentcoloreffect' + ', vUv );\n  /* custom_main */')
  } // init


  var vector = new THREE.Vector2();
  //var glcanvas = document.getElementById('glcanvas');
  //var glcanvas = _renderer.glrenderer.context.canvas
  var i = 0
  _self.update = function() {
    i++
    // mixmode
    // blendmode
    // pod
    //console.log( "--", glcanvas.width, glcanvas.height )

    //glcanvas = _renderer.glrenderer.context.canvas
    //canvasElementContext.drawImage( glcanvas, Math.sin(i/20)*20-10, 1, glcanvas.width*1.0000000001, glcanvas.height*1.0000000001 );

    //vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
  	//vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );

    //_renderer.copyFramebufferToTexture( vector, dataTexture );

    glcanvas = document.getElementById('glcanvas');
    canvasElementContext.drawImage( glcanvas, 0,0, glcanvas.width, glcanvas.height );
    if ( tempTexture ) tempTexture.needsUpdate = true;
  }

  /* ------------------------------------------------------------------------ */

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
      renderer.customUniforms[_self.uuid+'_currentcoloreffect'].value = currentEffect
      // update uniform ?
    }
    return currentEffect
  }
}
