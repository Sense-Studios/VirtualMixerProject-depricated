/**
 * @summary
 *   The output node is the mandatory last node of the mixer, it passes it's content directly to the @GlRenderer
 *
 * @description
 *   The output node is the mandatory last node of the mixer, it passes it's content directly to the {@link GlRenderer}
 *
 * @example
 *  let myChain = new output( renderer, source );
 *  renderer.init()
 *  renderer.render()
 * @implements Module
 * @constructor Module#Output
 * @param renderer{GlRenderer} a reference to the GLrenderer
 * @param source{Source} any valid source node
 * @author Sense Studios
 */

 // TODO: maybe remove this node, and change it for something on the renderer?
 // like:
 //
 // renderer.output( node )
 // renderer.init()
 // renderer.render()

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
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\n  gl_FragColor = vec4( '+ source.uuid +'_output );\n')
  }

  _self.update = function() {}
}
