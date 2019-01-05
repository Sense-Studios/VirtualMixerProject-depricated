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
  var currentEffect = _options.effect
  var currentEffect = 12

  _self.update = function() {
    i += 0.001
    //renderer.customUniforms[_self.uuid+'_uvmap'] = { type: "v2", value: new THREE.Vector2( 1 - Math.random() * .5, 1 - Math.random() * .5 ) }

    // ONLY WORKS ON VIDEO SOURCE, IF IT WORKS
    renderer.customUniforms[source.uuid+'_uvmap_mod'] = { type: "v2", value: new THREE.Vector2( i, Math.cos(i) ) }
    renderer.customUniforms[source.uuid+'_uvmap'] = { type: "v2", value: new THREE.Vector2( 1 - Math.random() * .82, 1 - Math.random() * .82 ) }
  }

  _self.effect = function( _num ){
    if ( _num != undefined ) {
      currentEffect = _num
      renderer.customUniforms[_self.uuid+'_currentdistortioneffect'].value = currentEffect
      // update uniform ?
    }

    return currentEffect
  }
}
