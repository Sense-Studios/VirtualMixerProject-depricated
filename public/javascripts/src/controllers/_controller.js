/**
 * @constructor Controller
 * @interface
 */

function Controller( renderer, options ) {
  var _self = this

  // set options
  var _options;
  if ( options != undefined ) _options = options;

  _self.type = "Controller"
  _self.myLittleControllerVar = "test"

  // program interface
  _self.init =         function() {}
  _self.update =       function() {}
  _self.render =       function() {}
  _self.add =          function() {}
  //_self.start =        function() {}

}
