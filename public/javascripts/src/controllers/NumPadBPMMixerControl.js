NumpadBpmMixerControl.prototype = new ComputerKeyboard(); // assign prototype to marqer
NumpadBpmMixerControl.constructor = NumpadBpmMixerControl;  // re-assign constructor

/**
* @description
*  Test en demo controller NumpadBpmMixerControl
*  It's basically a wrapper around a single mixer with the numpad
*
*  ```
*  L / * -
*  7 8 9 +
*  4 5 6 +
*  1 2 3 e
*   0  . e
*  ```
*
* @implements Controller
* @constructor Controller#Keyboard#NumpadBpmMixerControl
* @example var numpad = new NumpadBpmMixerControl( renderer, mixer1, bpm );
* @param {GlRenderer} renderer - GlRenderer object
* @param {Module#Mixer} mixer - a Mixer instance
* @param {Addon#BPM} bpm - a BPM instance
*/

function NumpadBpmMixerControl( renderer, _mixer, _bpm ) {

  var _self = this

  // exposed variables.
  _self.uuid = "NumpadBpmMixer_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};

  var _bpms = []
  var _mixers = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // init with a tap contoller
  _self.init = function() {
    window.addEventListener( 'keydown', keyDownHandler )
    window.addEventListener( 'keyup', keyUpHandler )
  }

  _self.update = function() {}
  _self.render = function() {}

  // ---------------------------------------------------------------------------
  // Helpers

  _self.addMixer = function( _mixer ) {
    _mixers.push( _mixer )

  }

  _self.addBpm = function( _bpm ) {
    _bpms.push( _bpm )
  }

  // --------------------------------------------------------------------------
  var blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ];
  var mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  var _to;

  //$('body').click( function() { _bpms.forEach( function( b ) { b.tap() } ) } );
  document.body.addEventListener('click', function() { _bpms.forEach( function( b ) { b.tap() } ) } );

  var keyDownHandler = function( _event ) {
    // should be some way to check focus of this BPM instance
    // if _self.hasFocus

    // 36 / 103, 38 / 104, 33 / 105, 107

    // 37 / 103, 38 / 101, 39 / 102

    // 35 /  97, 40 /  98, 33 / 105,  13

    // 45 /  96,         , 46 / 110

    console.log("had key: ", _event.which)

    var keybindings = [

      // BPM
      //[ 219, function() { _bpms.forEach( function( b ) { b.bpm -= 1   } ); } ], // [[]
      //[ 221, function() { _bpms.forEach( function( b ) { b.bpm += 1   } ); } ],  // ]
      [ 109, function() { _bpms.forEach( function( b ) { b.bpm -= 1   } ); } ], //  numpad -
      [ 107, function() { _bpms.forEach( function( b ) { b.bpm += 1   } ); } ],  // numpad +

      [ 106, function() { _bpms.forEach( function( b ) { b.bpm *= 2   } ); } ],  // numpad *
      [ 111, function() { _bpms.forEach( function( b ) { b.bpm *= 0.5 } ); } ],  // numpad /

      [ 101, function() { _bpms.forEach( function( b ) { b.tap()      } ); }  ],  // numpad 5

      // hackity
      [  96, function() { switcher1.doSwitch(0) } ],  // 0
      [ 110, function() { switcher1.doSwitch(1) } ],  // .
      [  75, function() { switcher1.doSwitch(0) } ],  // k
      [  76, function() { switcher1.doSwitch(1) } ],  // l
      [  66, function() { _bpms.forEach( function( b ) { b.tap()      } ); }  ],  // b
      [  32, function() { _bpms.forEach( function( b ) { b.tap()      } ); }  ],  // [space]

      // hack
      //[  219, function() { clearTimeout(_to); _to = setTimeout( function() { filemanager1.change() } , 200 ) } ], // [
      [  81, function() { clearTimeout(_to); _to = setTimeout( function() { giphymanager1.change() } , 200 ) } ], // q
      //[  87, function() { clearTimeout(_to); _to = setTimeout( function() { giphymanager1.change() } , 200 ) } ], // w

      [  87, function() { clearTimeout(_to); _to = setTimeout( function() { filemanager2.change("awesome") } , 200 ) } ], // w
      [  69, function() { clearTimeout(_to); _to = setTimeout( function() { filemanager3.change("runner") } , 200 ) } ], // e
      [  82, function() { clearTimeout(_to); _to = setTimeout( function() { filemanager4.change() } , 200 ) } ], // r

      [  65, function() { giphymanager1.source.currentFrame( Math.floor( Math.random() * giphymanager1.source.duration() ) ) } ], // a
      [  83, function() { filemanager2.source.currentTime( Math.floor( Math.random() * filemanager2.source.duration() ) ) } ], // b
      [  68, function() { filemanager3.source.currentTime( Math.floor( Math.random() * filemanager3.source.duration() ) ) } ], // c

      [  188, function() { mixer3.pod( mixer3.pod() - 0.1 ) } ], // ,
      [  190, function() { mixer3.pod( mixer3.pod() + 0.1 ) } ], // .
      //[  190, function() { mixer3.pod( mixer3.pod() + 0.1 ) } ], // .


      // MIXER
      // [ 219, function() { return i -= 1 } ], // 4
      // [ 221, function() { return i += 1 } ]  // 6

      // reset
      [ 104, function() { _mixers.forEach( function(m) { m.blendMode(1); m.mixMode(1); blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ]; mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }) }],  // 8

      [ 103, function() { blendmodes.unshift( blendmodes.pop() ); _mixers.forEach( function(m) { m.blendMode(blendmodes[0]); } ) } ],  // 7
      [ 105, function() { blendmodes.push( blendmodes.shift());   _mixers.forEach( function(m) { m.blendMode(blendmodes[0]); } ) } ],  // 9
      [ 100, function() { mixmodes.unshift( mixmodes.pop() );     _mixers.forEach( function(m) { m.mixMode(mixmodes[0]);     } ) } ],  // 4
      [ 102, function() { mixmodes.push( mixmodes.shift());       _mixers.forEach( function(m) { m.mixMode(mixmodes[0]);     } ) } ],  // 6

      [ 97, function() { console.log("mix trans left, down") } ],  // 6
      //[ 95, function() { transmodes.unshift( transmodes.pop() ); mixmode = transmodes[0]; } ],  // 6
      [ 99, function() { console.log("mmix trans right, down") } ]  // 6

    ]

    keybindings.forEach( function( bind ) {
      if ( bind[0] == _event.which ) {
        bind[1]();
        //console.log("numpad Handled key", bind[0], _bpm.bpm,  _mixer.mixMode(),  _mixer.blendMode() )
        console.log("numpad Handled key DOWN", bind[0], _bpm.bpm,  _mixer.mixMode(),  _mixer.blendMode() )
      }
    })
  }

  var keyUpHandler = function( _event ) {
    var keybindings = [
      [ 97, function() { console.log("mix trans left, up") } ],  // 6
      //[ 95, function() { transmodes.unshift( transmodes.pop() ); mixmode = transmodes[0]; } ],  // 6
      [ 99, function() { console.log("mmix trans right, up") } ]  // 6
    ]

    keybindings.forEach( function( bind ) {
      if ( bind[0] == _event.which ) {
        bind[1]();
        console.log("numpad Handled key UP", bind[0], _bpm.bpm,  _mixer.mixMode(),  _mixer.blendMode() )
      }
    })
  }

}
