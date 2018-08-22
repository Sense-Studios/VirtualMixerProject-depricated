// fragment
// vec3 b_w = ( source.x + source.y + source.z) / 3
// vec3 amount = source.xyz + ( b_w.xyx * _alpha )
// col = vec3(col.r+col.g+col.b)/3.0;
// col = vec4( vec3(col.r+col.g+col.b)/3.0, _alpha );

function BlackAndWhite( renderer, _source ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( options.uuid == undefined ) {
    _self.uuid = "Effect_BlackAndWhite_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }


  _self.type = "Effect"

  var source = _source

  _self.init = function() {

    // add uniforms to renderer
    // renderer.customUniforms[_self.uuid+'_mixmode'] = { type: "i", value: 1 }

    // add uniforms to fragmentshader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_mixmode;\n/* custom_uniforms */')

    // _output * uuid_alpha_1
    // uuid_alpha_1 * -pod
    // uuid_alpha_2 * +pod

    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = blend( '+source1.uuid+'_output ,'+source2.uuid+'_output, '+_self.uuid+'_blendmode );\n  /* custom_main */')
  }

  _self.update = function() {

    // mixmode
    // blendmode
    // pod
  }
}
