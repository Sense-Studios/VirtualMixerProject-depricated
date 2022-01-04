/**
 * @summary
 *    A monitor can display intermittant parts of the effect chain.
 *
 * @description
 *   A nice summery

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

    // add to renderer
    renderer.add(_self)

    // set options
    var _options;
    if ( options != undefined ) _options = options

    // set type
    _self.type = "Module";


    /** @function Addon#Monitor~init */
    /**
     * @description
     *  description
     * @example
     *  example
     * @function Module#Monitor#init
     *
     */
    _self.init = function() {
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
    }
