//function SolidSource
// https://github.com/mrdoob/three.js/wiki/Uniforms-types

SolidSource.prototype = new Source(); // assign prototype to marqer
SolidSource.constructor = SolidSource;  // re-assign constructor

/**
 *
 * @summary
 *  Allows a solid color to serve as an input element
 *
 * @description
 *  Allows a solid color to serve as an input element
 *
 * @implements Source
 * @constructor Source#SolidSource
 * @example var red = new SolidSource( renderer, { color: { r: 1.0, g: 0.0, b: 0.0 } } );
 * @param {GlRenderer} renderer - GlRenderer object
 * @param {Object} options - JSON Object
 */

function SolidSource(renderer, options) {
  // vec3( 1.0, 0.0, 0.0 )

  var _self = this;
  if ( options.uuid == undefined ) {
    _self.uuid = "SolidSource_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  // no updates
  _self.bypass = true;

  // add to renderer
  renderer.add(_self)

  // set options
  var _options;
  var color = { r:0.0, g:0.0, b:0.0, a: 1.0 }

  if ( options != undefined ) _options = options;

  _self.init = function() {
    console.log("init solid", _options)
    if (_options.color != undefined) color = _options.color

    // add uniforms
    renderer.customUniforms[_self.uuid + "_color"] = { type: "v4", value: new THREE.Vector4( color.r, color.g, color.b, color.a ) }

    // ad variables to shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_color;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')

    // add output to shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec4 '+_self.uuid+'_output = '+_self.uuid+'_color;\n  /* custom_main */')
  }

  _self.update = function() {}
  _self.render = function() { return color; }

  // ---------------------------------------------------------------------------
  // Helpers
  /**
  * @implements Source
  * @function Source#SolidSource#color
  * @example red.color( { r: 0.0, g: 0.0, b: 1.0 } );
  * @param {float} r - red value
  * @param {float} g - green value
  * @param {float} b - blue value
  * @param {float} a - alpha value (optional)
  * @returns color
  */
  _self.color = function( c ) {
    if ( c != undefined ) {
      color = c
      if (color.a == undefined ) color.a = 1.0 // just to be sore
      console.log(_self.uuid, " sets color: ", color )
      renderer.customUniforms[_self.uuid + "_color"] = { type: "v4", value: new THREE.Vector4( color.r, color.g, color.b, color.a ) }
    }
    return color
  }

  _self.jump = function( _num ) {
    console.log("no")
  }
}


  // create and instance
