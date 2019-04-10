KeyboardController.prototype = new Controller();
KeyboardController.constructor = KeyboardController;

/**
 * @summary
 *  implements keyboard [charcodes](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes) as controllerevents
 *
 * @description
 *  This controller converts keyboard listeners to a Controller. Events are triggered through keyboard [charcodes](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)
 *  It's mainly purposed as an identical interface to the other controllers. Nothing stops you from implementing your own keyboardlisteners
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

  /** @member Controller#KeyboardController#debug {boolean} */
  _self.bypass = true

  /** @member Controller#KeyboardController#debug {boolean} */
  _self.debug = false

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

<<<<<<< HEAD
<<<<<<< HEAD
    // window.document.addEventListener('keydown', function(event) { console.log(event.keyCode) })
=======
>>>>>>> f2d55856a0391c0ba054f3a51a0d091160e73dec
=======
>>>>>>> f2d55856a0391c0ba054f3a51a0d091160e73dec
    document.addEventListener('keydown', (event) => {
      if (_self.debug) console.log( " down ", [ event.keyCode, 1 ] )
      dispatchkeyboardEvent( [ event.keyCode, 1 ] )
    })

    document.addEventListener('keyup', (event) => {
      // const keyName = event.key;
<<<<<<< HEAD
<<<<<<< HEAD
      // console.log( " >>> ", event )
      nodes.forEach( function( node, i ) {
        //console.log( i, node.target, event.keyCode )
        if (node.target ==event.keyCode) {
          node.callback(event);
        }
      })
    })
    // window.keyboard.on.keypress whatever

    // document.addEventListener('keyup', (event) => {
    // so we could use 1090 for z-up, as z is keycode 90, we could use that for 'down' and 1090 10-90 for up
    // so add 10 before it 
  }
=======
      if (_self.debug) console.log( " up ", [ event.keyCode, 0 ] )
      dispatchkeyboardEvent( [ event.keyCode, 0 ] )
    })
>>>>>>> f2d55856a0391c0ba054f3a51a0d091160e73dec
=======
      if (_self.debug) console.log( " up ", [ event.keyCode, 0 ] )
      dispatchkeyboardEvent( [ event.keyCode, 0 ] )
    })
>>>>>>> f2d55856a0391c0ba054f3a51a0d091160e73dec

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

  /**
  * @function Controller#KeyboardController~dispatchkeyboardEvent
  */
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
