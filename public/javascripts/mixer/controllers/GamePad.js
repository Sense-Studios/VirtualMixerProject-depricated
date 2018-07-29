function GamePad( renderer, _mixer1, _mixer2, _mixer3 ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "GamePad_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};
  _self.bypass = true

  // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // init with a tap contoller
  _self.init = function() {
    console.log("init GamepadController contoller.")
    //window.addEventListener( 'keydown', keyHandler )

    window.addEventListener("gamepadconnected", connecthandler )


  }

  var to1, to2, to3, to4, to5, to6, to7, to8
  var lock
  _self.update = function() {
    // console.log(_self.controllers[0].axes)
    // console.log( navigator.getGamepads()[0].axes )
    // console.log( navigator.getGamepads()[0].axes
    // [0.003921627998352051, 0.003921627998352051, 0, 0, 0, 0.003921627998352051, 0.003921627998352051, 0, 0, 3.2857141494750977]
    // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
    //   LP                RP         W
    if ( _self.bypass ) return;

    var buttons = navigator.getGamepads()[0].buttons
    //console.log(navigator.getGamepads()[0].buttons)
    navigator.getGamepads()[0].buttons.forEach(function(b, i){
      if ( b.pressed ) {
        console.log(" i press you ", i, b)
        // HACKITY

        // if we use thje same timeout it worsk too
        if ( i == 0 ) { clearTimeout(to1); to1 = setTimeout( function() { filemanager1.change(); } , 200 ) }
        if ( i == 1 ) { clearTimeout(to2); to2 = setTimeout( function() { filemanager2.change(); } , 200 ) }
        if ( i == 2 ) { clearTimeout(to3); to3 = setTimeout( function() { filemanager3.change(); } , 200 ) }
        if ( i == 3 ) { clearTimeout(to4); to4 = setTimeout( function() { filemanager4.change(); } , 200 ) }

        // if ( i == 4 ) { clearTimeout(to1); to1 = setTimeout( function() { VideoSource. } , 200 ) }
        // if ( i == 5 ) { clearTimeout(to1); to1 = setTimeout( function() { } , 200 ) }
        // if ( i == 6 ) { clearTimeout(to1); to1 = setTimeout( function() { } , 200 ) }
        // if ( i == 7 ) { clearTimeout(to1); to1 = setTimeout( function() { } , 200 ) }

      }
    })

    var axes = navigator.getGamepads()[0].axes
    var leftx = axes[0];
    var lefty = axes[1];

    var rightx = axes[5];
    var righty = axes[6];

    var weird = axes[9];

    // oringal GANSTA SENSE STYLE
    _mixer1.pod(leftx/2+0.5)
    _mixer2.pod(leftx/2+0.5)
    _mixer3.pod(lefty/2+0.5)

    // oringal GANSTA SENSE STYLE
    //_mixer1.pod(Math.abs(leftx))
    //_mixer2.pod(Math.abs(lefty))
    //_mixer3.pod(lefty/2+0.5)


  }

  // ---------------------------------------------------------------------------
  // Helpers

  _self.add = function( _func ) {
    nodes.push( _func )
  }

  _self.render = function() {
    return _self.controllers
  }

  // ---------------------------------------------------------------------------
  // "Private"

  var addgamepad = function( gamepad ) {
    _self.controllers[gamepad.index] = gamepad
    console.log(gamepad.id, gamepad.index )
  }

  var connecthandler = function( e ) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id);
    addgamepad(e.gamepad)
    _self.bypass = false
  }

  var keyHandler = function( _event ) {
    // should be some way to check focus of this BPM instance
    // if _self.hasFocus
    //}
  }
}


/*
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
    var gp = navigator.getGamepads()[e.gamepad.index];
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      gp.index, gp.id,
      gp.buttons.length, gp.axes.length);
});
*/
