/**
 * @constructor Effect
 * @interface

 * @summary
 *   The Effect Class covers a range of input-output-nodes.
 *   Effects example on codepen:
 *   <a href="https://codepen.io/xangadix/pen/eXLGwJ" target="_blank">codepen</a>
 *
 * @description
 *   The effect class covers a range of input-output nodes in between either sources and mixers
 *   Or mixers and mixers. It depends if the effect needs UV control whichj only works on samplers.
 *   Broadly I've split up a number of effects in
 *    * DistortionEffects, handling all kind of UV processes on samplers and more
 *    * FeedbackEffects, with an extra canvas all effects that involve layering are here
 *    * ColorEffects, all effects doing with colors, works on mixers as well
 *
 *   Connection flow:
 *   ```
 *     SOURCE ---> EFFECT1 --> MIXER --> EFFECT2 --> ... ---> OUTPUT
 *   ```
 *
 *   Effects example on codepen:
 *   <a href="https://codepen.io/xangadix/pen/eXLGwJ" target="_blank">codepen</a>
 *
 *
 * @author Sense studios
 */


 function Effect( renderer, options ) {
   var _self = this

   _self.type = "Effect"

   // program interface
   _self.init =         function() {}
   _self.update =       function() {}
   _self.render =       function() {}
 }
