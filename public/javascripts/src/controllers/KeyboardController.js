KeyboardController.prototype = new Controller();  // assign prototype to marqer
KeyboardController.constructor = KeyboardController;  // re-assign constructor

/**
 * @summary
 *  implements keyboard [charcodes](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)
 *  as controllerevents (allows for sockets)
 *
 *
 * @description
 *
 *  implements keyboard [charcodes](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)
 *  as controllerevents (allows for sockets)
 *
 *
 * @example
 *  var keyboard = new KeyboardController( renderer, {});
 *  keyboard.init();
 *  keyboard.render();
 *
 *  // enter button, should return [13, 1] on keydown and [13,0] on keyup
 *  keyboard.addEventListener( 13, function(_arr) { console.log(_arr) })
 *
 *
 * @implements Controller
 * @constructor Controller#KeyboardController
 * @param options:Object
 * @author Sense Studios
 */

function KeyboardController( _renderer, _options  ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "KeyboardController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};
  _self.keyboard = {}
  _self.bypass = true
  /** @member {boolean} Controller#KeyboardController#debug */
  _self.debug = false

  /** @member {integer} Controller#KeyboardController#keyboard_index */
  _self.keyboard_index = 0

  if ( _options ) {
    if ("default" in _options) {}
  }

  // add to renderer
  _renderer.add(_self)

  var c = 0      // counter

  /**
   * @description
   *  init, should be automatic, but you can always call my_keyboard.init()
   * @function Controller#KeyboardController~init
   *
  */
  _self.init = function() {
    console.log("init KeyboardController.")

    document.addEventListener('keydown', (event) => {
      if (_self.debug) console.log( " down ", [ event.keyCode, 1 ] )
      dispatchkeyboardEvent( [ event.keyCode, 1 ] )
    })

    document.addEventListener('keyup', (event) => {
      // const keyName = event.key;
      if (_self.debug) console.log( " up ", [ event.keyCode, 0 ] )
      dispatchkeyboardEvent( [ event.keyCode, 0 ] )
    })

  }

  /**
   * @description
   *  update, should be automatic, but you can always call my_keyboard.update()
   * @function Controller#KeyboardController~update
   *
  */
  _self.update = function() {
    if ( _self.bypass ) return;

  }

  /**
   * @description
   *  render, should be automatic, but you can always call my_keyboard.render()
   * @function Controller#KeyboardController~render
   *
  */
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
   *  keyboard.removeEventListener(1)
   * @function Controller#KeyboardController#removeEventListener
   * @param {string} _target - the number of controller being pressed
   *
  */
  self.removeEventListener = function() {}

  /**
   * @description
   *  addEventListener
   * @example
   *  function doSomething( _arr ) {
   *    console.log('pressed1', arr);
   *  }
   *  keyboard.addEventListener(1, function( _arr ) { console.log( _arr ) } );
   *
   * @function Controller#KeyboardController#addEventListener
   * @param {string} _target - the number of controller being pressed
   * @param {function} _callback - the callback to be executed
   *
  */
  _self.addEventListener = function( _target, _callback ) {
    nodes.push( { target: _target, callback: _callback } )
    console.log("Keyboard listeners: ", nodes)
  }

  // private? const?
  var dispatchkeyboardEvent = function( _arr ) {
    nodes.forEach( function( node, i ) {
      if ( _arr[0] == node.target ) {
        node.callback( _arr )
      }
    })
  }

  /**
   * @description
   *  getNodes, helper, shows current nodes
   * @function Controller#KeyboardController#getNodes
  */
  _self.getNodes = function() {
    return nodes
  }
}
