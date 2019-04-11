SocketController.prototype = new Controller();
SocketController.constructor = SocketController;

/**
 * @summary
 *  A Socket controller connects a socket on the client with a sever. This only works if you run the app yourself with a server. And on our website
 *
 * @description
 *  To connect the controller with a client-mixer, you need to place a controller in both. The client will give you a code like _a7fw_ . Use that code in the client-mixer and receive events.
 *  If configured correctly you should be able to send events to multiple clients.
 *
 * @example
 *
 *  // in your client (mixer)
 *  var socket1 = new SocketController( renderer )
 *  // should give you an object:
 *  // got command {command: "welcome", payload: "8170"}
 *
 *  // optionally listen for the ready signal
 *  socketcontroller.addEventListener("ready", function(d) console.log("client id:", d ));
 *
 *  // write the rest of your listeners
 *  socket1.addEventListener( 1, function( _arr ) {
 *   // do something with _arr
 *  })
 *
 *  - - -
 *
 *  // in your controller
 *  var socketcontroller = new SocketController()
 *
 *  // make a way to enter the client-id: 8170
 *
 *  socketcontroller.send( "8170", 1, [1,1] );
 *  socketcontroller.send( "8170", 1, [1,0] );
 *
 * @implements Controller
 * @constructor Controller#SocketController
 * @param options:Object
 * @author Sense Studios
 */

function SocketController( _options  ) {

  var _self = this;

  /** @member Controller#SocketController#io */
  _self.io = io.connect();

  // exposed variables.
  _self.uuid = "SocketController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.bypass = true
  _self.title = ""

  /** * @member Controller#SocketController#debug */
  _self.debug = false

  /** @member Controller#SocketController#socket_pairing_id */
  _self.socket_pairing_id = "no_paring_id"

  /** @member Controller#SocketController#target */
  _self.target = ""

  var nodes = []

  if ( _options ) {
    if ( "title" in _options ) _self.title = _options.title
  }

  // test
  _self.io.on('msg', function( _msg ) {
    console.log( 'got msg', _msg )
  })

  // test
  _self.io.on('test', function( msg ) {
    console.log( 'get test', msg )
  })

  // base command
  _self.io.on('command', function( _command ) {
    console.log( 'got command', _command )
    if ( _command.command == "welcome") {
      _self.target = _command.payload

      // dispatch it as welcome command
      nodes.forEach( function( node, i ) {
        if ( node.target == "welcome" || node.target == "ready" ) {
          node.callback(_command.payload)
        }
      })
    }

    // Depricated
    if ( document.getElementById('sockets')) document.getElementById('sockets').innerHTML += "<div>" + _self.title  + " Socket: " + _self.target + "</div>"
  })

  // controller command
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
   * @param {integer} _target - the number of controller being pressed
   *
  */
  self.removeEventListener = function( _target ) {
    nodes.forEach( function(node, i ) {
      if ( node.target == _target ) {
        var removeNode = i
      }
    })
    nodes.splice(i, 1)
  }

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
   * @param {integer} _target - the number of controller being pressed
   * @param {function} _callback - the callback to be executed
   *
  */
  _self.addEventListener = function( _target, _callback,  ) {
    nodes.push( { target: _target, callback: _callback } )
    console.log("Socket listeners: ", nodes)
  }

  /** @function Controller#KeyboardController~dispatchMidiEvent {event}  */
  var dispatchSocketEvent = function( _arr ) {
    nodes.forEach( function( node, i ) {
      if ( _arr[0] == node.target ) {
        node.callback( _arr )
      }
    })
  }
}
