/**
 * @description
 *   Output
 *
 * @example
 *  let myChain = new output( renderer, source );
 *  renderer.init()
 *  renderer.render()
 * @implements Module
 * @constructor Module#Output
 * @param renderer:GlRenderer
 * @param source:Source
 * @author Sense Studios
 */
function Output(renderer, _source ) {

  // create and instance
  var _self = this;

  // set or get uid
  _self.uuid = "Output_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Module"

  // add to renderer
  renderer.add(_self)

  // add source
  var source = _source

  _self.init = function() {
    // renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'final_output = '+ source.uuid +'_output;\n  /* custom_main */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\n  gl_FragColor = vec4( '+ source.uuid +'_output, 1.0 );\n')
  }

  _self.update = function() {}
}
