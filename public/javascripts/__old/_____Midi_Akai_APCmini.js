Midi_Akai_APCmini.prototype = new Midi();  // assign prototype to marqer
Midi_Akai_APCmini.constructor = Midi_Akai_APCmini;  // re-assign constructor

// based on https://gist.github.com/xangadix/936ae1925ff690f8eb430014ba5bc65e
// ONLY WORKS PARTIALLY WITHOUT HTTPS://

/**
* @summary
*  Demo controller for midi interfaces
*
* @description
*  Demo controller MidiController, implements controller and midicontroller
*  for an AKAI APC Mini
*  For some MIDI functions HTTPS is required!
*  also see https://gist.github.com/xangadix/936ae1925ff690f8eb430014ba5bc65e
*
* @implements Controller#Midi
* @constructor Controller#Midi#MidiController
* @example var myMidicontroller = new MidiController( _renderer, _options );
* @param {GlRenderer} renderer - GlRenderer object
* @param {Options} options - options object
*/

function Midi_Akai_APCmini( _renderer, _options ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  console.log(" We have Midi_Akai_APCmini")
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Midi_Akai_APCmini_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Midi_Akai_APCmini"

  // add to renderer
  _renderer.add(_self)

  //console.log("Midi_Akai_APCmini add listener")
  //_self.addEventListener( "onMidi_Akai_APCminiMessage", this )

  // counter
  var c = 0

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
  var faders        = [ 0, 0, 0 ,0 , 0 , 0 , 0 , 0 ,0 ] // 0-127
  var faders_opaque = [ 0, 0, 0 ,0 , 0 , 0 , 0 , 0 ,0 ] // 0-1
  var listeners = []

  var commands = []
  // send the comand

  function initMidi() {
    // make everything red!
    var commands = []
    midimap.forEach( function( row, i ) {
      row.forEach( function( value, j ) {
        commands.push( 0x90, value, RED_BLINK )
      });
    });

    // switch the rest off, if there is still some led on
    rest.forEach( function( r, i ) {
      commands.push( 0x90, r, OFF )
    });

    // send the comand
    _self.output.send( commands );

    console.log("self", _self.output)
    console.log("this", this)

    // start the bpm sync
    var bpmonoff = true
    _self.blinkCallBack = function(_on) {
      if (bpmonoff) {
        //output.send( [ 0x90, 82, OFF ] )
        bpmonoff = false
      }else{
        //output.send( [ 0x90, 82, GREEN ] )
        bpmonoff = true
      }
    }

    //initRunText()
  }

  // some examples, this is the 'onpress' (and on slider) function
  var doubleclickbuffer = [ 0, 0, 0, 0 ]
  var doubleclickPattern = [ 128, 144, 128, 144 ]
  var doubleclick = false

  _self.onMIDIMessage = function(e) {
    // hello from Midi_Akai_APCmini
    //console.log(e.data)

    // Uint8Array(3) [176, 48, 117]
    // [ state, key, velocity ]
    // ### = state
    // 144 = down
    // 112 = up
    // 176 = sliding ( fader ) or velocity (note)
    //
    if (e == "ready") initMidi();
    console.log(" MIDIMESSAGE from Midi_Akai_APCmini >>", e.data)
    initRunText()
  }

  function aap_onMIDIMessage(e) {
    //console.log(e.data)

    // Uint8Array(3) [176, 48, 117]
    // [ state, key, velocity ]
    // state
    // 144 = down
    // 112 = up
    // 176 = sliding ( fader )
    //

    console.log(">>", e.data)

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
        output.send( [ 0x90, e.data[1], GREEN_BLINK ] )
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
  		output.send(commands)

  	}else if (e.data[1] == 65) {
  		// switch the main pads yellow
  		var commands = []
  		midimap.forEach( function( row, i ) {
  			row.forEach( function( value, j ) {
  				commands.push( 0x90, value, YELLOW )
  			})
  		})
      output.send( commands )

  	}else{
  		// press a button, make it green
      if (e.data[0] == 128 ) {
        output.send( [ 0x90, e.data[1], OFF ] );
        //chain1.setChainLink(e.data[1], 0)
        //console.log("toggle chain")
        doubleclick = false
      }

      if (e.data[0] == 144  ) {
        output.send( [ 0x90, e.data[1], GREEN ] );
        //chain1.setChainLink(e.data[1], faders[e.data[1]]/126)
        //console.log("toggle chain", faders[e.data[1]], e.data[1] )
        faders_opaque[e.data[1]] = 0
        doubleclick = false
      }
  	}
  }


  // init with a tap contoller
  _self.init = function() {
    console.log("init Midi_Akai_APCmini controller.")
    //window.addEventListener( 'keydown', keyHandler )
  }
  _self.update = function() {}

  _self.addEventListener = function( _num, _callback ) {
    listeners.push({ btn: _num, cb: _callback })
  }

  // ---------------------------------------------------------------------------
  // Helpers

  var initRunText = function() {
      var text = [
        [ 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0 ],
        [ 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0 ],
        [ 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0 ],
        [ 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0 ],
        [ 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0 ],
        [ 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
        [ 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
        [ 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ]
      ]


      var text = [
        [ 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0 ],
        [ 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1 ],
        [ 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
        [ 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0 ],
        [ 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1 ],
        [ 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1 ],
        [ 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1 ],
        [ 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0 ]
      ]

      var text = [
        [1,	1,	1,	0,	0,	1,	1,	1,	0,	0,	0,	1,	1,	1,	0,	0,	0,	1,	1,	1,	0,	0,	1,	1,	1,	0,	0,	0,	0,	1,	1,	1,	1,	0,	0,	0,	1,	1,	1,	0,	0,	0,	0,	1,	1,	1,	0,	0,	1,	1,	1,	1,	1,	0,	0],
        [0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	1,	0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	0,	1,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	1,	0,	0,	0,	0,	0,	0],
        [0,	1,	0,	0,	1,	1,	1,	0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	1,	1,	1,	0,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	1,	0,	0,	0,	0,	0,	0],
        [0,	1,	0,	0,	0,	0,	0,	1,	0,	0,	1,	1,	1,	1,	1,	0,	0,	0,	1,	0,	0,	0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	1,	1,	1,	1,	1,	0,	0,	1,	1,	1,	1,	1,	0,	1,	1,	1,	1,	0,	0,	0],
        [0,	1,	0,	0,	0,	0,	0,	0,	1,	0,	1,	0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	1,	0,	0,	1,	0,	0,	1,	1,	1,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	1,	0,	0,	0,	0,	0,	0],
        [0,	1,	0,	0,	0,	0,	0,	0,	1,	0,	1,	0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	0,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	0,	1,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	1,	0,	0,	0,	0,	0,	0],
        [0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	1,	0,	0,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	0,	1,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	1,	0,	0,	0,	0,	0,	0],
        [1,	1,	1,	0,	0,	1,	1,	1,	0,	0,	1,	0,	0,	0,	1,	0,	0,	1,	1,	1,	0,	0,	1,	1,	1,	0,	0,	0,	0,	1,	1,	1,	1,	0,	0,	1,	0,	0,	0,	1,	0,	0,	1,	0,	0,	0,	1,	0,	1,	0,	0,	0,	0,	0,	0]
      ]

      var c = 0
      var runText = function() {
        var message = []
        for ( var y = 0; y < text.length; y++ ) {
          for ( var x = 0; x < text[y].length; x++ ) {
              if ( y < midimap.length ) {
                if (x < midimap[y].length ) {
                    if ( text[y][x+c] == 1 ) {
                      message.push( 0x90, midimap[y][x], RED );
                    if ( text[y][x+c] == 2 ) {
                        message.push( 0x90, midimap[y][x], GREEN );
                    }else{
                      message.push( 0x90, midimap[y][x], OFF );
                    }
                }
              }
          }
        }
        _self.output.send( message )
      }

      setInterval( function() {
        runText()
        console.log("tik")
        c++
        if ( c > text[0].length )  c = -8
      }, 250)
    }
  } // end runtext
}
