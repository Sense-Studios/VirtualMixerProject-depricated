// fragment
// vec3 b_w = ( source.x + source.y + source.z) / 3
// vec3 amount = source.xyz + ( b_w.xyx * _alpha )
// col = vec3(col.r+col.g+col.b)/3.0;
// col = vec4( vec3(col.r+col.g+col.b)/3.0, _alpha );

function BlackAndWhite( _renderer, _source, _options ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( _options.uuid == undefined ) {
    _self.uuid = "Effect_BlackAndWhite_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = _options.uuid
  }

  // add to renderer
  _renderer.add(_self)

  _self.type = "Effect"

  var source = _source

  _self.init = function() {

    console.log("Effect inits, with", _renderer)
    // add uniforms to renderer
    // renderer.customUniforms[_self.uuid+'_mixmode'] = { type: "i", value: 1 }

    // add uniforms to fragmentshader
    // _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_mixmode;\n/* custom_uniforms */')

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')

    // _output * uuid_alpha_1
    // uuid_alpha_1 * -pod
    // uuid_alpha_2 * +pod



    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_helpers */',
`
vec3 effect ( vec3 src ) {
  // return vec3( src.r + src.g + src.b ) / 3.;                                                           // black and white
  // return vec3( 1.-src.r, 1.-src.g, 1.-src.b );                                                         // negtive 1
  // return vec3( 1./src.r-1.0, 1./src.g-1.0, 1./src.b-1.0 );                                             // negtive 2
  // return vec3( 1./src.r-2.0, 1./src.g-2.0, 1./src.b-2.0 );                                             // negtive 3
  // return vec3( 1./src.r-2.0, 1./src.g-2.0, 1./src.b-2.0 );                                             // negtive 3
  // return vec3( (src.r+src.g+src.b) *3.  , (src.r+src.g+src.b)  /1.7., (src.r+src.g+src.b) /1.7 ) / 3.; // mopnocolor red
  // return vec3( (src.r+src.g+src.b) *1.7 , (src.r+src.g+src.b)  *3.  , (src.r+src.g+src.b) /1.7 ) / 3.; // mopnocolor blue
  // return vec3( (src.r+src.g+src.b) *1.7 , (src.r+src.g+src.b)  /1.7., (src.r+src.g+src.b) *3   ) / 3.; // mopnocolor green
  // return vec3( (src.r+src.g+src.b) *2.   , (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b) /1.2 ) / 3.; // mopnocolor yellow
  // return vec3( (src.r+src.g+src.b) *1.2 , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) *2.  ) / 3.; // mopnocolor turqoise
  // return vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  /1.2 , (src.r+src.g+src.b) *2.  ) / 3.; // mopnocolor purple
  // return vec3( src.r + src.g + src.b ) / 3. * vec3( 1.2, 1.0, 0.8 );                                   // sepia
}

/* custom_helpers */
`
    );

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = effect( '+_source.uuid+'_output );\n  /* custom_main */')
  } // init

  _self.update = function() {

    // mixmode
    // blendmode
    // pod
  }
}
