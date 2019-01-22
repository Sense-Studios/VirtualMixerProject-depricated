DistortionEffect.prototype = new Effect(); // assign prototype to marqer
DistortionEffect.constructor = DistortionEffect;  // re-assign constructor

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
 *   let myEffect = new DistortionEffect( renderer, { source1: myVideoSource, effect: 1 });
 *
 * @constructor Effect#DistortionEffect
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

// TO THINK ON: Seems we need to connect this to SOURCES somehow

function DistortionEffect( _renderer, _options ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( _options.uuid == undefined ) {
    _self.uuid = "DistortionEffect_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = _options.uuid
  }

  // add to renderer
  _renderer.add(_self)
  _self.type = "Effect"

  var source = _options.source
  // var currentEffect = _options.effect
  // var currentEffect = 12

  var currentEffect = _options.effect
  var currentEffect = 1
  var currentExtra = 0.8

  _self.init = function() {
    // add uniforms to renderer
    _renderer.customUniforms[_self.uuid+'_currentdistortioneffect'] = { type: "i", value: 1 }
    _renderer.customUniforms[_self.uuid+'_extra'] = { type: "f", value: 2.0 }

    // add uniforms to fragmentshader
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_currentdistortioneffect;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_extra;\n/* custom_uniforms */')

    if ( renderer.fragmentShader.indexOf('vec4 distorioneffect ( vec4 src, int currentdistortioneffect, float extra, vec2 vUv )') == -1 ) {
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_helpers */',
`
vec4 distorioneffect ( vec4 src, int currentdistortioneffect, float extra, vec2 vUv ) {
  // multi
  if (currentdistortioneffect == 1) {
    return src;
  }

  if (currentdistortioneffect == 2) {
    //vUv = vUv * vec2(2.0, 2.0)
    //vUv = vUv
    //_self.uuid+'_uvmap
    //_self.uuid+'_uvmap_mod

    return src;


  }

  // pip
  if (currentdistortioneffect == 3) {
    // wipes (move these to mixer?)
    vec4 box = src;

    if ( gl_FragCoord.x < 36.0 || gl_FragCoord.x > 436.0 ) {
      box = vec4(0.0,0.0,0.0,0.0);
    }

    if ( gl_FragCoord.y < 36.0 || gl_FragCoord.y > 436.0 ) {
      box = vec4(0.0,0.0,0.0,0.0);
    }

    return box;
  }

  if (currentdistortioneffect == 4) {
    return src;
  }

  //return src;
}

/* custom_helpers */
`
  );
}

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_main */', '\
vec4 '+_self.uuid+'_output = distorioneffect( '+source.uuid+'_output, ' + _self.uuid+'_currentdistortioneffect' + ', '+ _self.uuid+'_extra' +', vUv );\n  /* custom_main */');
  } // init

  var i = 0.;
  _self.update = function() {
    i += 0.001
    // renderer.customUniforms[_self.uuid+'_uvmap'] = { type: "v2", value: new THREE.Vector2( 1 - Math.random() * .5, 1 - Math.random() * .5 ) }
    if (currentEffect == 1) {
      source.setUVMapMod(0., 0.)
      source.setUVMap(0., 0.)
    }

    // multi
    if (currentEffect == 2) {
      source.setUVMapMod(0.25, 0.25)
      source.setUVMap(2., 2.)
    }

    // pip
    if (currentEffect == 3 ) {      
      source.setUVMapMod(0.2,0.2)
      source.setUVMap(0.5,0.4)
    }

    if (currentEffect == 4) {
    }
    //--------------------------------------------------------------------------------------------------------
    // testSource1.setUVMapMod(0.25, 0.25)
    // testSource1.setUVMapMod(0.25, 0.25)

    // testSource1.setUVMap(1, 1)
    // testSource1.setUVMap(1, 1)

    // pip
    /*
    testSource1.setUVMapMod(0, 0)
    var c = 0
    setInterval( function() {
      c+= 0.02
      //testSource1.setUVMap( Math.sin(c)+2, Math.sin(c)+1 )
      testSource1.setUVMapMod( Math.sin(c)-1, -Math.cos(c)-1 )
    }, 50)
    */
    //--------------------------------------------------------------------------------------------------------


    // ONLY WORKS ON VIDEO SOURCE, IF IT WORKS
    //renderer.customUniforms[source.uuid+'_uvmap_mod'] = { type: "v2", value: new THREE.Vector2( i, Math.cos(i) ) }
    //renderer.customUniforms[source.uuid+'_uvmap'] = { type: "v2", value: new THREE.Vector2( 1 - Math.random() * .82, 1 - Math.random() * .82 ) }
  }

  _self.effect = function( _num ){
    if ( _num != undefined ) {
      currentEffect = _num
      if (renderer.customUniforms[_self.uuid+'_currentdistortioneffect']) renderer.customUniforms[_self.uuid+'_currentdistortioneffect'].value = currentEffect
      // update uniform ?
    }

    return currentEffect
  }

  _self.extra = function( _num ){
    return _num
  }
}
