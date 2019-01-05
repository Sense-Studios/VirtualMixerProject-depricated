/**
 * @constructor Effect
 * @interface
 */

 function Effect( renderer, options ) {
   var _self = this

   /*
     renderer
   */

   _self.type = "Effect"

   // program interface
   _self.init =         function() {}
   _self.update =       function() {}
   _self.render =       function() {}
 }
