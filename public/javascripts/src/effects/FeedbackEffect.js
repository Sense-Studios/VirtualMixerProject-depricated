FeedbackEffect.prototype = new Effect(); // assign prototype to marqer
FeedbackEffect.constructor = FeedbackEffect;  // re-assign constructor

/**
 * @summary
 *   The Feedback effect has a series of tests for feedback like effects through redrawing on an extra canvas
 *   Effects Example on codepen:
 *   <a href="https://codepen.io/xangadix/pen/eXLGwJ" target="_blank">codepen</a>
 *
 * @description
 *   The Feedback effect has a series of tests for feedback like effects through redrawing on an extra canvas
 *   mimicing classic mixers like MX50 and V4
 *   ```
 *   100. you got to see for yourself
 *   101. they should have sent a poet
 *   ```
 *
 * @example
 *   let myEffect = new FeedbackEffect( renderer, { source: myVideoSource, effect: 1 });
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
  var currentExtra = 0.8


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
    canvasElementContext.fillStyle = "#000000";
    canvasElementContext.fillRect( 0, 0, 1024,1024)

    console.log("FeedbackEffect inits, with", _renderer)

    effectsTexture = new THREE.Texture( canvasElement );
    effectsTexture.wrapS = THREE.RepeatWrapping;
    effectsTexture.wrapT = THREE.RepeatWrapping;
    effectsTexture.repeat.set( 4, 4 );

    _renderer.customUniforms[_self.uuid+'_effectsampler'] = { type: "t", value: effectsTexture }
    _renderer.customUniforms[_self.uuid+'_currentfeedbackeffect'] = { type: "i", value: currentEffect }
    _renderer.customUniforms[_self.uuid+'_extra'] = { type: "i", value: currentExtra }

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D  '+_self.uuid+'_effectsampler;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int  '+_self.uuid+'_currentfeedbackeffect;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float  '+_self.uuid+'_extra;\n/* custom_uniforms */')


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

      vec2 wuv = vec2(0.,0.);
      // wuv = vUv * vec2( 1.0, 1.0 ) - vec2( 0., 0. );
      wuv = vUv; //* vec2( 1.0, 1.0 ) - vec2( 0., 0. );
      //wuv = vUv - vec2( 0.1, 0. );
      // wuv = vUv + vec2( extra, extra );
      // return texture2D( src, wuv ).rgba;

      return vec4( vec4( ( texture2D( `+_self.uuid+`_effectsampler, wuv ).rgba * 0.9 ) + (src.rgba * .6 ) ).rgb, 1.);

      // return ( texture2D( , vUv + vec2( 1., 0.99999999) ).rgba ) + src * 0.3;

      // return ( texture2D( `+_self.uuid+`_effectsampler, vUv  ).rgb * 1.4 + src * .8) * 0.5; //* vec3(.5, .5, .5
      // return ( texture2D( src, vUv ).rgb );
      // return ( texture2D( `+_self.uuid+`_effectsampler, vUv  ).rgb ) * src + src;

      //vec4 wuv = wuv = vUv * vec2( extra*6., extra*6. ) - vec2( extra * 3., extra * 3. );
      //vec4 tex = texture2D( `+_self.uuid+`_effectsampler, wuv ); //+ vec4( src.r, src.g, src.b, vUv * 2. );

      // return src.rrr;
      // tex.rgb = vec3(src.r, src.g, src.b);
      // tex.xy = vec2(1.0,1.0);
      // tex = tex + vec4( src.r, src.g, src.b, vUv * 2. );


      // * 0.52 + vec4( src * 0.52, vUv ) *
      // vec4 tex = vec4( src, vUv * .5 );
      // return mix( tex, `+_self.uuid+`_effectsampler, 0.).rgb;
      // return mix(tex.rgb, src.rgb, 1.);
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

/*
  Herunder is a script that uses a canvas to add feedback to the texture
  but to do it right, we need another scene. this has to do with the fact
  that three renders everything in a gl buffer, so we need another scene
  to get this done.
  https://github.com/samhains/minimal-threejs-feedback-glsl/blob/master/index.html

  Either we build another three JS texture here, OR we switch from render
  engine and move over to another core engine like reGL
*/

// -----------------------------------------------------------------------------

var vector = new THREE.Vector2();
//var glcanvas = document.getElementById('glcanvas');
//var glcanvas = _renderer.glrenderer.context.canvas
var i = 0
_self.update = function() {

  i++;

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
  if ( effectsTexture ) effectsTexture.needsUpdate = true;
}

/* ------------------------------------------------------------------------ */

/**
 * @description currentFeedbackeffectffect number
 * @function Effect#FeedbackEffect#effect
 * @param {Number} effectnumber currentColoreffect number
 */
  _self.effect = function( _num ){
    if ( _num != undefined ) {
      currentEffect = _num
      renderer.customUniforms[_self.uuid+'_currentfeedbackeffect'].value = currentEffect
      // update uniform ?
    }
    return currentEffect
  }

  /**
   * @description currenFeedbackEffect extra try gently between 0-1, preferably around 0.5
   * @function Effect#FeedbackEffect#extra
   * @param {float} float currenFeedbackEffect extra
   */
  _self.extra = function( _num ){
      if ( _num != undefined ) {
        currentExtra = _num
        renderer.customUniforms[_self.uuid+'_extra'].value = currentExtra
        // update uniform ?
      }
    return currentExtra
  }
}
