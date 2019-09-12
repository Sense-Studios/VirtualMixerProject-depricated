MidiController.prototype = new Controller();
MidiController.constructor = MidiController;

/**
 * @summary
 *  Connects a midicontroller with a range of listeners. Can also send commands Back
 *  Midi Example on codepen: 
 *  <a href="https://codepen.io/xangadix/pen/BbVogR" target="_blank">codepen</a>
 *
 * @description
 *  The Midi class searches and Connects to a midicontroller with a range of listeners.
 *  You can also send commands _back_. This is especially handy when you can control
 *  lights or automatic faders on your MIDI Controller.
 *
 *  Here is a demo on [Codepen](https://codepen.io/xangadix/pen/BbVogR), which was tested with 2 AKAI midicontrollers
 *
 *  The original implementation is on GitHub in a [Gist](https://gist.github.com/xangadix/936ae1925ff690f8eb430014ba5bc65e).
 *
 * @example
 *  var midi1 = new MidiController();
 *  midi1.addEventListener( 0, function(_arr) { console.log( " Midi received", _arr ) } ) ;
 *  // button 0, returns [ 144, 0, 1 ]
 *
 *  // use debug for more information
 *  midi.debug = true;
 *
 * @implements Controller
 * @constructor Controller#MidiController
 * @param options:Object
 * @author Sense Studios
 */

function MidiController( _options ) {
  // base

  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "MidiController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "MidiController"

  /** @member Controller#KeyboardController#debug {boolean} */
  _self.bypass = true

  /** @member Controller#KeyboardController#debug {boolean} */
  _self.debug = false

  /** @member Controller#KeyboardController~debug {boolean} */
  _self.ready = false

  /** @member Controller#KeyboardController~debug {object} */
  _self.controllers = {}
  var binds = []
  var nodes = []
  var c = 0 // counter
  var midi, input, output

  /** @function Controller#KeyboardController~success {object} */
  var success = function(_midi) {
  	midi = _midi
  	var inputs = midi.inputs.values();
  	var outputs = midi.outputs.values();

  	for (i = inputs.next(); i && !i.done; i = inputs.next()) {
  		input = i.value;
      input.onmidimessage = _self.onMIDIMessage;
  	}

  	for (o = outputs.next(); o && !o.done; o = outputs.next()) {
  		output = o.value;
      //if ( _self.debug ) console.log(" MIDI INITIALIZED", "ready")
  	}

    console.log("Midi READY? ", output, midi)
    if ( output != undefined ) _self.ready = true
    if ( output != undefined ) _self.bypass = false
  }

  // everything went wrong.
  /** @function Controller#KeyboardController~failure {object} */
  var failure = function (_fail) {
  	console.error('No access to your midi devices.', _fail);
  }

  // request MIDI access
  console.log("Midi check... ")
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
      .then( success, failure );
  }

  // some examples, this is the 'onpress' (and on slider) function
  var doubleclickbuffer = [ 0, 0, 0, 0 ]
  var doubleclickPattern = [ 128, 144, 128, 144 ]
  var doubleclick = false

  /** @function Controller#KeyboardController~onMIDIMessage {event} */
  _self.onMIDIMessage = function(e) {
    if (_self.debug) console.log(" MIDIMESSAGE >>", e.data)
    dispatchMidiEvent(e)

    // hello from midi
    // console.log(e.data)

    // Uint8Array(3) [176, 48, 117]
    // [ state, key, velocity ]
    // state
    // 144 = down
    // 112 = up
    // 176 = sliding ( fader )
    //

    // This is mainly experimental code for doubleclicking
    // we could return this as 256, 257 or higher state values (?)

    /*
    var opaque = false
    if (doubleclick) return
    doubleclickbuffer.unshift([ e.data[0], e.data[1] ])
    doubleclickbuffer.pop()

    if ( doubleclickbuffer.map(function(m) { return m[0] } ).join(",") == doubleclickPattern.join(",") ) {

      console.log("blink1")
      // update event listeners
      listeners.forEach( function( val, i ) {
        // doubleclick
        if ( val.btn == e.data[1] ) {
          val.cb( e.data, true )
        }
      })

      if ( doubleclickbuffer.map( function(m) { return m[1] } ).every( (val, i, arr) => val === arr[0] ) ) {
        doubleclickbuffer = [ 0, 0, 0, 0 ]

        // DO STUFF ON DOUBLECLICK
        _self.output.send( [ 0x90, e.data[1], GREEN_BLINK ] )
        doubleclick = true

        // chain1.setChainLink(e.data[1], faders[e.data[1]]/126)
        faders_opaque[e.data[1]] = 1
        // var source = chain1.getChainLink( e.data[1] )
        // if (source.video) source.video.currentTime = Math.random() * source.video.duration

        setTimeout(function() { doubleclickbuffer = [ 0, 0, 0, 0 ]; doubleclick = false}, 350)
        return
      }
    }

    // update event listeners
    listeners.forEach( function( val, i ) {
      // doubleclick
      if ( val.btn == e.data[1] ) {
        val.cb( e.data, false )
      }
    })

    setTimeout(function() { doubleclickbuffer = [ 0, 0, 0, 0 ]; doubleclick = false }, 350)
    //console.log( doubleclickbuffer )

    if (e.data[1] == 48) {
      //console.log( e.data[2] / 126 )
      //testSource2.video.playbackRate  = e.data[2] / 56
      //console.log(e.data[2])
      //if ( faders_opaque[0] ) chain1.setChainLink (0, e.data[2]/126 )
      faders[0] = e.data[2]
    }

    if (e.data[1] == 49) {
      //testSource3.video.playbackRate  = e.data[2] / 56
      //if ( faders_opaque[1] ) chain1.setChainLink (1, e.data[2]/126 )
      faders[1] = e.data[2]
    }

    if (e.data[1] == 50) {
      //testSource4.video.playbackRate  = e.data[2] / 56.0
      //if ( faders_opaque[2] ) chain1.setChainLink (2, e.data[2]/126 )
      faders[2] = e.data[2]
    }

    if (e.data[1] == 51) {
      //testSource4.video.playbackRate  = e.data[2] / 56.0
      //if ( faders_opaque[3] ) chain1.setChainLink (3, e.data[2]/126 )
      faders[3] = e.data[2]
    }

  	if (e.data[1] == 64) {
  		// switch everything off
  		var commands = []
  		midimap.forEach( function( row, i ) {
  			row.forEach( function( value, j ) {
  				commands.push(0x90, value, OFF)
  			})
  		})

  		rest.forEach( function( r, i ) {
  			commands.push( 0x90, r, OFF )
  		})
  		_self.output.send(commands)

  	}else if (e.data[1] == 65) {
  		// switch the main pads yellow
  		var commands = []
  		midimap.forEach( function( row, i ) {
  			row.forEach( function( value, j ) {
  				commands.push( 0x90, value, YELLOW )
  			})
  		})
      _self.output.send( commands )

  	}else{
  		// press a button, make it green
      if (e.data[0] == 128 ) {
        _self.output.send( [ 0x90, e.data[1], OFF ] );
        //chain1.setChainLink(e.data[1], 0)
        //console.log("toggle chain")
        doubleclick = false
      }

      if (e.data[0] == 144  ) {
        _self.output.send( [ 0x90, e.data[1], GREEN ] );
        //chain1.setChainLink(e.data[1], faders[e.data[1]]/126)
        //console.log("toggle chain", faders[e.data[1]], e.data[1] )
        faders_opaque[e.data[1]] = 0
        doubleclick = false
      }
  	}
    */
  }

  // ---------------------------------------------------------------------------
  /** @function Controller#KeyboardController~init  */
  _self.init = function() {}

  /** @function Controller#KeyboardController~update  */
  _self.update = function() {}

  /**
   * @description
   *  send midi data back to the controller. To switch a light on, or to make it
   *  change color. Theorettically you should be able to control motorized faders
   *  too, but I haven't tested that. Lights is nice though.
   *
   *  try to send evertything in one blob and try not to do all kinds of little
   *  updates, it'll crash your midi controller (it crashed mine)
   *
   *
   * @example
   *  // make button 0 yellow, if a video reports 'seeking'
   *  testSource1.video.addEventListener('seeking', function() { midi1.send([ 0x90, 0, 6] );} )
   *
   *  // don't forget to switch it off again
   *  testSource1.video.addEventListener('seeked', function() { midi1.send([ 0x90, 0, 5] );} )
   *
   *  // make button 8-11 and button 16-19 green (tested with an Akai APC Mini)
   *
   *  midi1.send([ 0x90, 8, 1, 0x90, 9, 1, 0x90, 10, 1, 0x90, 11, 1, 0x90, 16, 1, 0x90, 17, 1, 0x90, 18, 1, 0x90, 19, 1])
   *
   * @function Controller#MidiController#send
   * @param {array} commands - the sequence that needs execution
   *
  */
  _self.send = function( commands ) {
    if (_self.ready) {
      console.log("Midi send ", commands, "to", output)
      output.send( commands )
    }else{
      console.log("Midi is not ready yet")
    }
  }

  /**
   * @description
   *  clears all the buttons (sets them to 0)
   * @example
   *  midi.clear()
   * @function Controller#MidiController#clear
   *
  */
  _self.clear = function() {
    var commands = []
    for( var i = 0; i++; i < 100 ) commands.push( 0x90, i, 0 );
    output.send(commands)
  }

  /**
   * @description
   *  removeEventListener
   * @example
   *  midi.removeEventListener(1)
   * @function Controller#MidiController#removeEventListener
   * @param {integer} _target - the number of controller being pressed
   *
  */
  self.removeEventListener = function( _target ) {
    nodes.forEach( function(node, i ) {
      if ( node.target == _target ) {
        var removeNode = i
      }
    })
    nodes.splice(i, 1)
  }

  /**
   * @description
   *  addEventListener, expect an array of three values, representing the state and value of your controller
   *
   * @example
   *  function doSomething(_arr ) {
   *    console.log('pressed1', arr) // [ 144, 0, 1 ]
   *  }
   *  midicontroller.addEventListener(1, function() )
   *
   * @function Controller#MidiController#addEventListener
   * @param {integer} _target - the number of controller being pressed
   * @param {function} _callback - the callback to be executed
   *
  */
  _self.addEventListener = function( _target, _callback,  ) {
    nodes.push( { target: _target, callback: _callback } )
    console.log("MIDI listeners: ", nodes)
  }

  /** @function Controller#KeyboardController~dispatchMidiEvent {event}  */
  var dispatchMidiEvent = function(e) {
    nodes.forEach(function( _obj ){
      if ( _obj.target == e.data[1] ) {
        _obj.callback(e.data)
      }
    });
  }
}
