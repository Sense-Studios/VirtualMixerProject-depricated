 /**
  * @constructor Controller
  * @interface

  * @summary
  *   The Controller Class covers a range of input-output nodes in between either sources and mixers
  *
  * @description
  *   The Controller Class covers a range of interfaces to popular input devices. Keyoard, Midi, Gamepad and Sockets
  *
  *
  *
  *
  *
  *
  * @author Sense studios
  */

function Controller( options ) {
  var _self = this

  // set options
  var _options;
  if ( options != undefined ) _options = options;

  _self.type = "Controller"
  _self.testControllerVar = "test"

  // program interface
  _self.init =         function() {}
  _self.update =       function() {}
  _self.render =       function() {}
}
