GamePadController.prototype = new Controller();
GamePadController.constructor = GamePadController;

/**
 * @summary
 *  Search and initialize a Gamepad and make event listeners available.
 *  tested with X Box controller
 *  Gamepad Example on codepen:
 *  <a href="https://codepen.io/xangadix/pen/gEzZgx" target="_blank">codepen</a>
 *
 *
 * @description
 *   Check for an example this [video on Youtue](https://www.youtube.com/watch?v=N1AOX8m6U04)
 *   This goes in part with this [Codepen Demo](https://codepen.io/xangadix/pen/gEzZgx)
 *   Buttons are on 0, 1, 2, 3, 4 ... n, axis are on 100, 101, 102, 103, ... 10n
 *
 *  ```
 *   1. button 1
 *   2. button 2
 *   3. button 3
 *   4. button 4
 *   ...
 *   n. button n
 *
 *   100. axis1 x
 *   101. axis1 y
 *   102. axis2 x
 *   103. axis2 y
 *   ...
 *   10n. axisn y
 *   10n. axisn y
 *  ```
 *  ---
 *
 * @example
 *
 *  var gamepad1 = new GamePadController( renderer, {});
 *  gamepad1.init()
 *  gamepad1.render()
 *
 *  // do something on button 1, should return [ 1, 1 ] on down and [ 1, 0 ] on keyup
 *  gamepad1.addEventListener( 1, function( _arr ) { console.log( _arr ) })
 *
 *  // do something with left-axis-x, should return [ 100, 0.34295876 ]
 *  gamepad1.addEventListener( 100, function( _arr ) { console.log( _arr ) })
 *
 *
 * @implements Controller
 * @constructor Controller#GamePadController
 * @param {GlRenderer} renderer - GlRenderer object
 * @param options:Object
 * @author Sense Studios
 */

function GamePadController( _renderer, _options  ) {
  var _self = this

  // exposed variables.
  _self.uuid = "GamePadController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};
  _self.gamepad = {}

  /**  @member Controller#GamePadController#bypass {boolean}*/
  _self.bypass = true

  /** @member Controller#GamePadController#debug {boolean}*/
  _self.debug = false

  /**
   * @description
   *  when multiple devices identify as gamepads, use ie. `gamepad1.gamepad_index = 1` to select the second gamepad [0, 1, 2,  ...]
   *  @member Controller#GamePadController#gamepad_index {integer}
  */
  _self.gamepad_index = 0

  if ( _options ) {
    if ("default" in _options) {}
  }

  // add to renderer
  _renderer.add(_self)

  // counter
  var c = 0

  /**
   * @description
   *  connect, should be automatic, but you can always call gamepad1.connect()
   * @function Controller#GamePadController.connect
   *
  */
  _self.connect =  function() {
    console.log("start gamepads")

    window.addEventListener("gamepadconnected", function(e) {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
      _self.init()
    });

    window.addEventListener("gamepaddisconnected", function(e) {
      console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);
    });

    _self.bypass = false
  }

  /**
   * @description
   *  init, should be automatic, but you can always call gamepad.init() yourself
   * @function Controller#GamePadController~init
   *
  */
  _self.init = function() {
    console.log("init GamePadController.")
    setTimeout( function() {
      try { // try connect
        _self.connect()
      }catch(e){
        console.log("Initial connect failed, hope somebody presses the button v14 ", _self, e)
      }
    }, 1200 )
  }

  /**
   * @description
   *  update, should be automatic, but you can always call gamepad1.update()
   * @function Controller#GamePadController~update
   *
  */
  _self.update = function() {
    if ( _self.bypass ) return;

    // too much info ?
    if ( _self.debug ) console.log( navigator.getGamepads()[0].axes )
    if ( _self.debug ) console.log( navigator.getGamepads()[0].buttons )

    if ( navigator.getGamepads()[_self.gamepad_index] === undefined || navigator.getGamepads()[0] === null ) {
      console.log("Gamepad: No gamepad could be found")
      _self.bypass = true
      return;
    }

    var last_axis = 0
    navigator.getGamepads()[_self.gamepad_index].axes.forEach( function(a, i) {
      dispatchGamePadEvent([i+100, a])

      /*
      if ( _self.easing ) {
        if ( ( a >= 0.12 || a <= -0.12 ) && a != last_axis ) {
          if (_self.debug) console.log(" Axis: ", i + 100, a )
          dispatchGamePadEvent([i+100, a])
          last_axis = a
        }else{
          if (last_axis != 0 ) {
            dispatchGamePadEvent([i+100, 0])
          }
          last_axis = 0
        }
      }
      */
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

  var nodes = []

  /**
   * @description
   *  removeEventListener
   * @example
   *  gamepad.removeEventListener(1)
   * @function Controller#GamePadController#removeEventListener
   * @param {integer} _target - the number of controller being pressed
   *
  */
  self.removeEventListener = function() {}

  /**
   * @description
   *  addEventListener
   * @example
   *  function doSomething(_arr ) {
   *    console.log('pressed1', arr)
   *  }
   *  gamepad.addEventListener(1, function() )
   *
   * @function Controller#GamePadController#addEventListener
   * @param {integer} _target - the number of controller being pressed
   * @param {function} _callback - the callback to be executed
   *
  */
  _self.addEventListener = function( _target, _callback ) {
    nodes.push( { target: _target, callback: _callback } )
    console.log("Gamepad listeners: ", nodes)
  }

  // private? const?
  var dispatchGamePadEvent = function( _arr ) {
    nodes.forEach( function( node, i ) {
      if ( _arr[0] == node.target ) {
        node.callback( _arr )
      }
    })
  }

  /**
   * @description
   *  getNodes -- helper, shows current nodes
   * @function Controller#GamePadController#getNodes
  */
  _self.getNodes = function() {
    return nodes
  }
}
