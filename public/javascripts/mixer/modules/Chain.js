function Chain(renderer, options) {

  // THIS IS DEPRICATED
  // TODO: Rewrite

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
  _self.sources = options.sources


  // Depricated, needs to exit with an output node like uuid_output
  _self.init = function() {
    _self.sources.forEach( function( source ) {
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'final_output = final_output + vec3( texture2D( '+source.uuid+', vUv ).xyz * '+source.uuid+'_alpha );\n  /* custom_main */')
      //'vec3 '+_self.uuid+'_output =
    });
  }

  _self.update = function() {}
}
