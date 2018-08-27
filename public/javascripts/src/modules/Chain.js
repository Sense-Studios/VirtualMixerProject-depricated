/**
 * @description
 *   Chains together a string of sources, gives them an alpha channel, and allows for
 *   switching them on and off with fade effects. Ideal for a piano board or a midicontroller
 *
 * @example let myChain = new Mixer( renderer, { sources: [ myVideoSource, myOtherMixer, yetAnotherSource ] );
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
    //renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_source'+index+'_'+'output;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_source'+index+'_'+'alpha;\n/* custom_uniforms */')
  })

  // add chain output and chain alpha to shader
  renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_'+'alpha;\n/* custom_uniforms */')
  renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_output;\n/* custom_uniforms */')

  _self.init = function() {
    // bould output module
    var generatedOutput = "vec3(0.0,0.0,0.0)"
    _self.sources.forEach( function( source, index ) {
      generatedOutput += ' + ('+source.uuid+'_'+'output * '+_self.uuid+'_source'+index+'_'+'alpha )'
    });
    generatedOutput += ";\n"

    // put it in the shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = '+generatedOutput+' \/* custom_main */')

  }

  _self.update = function() {}

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  var current = []
  _self.toggle = function( _num ) {
    console.log("TOGLLGGLLELEE!!!", _num)

    if ( renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value == 1 ) {
      renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = 0
    }else{
      renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = 1
      current = _num
    }
  }


  _self.keyDown = function( _num, _event ) {
    console.log("TOUCHFADE!!!", _num, _event)
    //if ( renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value > 0.99999 ) {
    //  renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = 1
    //}

    if (_event.repeat ) {
      return
      //renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value *= 1.042
      //console.log('pump', renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value)
      //return
    }

    renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = 1
    //console.log( renderer.customUniforms );
  }

  _self.keyUp = function( _num, _event ) {
    renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = 0

    /*
    var touchFadeTimeout = setInterval( function() {
      renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value *= 0.90
      if ( renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value < 0.01 ) {
        clearInterval(touchFadeTimeout);
      }
    });
    */
  }


}
