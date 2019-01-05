MidiController.prototype = new Midi();  // assign prototype to marqer
MidiController.constructor = MidiController;  // re-assign constructor

/**
* @summary
*  A demo utilizing midi sliders
*
* @description
*  Using sliders on a midicontroller to connect to certain floats
*
* @implements Controller
* @constructor Controller#Midi#SliderBoard
* @example var sliderboard1 = new SliderBoard( _renderer, _mixer1 );
* @param {GlRenderer} renderer - GlRenderer object
* @param {Module#Mixer} mixer - a Mixer instance
*/

function SliderBoard( _renderer, _mixer ) {
}
