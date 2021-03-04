/**
 * @summary
 *    A Chain is string of sources, stacked on top of each other
 *    Chain Example on codepen:
 *    <a href="https://codepen.io/xangadix/pen/BbVogR" target="_blank">codepen</a>
 *
 * @description
 *   Chains together a string of sources, gives them an alpha channel, and allows for switching them on and off with fade effects. Ideal for a piano board or a midicontroller
 *
 * @example let myChain = new Chain( renderer, { sources: [ myVideoSource, myOtherMixer, yetAnotherSource ] } );
 * @constructor Module#Chain
 * @implements Module
 * @param renderer:GlRenderer
 * @param options:Object
 */
function Chain(renderer, options) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( options.uuid == undefined ) {
    _self.uuid = "Chain_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  // add to renderer
  renderer.add(_self)

  // set options
  var _options;
  if ( options != undefined ) _options = options

  _self.type = "Module"
  _self.sources = _options.sources

  // add source alpha to custom uniforms
  _self.sources.forEach( function( source, index ) {
    renderer.customUniforms[_self.uuid+'_source'+index+'_'+'alpha'] = { type: "f", value: 0.5 }
  })

  // add source uniforms to fragmentshader
  _self.sources.forEach( function( source, index ) {
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_source'+index+'_'+'alpha;\n/* custom_uniforms */')
  })

  // add chain output and chain alpha to shader
  renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_'+'alpha;\n/* custom_uniforms */')
  renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_output;\n/* custom_uniforms */')

  _self.init = function() {
    // bould output module
    var generatedOutput = "vec4(0.0,0.0,0.0,0.0)"
    _self.sources.forEach( function( source, index ) {
      generatedOutput += ' + ('+source.uuid+'_'+'output * '+_self.uuid+'_source'+index+'_'+'alpha )'
    });
    //generatedOutput += ";\n"

    // put it in the shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec4 '+_self.uuid+'_output = vec4( '+generatedOutput+'); \/* custom_main */')

  }

  _self.update = function() {}

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------
  _self.setChainLink = function( _num, _alpha ) {
    renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = _alpha
  }

  _self.getChainLink = function( _num ) {
    return renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value
  }

  _self.setAll = function( _alpha = 0 ) {
    _self.sources.forEach( function( _num,i ) {
      renderer.customUniforms[_self.uuid+'_source'+i+'_'+'alpha'].value = _alpha
    })
  }

  _self.toggle = function( _num, _state ) {
    if ( _state !== undefined ) {
      renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = _state
      return;
    }

    if ( renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value == 1 ) {
      renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = 0
    }else{
      renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = 1
      current = _num
    }
  }
}
