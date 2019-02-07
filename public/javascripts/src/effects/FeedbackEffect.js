FeedbackEffect.prototype = new Effect(); // assign prototype to marqer
FeedbackEffect.constructor = FeedbackEffect;  // re-assign constructor

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
 *   let myEffect = new FeedbackEffect( renderer, { source1: myVideoSource, effect: 1 });
 *
 * @constructor Effect#FeedbackEffect
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

function FeedbackEffect( _renderer, _options ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( _options.uuid == undefined ) {
    _self.uuid = "FeedbackEffect_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = _options.uuid
  }

  // add to renderer
  _renderer.add(_self)

  _self.type = "Effect"

  var source = _options.source
  var currentEffect = _options.effect
  var currentEffect = 12
<<<<<<< HEAD
  var currentExtra = 0.8

=======
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b

  var dpr = window.devicePixelRatio;
  var textureSize = 128 * dpr;
  var data = new Uint8Array( textureSize * textureSize * 3 );
  //var dataTexture = new THREE.DataTexture( canvasElement );
  //var dataTexture = new THREE.DataTexture( data, textureSize, textureSize, THREE.RGBFormat );
  //dataTexture.minFilter = THREE.NearestFilter;
	//dataTexture.magFilter = THREE.NearestFilter;
	//dataTexture.needsUpdate = true;

  var canvasElement, canvasContext, effectsTexture


  _self.init = function() {

    // create canvas
    canvasElement = document.createElement('canvas');
    canvasElement.width = 1024;
    canvasElement.height = 1024;
    canvasElementContext = canvasElement.getContext( '2d' );
<<<<<<< HEAD
    canvasElementContext.fillStyle = "#000000";
    canvasElementContext.fillRect( 0, 0, 1024,1024)
=======
    canvasElementContext.fillStyle = "#FF0000";
    canvasElementContext.fillRect( 0, 0, 500,500)
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b

    console.log("FeedbackEffect inits, with", _renderer)

    effectsTexture = new THREE.Texture( canvasElement );
    effectsTexture.wrapS = THREE.RepeatWrapping;
    effectsTexture.wrapT = THREE.RepeatWrapping;
    effectsTexture.repeat.set( 4, 4 );

    _renderer.customUniforms[_self.uuid+'_effectsampler'] = { type: "t", value: effectsTexture }
<<<<<<< HEAD
    _renderer.customUniforms[_self.uuid+'_currentfeedbackeffect'] = { type: "i", value: currentEffect }
    _renderer.customUniforms[_self.uuid+'_extra'] = { type: "i", value: currentExtra }
=======
    _renderer.customUniforms[_self.uuid+'_currentfeedbackeffect'] = { type: "i", value: 100 }
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D  '+_self.uuid+'_effectsampler;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int  '+_self.uuid+'_currentfeedbackeffect;\n/* custom_uniforms */')
<<<<<<< HEAD
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float  '+_self.uuid+'_extra;\n/* custom_uniforms */')
=======
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b


    if ( renderer.fragmentShader.indexOf('vec4 feedbackeffect ( vec4 src, int currentfeedbackeffect, vec2 vUv )') == -1 ) {

      _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_helpers */',
`
  vec4 feedbackeffect ( vec4 src, int currentfeedbackeffect, vec2 vUv ) {

    if ( currentfeedbackeffect == 100 ) {
      // vec4 inbetween = vec4( src.r, src.g, src.b, vUv * 0.9. );
      // gl_Position = vec4( vec2(0.,0.), 0., 0.);
      // return inbetween.rrr;
      // return src;

      // return vec4(0., 0., 1., 1.);

<<<<<<< HEAD
      vec2 wuv = vec2(0.,0.);
      // wuv = vUv * vec2( 1.0, 1.0 ) - vec2( 0., 0. );
      wuv = vUv; //* vec2( 1.0, 1.0 ) - vec2( 0., 0. );
      //wuv = vUv - vec2( 0.1, 0. );
      // wuv = vUv + vec2( extra, extra );
      // return texture2D( src, wuv ).rgba;

      return vec4( vec4( ( texture2D( `+_self.uuid+`_effectsampler, wuv ).rgba * 0.9 ) + (src.rgba * .6 ) ).rgb, 1.);

      // return ( texture2D( , vUv + vec2( 1., 0.99999999) ).rgba ) + src * 0.3;
=======
      return ( texture2D( `+_self.uuid+`_effectsampler, vUv + vec2( 1., 0.99999999) ).rgba ) + src * 0.3;
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b

      // return ( texture2D( `+_self.uuid+`_effectsampler, vUv  ).rgb * 1.4 + src * .8) * 0.5; //* vec3(.5, .5, .5
      // return ( texture2D( src, vUv ).rgb );
      // return ( texture2D( `+_self.uuid+`_effectsampler, vUv  ).rgb ) * src + src;

<<<<<<< HEAD
      //vec4 wuv = wuv = vUv * vec2( extra*6., extra*6. ) - vec2( extra * 3., extra * 3. );
      //vec4 tex = texture2D( `+_self.uuid+`_effectsampler, wuv ); //+ vec4( src.r, src.g, src.b, vUv * 2. );
=======
      vec4 tex = texture2D( `+_self.uuid+`_effectsampler, vUv * 2. ); //+ vec4( src.r, src.g, src.b, vUv * 2. );
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b

      // return src.rrr;
      // tex.rgb = vec3(src.r, src.g, src.b);
      // tex.xy = vec2(1.0,1.0);
      // tex = tex + vec4( src.r, src.g, src.b, vUv * 2. );


      // * 0.52 + vec4( src * 0.52, vUv ) *
      // vec4 tex = vec4( src, vUv * .5 );
      // return mix( tex, `+_self.uuid+`_effectsampler, 0.).rgb;
<<<<<<< HEAD
      // return mix(tex.rgb, src.rgb, 1.);
=======
      //return mix(tex.rgb, src.rgb, 1.);
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
    }

    // uniform float noiseScale;
    // uniform float time;
    // uniform float baseSpeed;
    // uniform sampler2D noiseTexture;

    if ( currentfeedbackeffect == 101 ) {
      // vec2 uvTimeShift = vUv + vec2( -0.7, 1.5 ) * time * baseSpeed;
      // vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );
      // vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.a );

      // _effectsampler
      // return  vec4 texture2D( baseTexture1, uvNoiseTimeShift )

      // https://stackoverflow.com/questions/19872524/threejs-fragment-shader-using-recycled-frame-buffers
      // http://labs.sense-studios.com/webgl/index4.html?r=sdad

      // return _effectsampler.rgb
      return src;
    }

    return src;
  }

  /* custom_helpers */
`
  );
}

_renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_main */', '\
vec4 '+_self.uuid+'_output = feedbackeffect( '+source.uuid+'_output, ' + _self.uuid+'_currentfeedbackeffect' + ', vUv );\n  /* custom_main */')
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
  // console.log( "--", glcanvas.width, glcanvas.height )

  // glcanvas = _renderer.glrenderer.context.canvas
  // canvasElementContext.drawImage( glcanvas, Math.sin(i/20)*20-10, 1, glcanvas.width*1.0000000001, glcanvas.height*1.0000000001 );

  // vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
  // vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );

  // _renderer.copyFramebufferToTexture( vector, dataTexture );

  glcanvas = document.getElementById('glcanvas');
<<<<<<< HEAD
  //glcanvas = renderer.glrenderer.getContext().canvas
  if ( i%4 == 0) {
    //canvasElementContext.drawImage( glcanvas, 128,128, 768, 768 );
    //canvasElementContext.drawImage( glcanvas, 128,128, 768, 768 );
    //canvasElementContext.drawImage( glcanvas, 100,100, 824, 824 );
    //canvasElementContext.drawImage( glcanvas, 110,110, 804, 804 );
    // [ 80-100 ]
    var e = (currentExtra * 1.6)
    var h = 1024 * e
    var w = (1024-h) / 2
    canvasElementContext.drawImage( glcanvas, w, w, h, h );
  }else{
    //canvasElementContext.fillStyle = "#000000";
    //canvasElementContext.fillRect( 0, 0, 1024,1024)
  }
=======
  canvasElementContext.drawImage( glcanvas, 0,0, glcanvas.width, glcanvas.height );
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
  if ( effectsTexture ) effectsTexture.needsUpdate = true;
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
* @function Effect#FeedbackEffect#effect
* @param {number} effect index of the effect
*/


<<<<<<< HEAD
  _self.effect = function( _num ){
    if ( _num != undefined ) {
      currentEffect = _num
      renderer.customUniforms[_self.uuid+'_currentfeedbackeffect'].value = currentEffect
      // update uniform ?
    }
    return currentEffect
  }

  _self.extra = function( _num ){
      if ( _num != undefined ) {
        currentExtra = _num
        renderer.customUniforms[_self.uuid+'_extra'].value = currentExtra
        // update uniform ?
      }
    return currentExtra
  }

=======
_self.effect = function( _num ){
  if ( _num != undefined ) {
    currentEffect = _num
    renderer.customUniforms[_self.uuid+'_currentfeedbackeffect'].value = currentEffect
    // update uniform ?
  }
  return currentEffect
  }
>>>>>>> 5ab4aa5834392b90577613624fa7b7b7fc52517b
}
