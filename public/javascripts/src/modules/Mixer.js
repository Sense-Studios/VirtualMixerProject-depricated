function Mixer(renderer, options) {

  // create and instance
  var _self = this;

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
  _self.type = "Module"

  // add local variables
  var alpha1 = 1
  var alpha2 = 0
  var pod = 0
  var mixmode = 1
  // of 8 NORMAL, HARD, NAM, FAM, LEFT, RIGHT, CENTER, BOOM
  var blendmode = 1
  // of 18: 1 ADD (default), 2 SUBSTRACT, 3 MULTIPLY, 4 DARKEN, 5 COLOUR BURN,
  // 6 LINEAR_BURN, 7 LIGHTEN,  8 SCREEN, 9 COLOUR_DODGE, 10 LINEAR_DODGE,
  // 11 OVERLAY, 12 SOFT_LIGHT, 13 HARD_LIGHT, 14 VIVID_LIGHT, 15 LINEAR_LIGHT,
  // 16 PIN_LIGHT, 17 DIFFERENCE, 18 EXCLUSION
  _self.blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ]
  _self.mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  //var transmodes = [ 1, 2, 3 ]
  //var transmodes = 1

  var source1, source2
  source1 = options.source1
  source2 = options.source2

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
    if ( renderer.fragmentShader.indexOf('vec3 blend ( vec3 src, vec3 dst, int blendmode )') == -1 ) {
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_helpers */','\
\nvec3 blend ( vec3 src, vec3 dst, int blendmode ) {\
\n  if ( blendmode ==  1 ) return src + dst;\
\n  if ( blendmode ==  2 ) return src - dst;\
\n  if ( blendmode ==  3 ) return src * dst;\
\n  if ( blendmode ==  4 ) return min(src, dst);\
\n  if ( blendmode ==  5)  return vec3((src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z)));\
\n  if ( blendmode ==  6 ) return (src + dst) - 1.0;\
\n  if ( blendmode ==  7 ) return max(src, dst);\
\n  if ( blendmode ==  8 ) return (src + dst) - (src * dst);\
\n  if ( blendmode ==  9 ) return vec3((src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z)));\
\n  if ( blendmode == 10 ) return src + dst;\
\n  if ( blendmode == 11 ) return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\
\n  if ( blendmode == 12 ) return vec3((src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z))));\
\n  if ( blendmode == 13 ) return vec3((src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)), (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z)));\
\n  if ( blendmode == 14 ) return vec3((src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z))));\
\n  if ( blendmode == 15 ) return 2.0 * src + dst - 1.0;\
\n  if ( blendmode == 16 ) return vec3((src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), (src.x > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z));\
\n  if ( blendmode == 17 ) return abs(dst - src);\
\n  if ( blendmode == 18 ) return src + dst - 2.0 * src * dst;\
\n  return src + dst;\
\n}\n/* custom_helpers */');
    }

    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = blend( '+source1.uuid+'_output * '+_self.uuid+'_alpha1,'+source2.uuid+'_output * '+_self.uuid+'_alpha2, '+_self.uuid+'_blendmode );\n  /* custom_main */')
  }

  _self.update = function() {
  }

  _self.render = function() {
    return pod
  }

  // ---------------------------------------------------------------------------
  // HELPERS

  // you shouldnt be able to set these directly
  _self.alpha1 = function() { return alpha1 }
  _self.alpha2 = function() { return alpha2 }

  _self.mixMode = function( _num ) {
    if ( _num != undefined ) { mixmode = _num }
    return mixmode
  }

  _self.blendMode = function( _num ) {
    if ( _num != undefined ) {
      blendmode = _num
      renderer.customUniforms[_self.uuid+'_blendmode'].value = blendmode
    }
    return blendmode
  }

  // sets the position of the handle, fader or pod. 0 is left, 1 is right
  _self.pod = function( _num ) {
    if ( _num != undefined ) {

      // set pod position
      pod = _num

      // evaluate current mix style
      // normal mix
      if (mixmode == 1) {
        alpha1 = pod
        alpha2 = 1 - pod
      }

      // hard mix
      if (mixmode == 2) {
        alpha1 = Math.round( pod )
        alpha2 = Math.round( 1-pod )
      }

      // NAM mix
      if (mixmode == 3) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
        if ( alpha1 > 1 ) alpha1 = 1;
        if ( alpha2 > 1 ) alpha2 = 1;
      }

      // FAM mix
      if (mixmode == 4) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
      }

      // Non Dark mix
      if (mixmode == 5) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
        if ( alpha1 > 1 ) alpha1 = 1;
        if ( alpha2 > 1 ) alpha2 = 1;
        alpha1 += 0.36;
        alpha2 += 0.36;
      }

      // left
      if (mixmode == 6) {
        alpha1 = 1;
        alpha2 = 0;
      }

      // right
      if (mixmode == 7) {
        alpha1 = 0;
        alpha2 = 1;
      }

      // center
      if (mixmode == 8) {
        alpha1 = 0.5;
        alpha2 = 0.5;
      }

      // BOOM
      if (mixmode == 9) {
        alpha1 = 1;
        alpha2 = 1;
      }

      // send alphas to the shader
      renderer.customUniforms[_self.uuid+'_alpha1'].value = alpha1;
      renderer.customUniforms[_self.uuid+'_alpha2'].value = alpha2;
    }
    return pod;
  }
}
