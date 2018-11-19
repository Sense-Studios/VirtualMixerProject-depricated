/**
 * @constructor Module
 * @interface
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
