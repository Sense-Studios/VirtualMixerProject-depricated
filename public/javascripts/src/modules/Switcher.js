/**
 * @summary
 *   A switcher selects either one of two sources
 *
 * @description
 *   Switcher
 *
 * @example
 *  let mySwitcher = new Switcher( renderer, [ source1, source2 ]] );
 * @constructor Module#Switcher
 * @implements Module
 * @param renderer{GlRenderer}
 * @param source{Source}
 * @author Sense Studios
 */

function Switcher(renderer, options ) {

  // create and instance
  var _self = this;

  // set or get uid
  _self.uuid = "Switcher_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Module"

  // add to renderer
  renderer.add(_self)

  // add sources, only 2 allowed, build mixers or use a chain
  _self.sources = [ options.source1, options.source2 ]; // array
  _self.active_source = 0

  _self.init = function() {

    console.log("Switcher", _self.uuid, _self.sources)

    renderer.customUniforms[_self.uuid+'_active_source'] = { type: "i", value: 1 }

    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_active_source;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')

    // we actually need this for each instance itt. the Mixer
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_helpers */',`
vec4 get_source_`+_self.uuid+` ( int active_source, vec4 src1, vec4 src2 ) {
  if ( active_source ==  0 ) return src1;\
  if ( active_source ==  1 ) return src2;\
}
/* custom_helpers */
`
    );

    // renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'final_output = '+ source.uuid +'_output;\n  /* custom_main */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec4 '+_self.uuid+'_output = get_source_'+_self.uuid+'('+_self.uuid+'_active_source, '+_self.sources[0].uuid +'_output, '+_self.sources[1].uuid +'_output );\n  /* custom_main */')
  }

  _self.update = function() {}
  _self.render = function() {
    return _self.sources[ _self.active_source ]
  }

  _self.doSwitch = function( _num ) {
    if ( _num == undefined ) {
      if (_self.active_source == 0) {
        _self.active_source = 1
      }else{
        _self.active_source = 0
      }
    }else{
      if ( _num != 0 && _num != 1) {
        console.log( _self.uuid, _num, "not allowed")
      }else{
        _self.active_source = _num
      }
    }
    renderer.customUniforms[_self.uuid+'_active_source'] = { type: "i", value: _self.active_source }
    return _self.active_source
  }
}
