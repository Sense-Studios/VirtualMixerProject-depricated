MidiController.prototype = new Controller();  // assign prototype to marqer
MidiController.constructor = MidiController;  // re-assign constructor

/**
 * @implements Controller
 * @constructor Controller#Midi
 * @interface
 */

function MidiController( _options ) {
  // base

  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "MidiController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "MidiController"
  _self.bypass = true
  _self.verbose = false
  _self.ready = false
  _self.controllers = {};

  // source.renderer ?
  var nodes = []
  var binds = []

  // counter
  var c = 0

  // add to renderer
  //_renderer.add(_self)

  // needed for the program
  var midi, input, output

  // we have success!
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
      // initMidi()
  	}

    console.log("Midi READY")
    _self.ready = true
  }

  // everything went wrong.
  var failure = function () {
  	console.error('No access to your midi devices.');
  }

  // request MIDI access
  console.log("Midi check... ")
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
      .then( success, failure );
  }

  function initMidi() {
    if ( _self.verbose ) console.log(" MIDI READY", "ready")
    dispatchMidiEvent("ready")
  }

  // some examples, this is the 'onpress' (and on slider) function
  var doubleclickbuffer = [ 0, 0, 0, 0 ]
  var doubleclickPattern = [ 128, 144, 128, 144 ]
  var doubleclick = false

  _self.onMIDIMessage = function(e) {
    if (_self.verbose) console.log(" MIDIMESSAGE >>", e.data)
    checkBindings(e.data)
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
  _self.init = function() {}
  _self.update = function() {}


  // ---------------------------------------------------------------------------
  _self.bind = function( _key, _callback ) {
    binds.push( { key: _key, callback: _callback } )
    // check for double binds ?
  }

  _self.removeBind = function( _key, _num ) {
    // always remove first ?
  }

  // [ state, key, velocity ]
  var checkBindings = function(e) {
    binds.forEach( function( _obj ) {
      if ( e[1] == _obj.key ) _obj.callback(e)
    });
  }

  _self.send = function( commands ) {
    if (_self.ready) {
      //console.log("Midi send ", commands, "to", output)
      output.send( commands )
    }else{
      console.log("Midi is not ready yet")
    }
  }

  _self.addEventListener = function( _callbackName, _target ) {
    console.log("midi add listener: " , _callbackName)
    //listeners.push( _target )
    nodes.push({callbackName: _callbackName, target: _target})
    console.log("midi list: ", nodes)
  }

  var dispatchMidiEvent = function(e) {
    nodes.forEach(function( _obj ){
      _obj.target[_obj.callbackName](e)
    });
  }
}
