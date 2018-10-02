Vidi.prototype = new Controller();  // assign prototype to marqer
Vidi.constructor = Vidi;  // re-assign constructor

/**
 * @implements Controller
 * @constructor Controller#Vidi
 * @interface
 *
 * Yes, The Visual Instrument Digital Interface is here.
 */

function Vidi() {
  // base

  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Vidi_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "VidiControl"
  //_self.controllers = {};
  //_self.bypass = true
  _self.mylittlevar = "boejaka"

}
