/**
 * @constructor Source
 * @interface
 * @summary
 *   A source is the imput for a mixer. It can be an image, video, text etc.
 *
 * @description
 *   A source is the imput for a mixer. It can be an image, video, text etc.
 *
 *
 *
 * @author Sense studios
 */

function Source( renderer, options ) {
  var _self = this

  _self.type = "Source"
  _self.function_list = [["JUMP","method","jump"]]

  // override these
  // program interface
  _self.init =         function() {}
  _self.update =       function() {}
  _self.render =       function() {}
  _self.start =        function() {}

  // control interface
  _self.src =          function( _file ) {} // .gif
  _self.play =         function() {}
  _self.pause =        function() {}
  _self.paused =       function() {}
  _self.currentFrame = function( _num ) {}  // seconds
  _self.duration =     function() {}        // seconds

  _self.jump =         function() {}
  //_self.cue =          function() {}      // still no solid solution
}
