GamePadController.prototype = new Controller();  // assign prototype to marqer
GamePadController.constructor = GamePadController;  // re-assign constructor

/**
 * @summary
 *  ---
 *
 * @description
 *  ```
 *   button_1, down, up, click, longpress, doubleclick
 *   button_2, ...
 *   axes_1
 *   axes_2
 *   axes_3 ...
 *  ```
 *  ---
 *
 * @example
 *  let gamepad = new GamePadController( renderer, {});
 *  gamepad.addEventListener("button_1", function() { ... })
 *  gamepad.addEventListener("left_x", function() { ... })
 *
 *
 * @implements Controller
 * @constructor Controller#GamePadController
 * @param options:Object
 * @author Sense Studios
 */

function GamePadController( _renderer, _options  ) { // _mixer1, _mixer2, _mixer3
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "GamePadController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};
  _self.gamepad = {}
  _self.bypass = true
  _self.debug = false
  _self.gamepad_index = 0

  if ( _options ) {
    if ("default" in _options) {}
  }

  // add to renderer
  _renderer.add(_self)

  var nodes = [] // for storing the listener objects
  var c = 0      // counter

  // init with a tap contoller
  _self.init = function() {
    console.log("init GamePadController.")
    setTimeout( function() {
      try { // try connect
        gamepad.connect()
      }catch(e){
        console.log("Initial connect failed, hope somebody presses the button", e)
      }
    }, 500 )
  }

  _self.connect =  function() {
    console.log("start gamepads")

    window.addEventListener("gamepadconnected", function(e) {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    });

    window.addEventListener("gamepaddisconnected", function(e) {
      console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);
    });

    gamepad.bypass = false
  }

  _self.update = function() {
    if ( _self.bypass ) return;

    // too much info
    //if ( _self.debug ) console.log( navigator.getGamepads()[0].axes )
    //if ( _self.debug ) console.log( navigator.getGamepads()[0].buttons )

    if ( navigator.getGamepads()[_self.gamepad_index] === undefined || navigator.getGamepads()[0] === null ) {
      console.log("Gamepad: No gamepad could be found")
      _self.bypass = true
      return;
    }

    var last_axis = 0
    navigator.getGamepads()[_self.gamepad_index].axes.forEach( function(a, i) {
      if ( ( a >= 0.12 || a <= -0.12 ) && a != last_axis ) {
        if (_self.debug) console.log(" Axis: ", i + 100, a )
        dispatchGamePadEvent([i+100, a])
        last_axis = a
      }
    });

    navigator.getGamepads()[_self.gamepad_index].buttons.forEach(function(b, i){
      if ( b.pressed ) {
        if (_self.debug) console.log(" Button: ", i, b.value, b )
        dispatchGamePadEvent([i, b.value])
      }
    })
  }

  _self.render = function() {
    return _self.controllers
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  _self.removeEventListener = function( _key, _num ) {
    // TODO
    // always remove first ?
  }

  _self.addEventListener = function( _target, _callback ) {
    //console.log("gamepad add listener: " , _target, _callback)
    //listeners.push( _target )
    nodes.push( { target: _target, callback: _callback } )
    console.log("gamepad listeners: ", nodes)
  }

  // private? const?
  var dispatchGamePadEvent = function( _arr ) {
    nodes.forEach( function( node, i ) {
      if ( _arr[0] == node.target ) {
        node.callback( _arr )
      }
    })
  }
  _self.getNodes = function() {
    return nodes
  }
}
