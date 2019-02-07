/**
 * @constructor Effect
 * @interface

 * @summary
 *   The effect class covers a range of input-output nodes in between either sources and mixers
 *
 * @description
 *   The effect class covers a range of input-output nodes in between either sources and mixers
 *   Or mixers and mixers. It depends if the effect needs UV control whichj only works on samplers.
 *   Broadly I've split up a number of effects in
 *    * DistortionEffects, handling all kind of UV processes on samplers and more
 *    * FeedbackEffects, with an extra canvas all effects that involve layering are here
 *    * ColorEffects, all effects doing with colors, works on mixers as well
 *
 * @author Sense studios
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
