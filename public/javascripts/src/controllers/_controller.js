/**
 * @constructor Controller
 * @interface
 */

function Controller( options ) {
  var _self = this

  // set options
  var _options;
  if ( options != undefined ) _options = options;

  //var nodes = []

  _self.type = "Controller"
  _self.testControllerVar = "test"

  // program interface
  _self.init =         function() {}
  _self.update =       function() {}
  _self.render =       function() {}
  // _self.add =          function() {}
  //_self.start =        function() {}

  // _self.removeEventListener
  // _self.addEventListener
  // _self.dispatchControllerEvent



}
