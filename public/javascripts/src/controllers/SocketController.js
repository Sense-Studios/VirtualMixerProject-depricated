SocketController.prototype = new Controller();  // assign prototype to marqer
SocketController.constructor = SocketController;  // re-assign constructor

/**
 * @summary
 *  So the idea is that this component is build into the controller
 *  contacts the 'display', and sends all controller data from here to there.
 *  So it servers as an intermediary of the real controller
 *
 * @description
 *  ---
 *
 * @example
 *  ---
 *
 * @implements Controller
 * @constructor Controller#SocketController
 * @param options:Object
 * @author Sense Studios
 */

function SocketController( _options  ) {
  var _self = this;

  // exposed variables.
  _self.uuid = "SocketController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.bypass = true
  _self.title = ""
  /** * @member Controller#SocketController#debug */
  _self.debug = false

  /**
   * @member Controller#SocketController#socket_pairing_id
  */
  _self.socket_pairing_id = "123456"
  _self.io = io.connect();

  /**
   * @member Controller#SocketController#target
  */
  _self.target = ""

  /**
   * @member Controller#SocketController#title
  */

  var nodes = []

  if ( _options ) {
    if ( "title" in _options ) _self.title = _options.title
  }

  _self.io.on('msg', function( _msg ) {
    console.log( 'got msg', _msg )
  })

  _self.io.on('command', function( _command ) {
    console.log( 'got command', _command )
    if ( _command.command == "welcome") _self.target = _command.payload
    if ( document.getElementById('sockets')) document.getElementById('sockets').innerHTML += "<div>" + _self.title  + " Socket: " + _self.target + "</div>"
  })

  _self.io.on('controller', function(_msg) {
    if ( _self.debug ) console.log( 'got controller', _msg )
    nodes.forEach( function( node, i ) {
      if ( _self.debug ) console.log("find node", i, node, _msg, _self.target)
      if (_msg.client == _self.target && node.target == _msg.trigger ) {
        if ( _self.debug ) console.log("execute callback!")
        node.callback(_msg.commands)
      }
    })
  })

  _self.io.on('test', function( msg ) {
    console.log( 'get test', msg )
  })

  // ---
  // ---------------------------------------------------------------------------

  /**
   * @description
   *  send info, an _commands array, to a client
   * @example
   *  socketcontroller.send( "a78r", 0, [ 1, 2, 3, 4 ] )
   *
   * @function Controller#SocketController#send
   * @param {string} _client - the number of controller being pressed
   * @param {integer} _trigger - the number of controller being pressed
   * @param {array} _commands - the number of controller being pressed
   *
  */
  _self.send = function( _client, _trigger, _commands ) {
    if ( _self.debug ) console.log("Socket send to: ", _client, ", trigger:", _trigger, " commands ", _commands )
    _self.io.emit("controller", { client: _client, trigger: _trigger, commands: _commands } )
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /**
   * @description
   *  removeEventListener -- Not Implemented
   * @example
   *  socketcontroller.removeEventListener(1)
   * @function Controller#SocketController#removeEventListener
   * @param {string} _target - the number of controller being pressed
   *
  */
  self.removeEventListener = function( _target ) {}

  /**
   * @description
   *  addEventListener
   * @example
   *  function doSomething(_arr ) {
   *    console.log('pressed1', arr)
   *  }
   *  socketcontroller.addEventListener(1, function() )
   *
   * @function Controller#SocketController#addEventListener
   * @param {string} _target - the number of controller being pressed
   * @param {function} _callback - the callback to be executed
   *
  */
  _self.addEventListener = function( _target, _callback,  ) {
    nodes.push( { target: _target, callback: _callback } )
    console.log("Socket listeners: ", nodes)
  }

  // private? const?
  var dispatchSocketEvent = function( _arr ) {
    nodes.forEach( function( node, i ) {
      if ( _arr[0] == node.target ) {
        node.callback( _arr )
      }
    })
  }
}
