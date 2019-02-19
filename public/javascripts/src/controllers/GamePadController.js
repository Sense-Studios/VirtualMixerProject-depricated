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
  _self.default_gamepad = 0

  if ( _options ) {
    if ("default" in _options) {}
  }

  // add to renderer
  _renderer.add(_self)

  // this is kind of redundand
  var nodes = []

  _self.showNodes = function() {
    return nodes
  }

  // counter
  var c = 0

  // init with a tap contoller
  _self.init = function() {
    console.log("init GamePadController.")
    //window.addEventListener( 'keydown', keyHandler )

    setTimeout( function() {
      // try connect
      try {
        gamepad.connect()
      }catch(e){
        console.log("hope for the button", e)
      }
    })
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
    //window.addEventListener("GamePadController connected", connecthandler )
    //window.addEventListener("gamepadconnected", connecthandler )

    gamepad.bypass = false
  }

  _self.update = function() {
    // console.log(_self.controllers[0].axes)
    // console.log( navigator.getGamepads()[0].axes )
    // [0.003921627998352051, 0.003921627998352051, 0, 0, 0, 0.003921627998352051, 0.003921627998352051, 0, 0, 3.2857141494750977]
    // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
    //   LP                RP         W
    if ( _self.bypass ) return;
    if ( navigator.getGamepads()[0] === undefined ) {
      console.log("Gamepad: No gamepad could be found")
      return;
    }

    if ( _self.debug ) console.log( navigator.getGamepads()[0].axes )
    //if ( _self.debug ) console.log( navigator.getGamepads()[0].buttons )

    var buttons = navigator.getGamepads()[0].buttons
    //console.log(navigator.getGamePadControllers()[0].buttons)

    var last_axis = 0
    navigator.getGamepads()[0].axes.forEach( function(a, i) {
      if ( ( a >= 0.12 || a <= -0.12 ) && a != last_axis ) {
        if (_self.debug) console.log(" i push you ", i + 100, a )
        dispatchGamePadEvent([i+100, a])
        last_axis = a
      }
    });

    navigator.getGamepads()[0].buttons.forEach(function(b, i){
      //console.log(i, b)
      if ( b.pressed ) {
        if (_self.debug) console.log(" i press you ", i, b.value, b )
        dispatchGamePadEvent([i, b.value])
      }
    })
  }

  _self.render = function() {
    return _self.controllers
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Helpers

  // ---------------------------------------------------------------------------
  _self.removeEventListener = function( _key, _num ) {
    // always remove first ?
  }

  _self.addEventListener = function( _target, _callback ) {
    console.log("gamepad add listener: " , _target, _callback)
    //listeners.push( _target )
    nodes.push( { target: _target, callback: _callback } )
    console.log("gamepad list: ", nodes)
  }

  // private? const?
  var dispatchGamePadEvent = function( _arr ) {
    nodes.forEach( function( node, i ) {
      //console.log(node, i, _arr[0], node.target)
      if ( _arr[0] == node.target ) {
        node.callback( _arr[1] )
      }
    })
  }


  // "Private"

/*
  var addGamePadController = function( GamePadController ) {
    _self.controllers[GamePadController.index] = GamePadController
    console.log(GamePadController.id, GamePadController.index )
  }

  var connecthandler = function( e ) {
    console.log("GamePadController connected at index %d: %s. %d buttons, %d axes.", e.GamePadController.index, e.GamePadController.id);
    addGamePadController(e.GamePadController)
    _self.bypass = false
  }

  var keyHandler = function( _event ) {
    // should be some way to check focus of this BPM instance
    // if _self.hasFocus
    //}
  }
}
*/


/*
window.addEventListener("GamePadControllerconnected", function(e) {
  console.log("GamePadController connected at index %d: %s. %d buttons, %d axes.",
    e.GamePadController.index, e.GamePadController.id,
    e.GamePadController.buttons.length, e.GamePadController.axes.length);
    var gp = navigator.getGamePadControllers()[e.GamePadController.index];
    console.log("GamePadController connected at index %d: %s. %d buttons, %d axes.",
      gp.index, gp.id,
      gp.buttons.length, gp.axes.length);
});
*/

}
