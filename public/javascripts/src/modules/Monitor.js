/**
  * @summary
  *  creates a preview of a certain point in the network
  * @description
  *  takes a node somewhere in your network, and previews the network untill
  *  there, and ignores the rest, this allows you to create previews on
  *  another canvas
  * @example
  *  This example would require 2 canvasses, glcanvas and monitoring_canvas
  *  to be on your page, the first one has a yellow filter, the preview has
  *  not
  *
  *  // create the main renderer
  * var renderer = new GlRenderer({element: 'glcanvas'});
  *
  * // sources
  * var source1 = new VideoSource(renderer, { src: "/video/placeholder.mp4" })
  * var source2 = new VideoSource(renderer, { src: "/video/16MMDUSTproc.mp4" })
  *
  * // mixer
  * var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
  *
  * // preview out
  * var monitor = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas' })
  *
  * // add some effects
  * var contrast = new ColorEffect( renderer, { source: mixer1 } )
  * var c_effect = new ColorEffect( renderer, { source: contrast } )
  *
  * // final out
  * var output = new Output( renderer, c_effect )
  *
  * // initialize the renderer and start the renderer
  * renderer.init();         // init
  * renderer.render();       // start update & animation
  *
  * c_effect.effect(14)
  * contrast.effect(61)
  * contrast.extra(0.4)
  *
  * @example let myMixer = new Monitor( renderer, { source: node });
  * @constructor Module#Monitor
  * @implements Module
  * @param renderer:GlRenderer
  * @param options:Object
  * @author Sense Studios
  */


var Monitor = class {

  // information functions
  static function_list() {
    return []
  }

  static help() {
    return "ownoes"
  }

  constructor( renderer, options ) {

    // create and instance
    var _self = this;
    if (renderer == undefined) return

    // set or get uid
    if ( options.uuid == undefined ) {
      _self.uuid = "Mixer_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
    } else {
      _self.uuid = options.uuid
    }

    _self.renderer = renderer
    _self.source = options.source

    // add to renderer
    renderer.add(_self)

    // set options
    var _options;
    if ( options != undefined ) _options = options

    // set type
    _self.type = "Module";
    _self.internal_renderer = null

    /**
     * @description
     *  initializes the monitor through the (main) renderer
     * @example
     *  none
     * @function Addon#Monitor~init
     */

    _self.init = function() {

      /* TODO: rewrite into scenes?

        https://discourse.threejs.org/t/how-can-i-copy-a-webglrendertarget-texture-to-a-canvas/6897
        https://threejs.org/examples/webgl_multiple_canvases_grid.html
        https://stackoverflow.com/questions/41841441/three-js-drawing-texture-directly-to-canvas-without-creating-a-plane-in-a-bill
        https://threejs.org/docs/#api/en/renderers/WebGLRenderer.copyTextureToTexture

        okay, so this works, but! it could be more robust,
        if I read the documentation righg, there is a maximum of 8 canvasses
        for WebGL, but one renderer can adress different canvasses, so we might
        want to extend the original renderer with an extra scene, insteat of
        rewriting the whole thing
      */

      // create an internal renderer
      _self.internal_renderer = new GlRenderer({element: options.element});

      // copy the fragment and vertex shader so far
      _self.internal_renderer.fragmentShader = _self.renderer.fragmentShader
      _self.internal_renderer.vertexShader = _self.renderer.vertexShader

      // copy the uniforms and defines so far
      _self.internal_renderer.customUniforms = _self.renderer.customUniforms
      _self.internal_renderer.customDefines = _self.renderer.customDefines

      // add an output node
      var internal_output = new Output( _self.internal_renderer, _self.source )

      // initalize local rendering
      _self.internal_renderer.init()
      _self.internal_renderer.render()
    }

    /** @function Addon#Monitor~update */
    /**
     * @description
     *  description
     * @example
     *  example
     * @function Module#Monitor#update
     *
     */

    _self.update = function() {
      // TODO: we could handle render update functions locally, this would allow
      // to set lower framerate or color depth, making the previews less resource
      // intensive.
    }
  }
}
