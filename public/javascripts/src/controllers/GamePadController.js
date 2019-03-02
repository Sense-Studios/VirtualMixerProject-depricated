GamePadController.prototype = new Controller();  // assign prototype to marqer
GamePadController.constructor = GamePadController;  // re-assign constructor

/**
 * @summary
 *  ---
 *
 * @description
 *
 *  ```
 *   1. button 1
 *   2. button 2
 *   3. button 3
 *   4. button 4
 *   5. button 5
 *   6. button 6
 *   7. button 7
 *   8. button 8
 *   9. button 9
 *   10. button 10
 *   11. button 11
 *   12. button 12
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
 *  let gamepad = new GamePadController( renderer, {});
 *  gamepad.init
 *  gamepad.render
 *  gamepad.addEventListener( 1, function() { ... })   // button 1
 *  gamepad.addEventListener( 100, function() { ... }) // axis
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

  var c = 0      // counter

  /**
   * @description
   *  init, should be automatic, but you can always call my_gamepad.init()
   * @member Controller#GamePadController.init
   *
  */
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
      _self.init()
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
      dispatchGamePadEvent([i+100, a])
      /*
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
   * @param {string} _target - the number of controller being pressed
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
   * @param {string} _target - the number of controller being pressed
   * @param {function} _callback - the callback to be executed
   *
  */
  _self.addEventListener = function( _target, _callback ) {
    nodes.push( { target: _target, callback: _callback } )
    console.log("listeners: ", nodes)
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
