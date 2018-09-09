Midi.prototype = new Controller();  // assign prototype to marqer
Midi.constructor = Midi;  // re-assign constructor

/**
 * @implements Controller
 * @constructor Controller#Midi
 * @interface
 */

function Midi() {
  // base

  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Midi_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "MidiControl"
  //_self.controllers = {};
  //_self.bypass = true
  _self.mylittlevar = "boejaka"
  /*

  // Check this image, with all the buttons etc.
  // https://d2r1vs3d9006ap.cloudfront.net/s3_images/1143703/apc_mini_midi.jpg

  // these are the available colors
  var OFF = 0;
  var GREEN = 1;
  var GREEN_BLINK = 2;
  var RED = 3;
  var RED_BLINK = 4;
  var YELLOW = 5;
  var YELLOW_BLINK = 6;

  // needed for the program
  var midi, input, output

  // this is the main keypad
  var midimap = [
  	[ 56, 57, 58, 59, 60, 61, 62, 63 ],
  	[ 48, 49, 50, 51, 52, 53, 54, 55 ],
  	[ 40, 41, 42, 43, 44, 45, 46, 47 ],
  	[ 32, 33, 34, 35, 36, 37, 38, 39 ],
  	[ 24, 25, 26, 27, 28, 29, 30, 31 ],
  	[ 16, 17, 18, 19, 20, 21, 22, 23 ],
  	[  8,  9, 10, 11, 12, 13, 14, 15 ],
  	[  0,  1,  2,  3,  4,  5,  6,  7 ]
  ]

  // these are the rest of the buttons
  var rest = [ 64, 65, 66, 67, 68, 69, 70, 71, 82, 83, 84, 85, 86, 87, 88, 89 ]
  var faders        = [  0, 0, 0 ,0 , 0 , 0 , 0 , 0 ,0 ] // 0-127
  var faders_opaque = [  0, 0, 0 ,0 , 0 , 0 , 0 , 0 ,0 ] // 0-1

  // request MIDI access
  if (navigator.requestMIDIAccess) {
  	navigator.requestMIDIAccess()
  		.then(success, failure);
  }

  // we have success!
  function success (_midi) {
    console.log("We have midi!09po ")
  	midi = _midi
  	var inputs = midi.inputs.values();
  	var outputs = midi.outputs.values();

  	for (i = inputs.next(); i && !i.done; i = inputs.next()) {
  		input = i.value;
      input.onmidimessage = onMIDIMessage;
  	}

  	for (o = outputs.next(); o && !o.done; o = outputs.next()) {
  		output = o.value;
      initMidi()
  	}
  }

  // everything went wrong.
  function failure () {
  	console.error('No access to your midi devices.');
  }

  function initMidi() {
    // make everything red!
    var commands = []
    midimap.forEach( function( row, i ) {
      row.forEach( function( value, j ) {
        commands.push( 0x90, value, RED_BLINK )
      });
    });
  }

  function onMIDIMessage(e) {
    commands.push( 0x90, value, YELLOW )
    output.send( commands )
  }
  */
}
