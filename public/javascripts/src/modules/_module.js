/**
 * @constructor Module
 * @interface
 * @summary
 *   Modules collect all the mixer elements
 *
 * @description
 *   Modules collect all the mixer elements
 *
 *
 * @author Sense studios
 */

function Module( renderer, options ) {
  var _self = this

  /*
   renderer
  */

  _self.type = "Module"

  // program interface
  _self.init =         function() {}
  _self.update =       function() {}
  _self.render =       function() {}
}
