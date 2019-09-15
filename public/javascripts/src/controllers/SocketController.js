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
 *  // in your client (output)
 *  // https://virtualmixproject.com/mixer/demo_socket_client
 *
 *  var socket1 = new SocketController( renderer )
 *  socket1.debug = true
 *
 *  // this should log a server welcome object with a uid
 *  // got command {command: "welcome", payload: "8170"}

 *  console.log(socket1.target)
 *  > 8170
 *
 *  // should give you an string:"8170",
 *  // make sure your user sees this string, so he can connects his _remote_ to this _client_
 *
 *  // optionally listen for the ready signal, which gives you the id too
 *  socket1.addEventListener("ready", function(d) console.log("client id:", d ));
 *  > client id: 8170
 *
 *  // write the rest of your listeners
 *  socket1.addEventListener( 1, function( _arr1 ) {
 *   // do something with _arr1
 *  })
 *
 *  socket1.addEventListener( 2, function( _arr2 ) {
 *   // do something with _arr2
 *  })
 *
 *  socket1.addEventListener( 3, function( _arr3 ) {
 *   // do something with _arr3
 *  })
 *
 *  - - -
 *
 *  // in your controller (input, 'remote control')
 *  // https://virtualmixproject.com/remotes/demo_socketcontroller_remote
 *
 *  var socketcontroller = new SocketController()
 *
 *  // make a way to enter the client-id: ( in this example: 8170 )
 *  var get_client_id = ()=> { return document.getElementById('socket_client_id').value }
 *
 *  // send trigger 1 to socket get_client_id, may send to multiple ids: "8170,af44" always lowecase
 *  // _commands are mostly arrays of numbers or strings, but can be interpreted on the client.
 *  // [ "mixer1", "blend", 6 ]
 *  // [ "mixer1", "pod", gamepad1.x-axis ]
 *  // etc.
 *
 *  socketcontroller.send( get_client_id(), 1, [1,1] );
 *  socketcontroller.send( get_client_id(), 1, [1,0] );
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
  _self.io.on('test', function( msg ) {
    console.log( 'got test', msg )
  })

  // command
  _self.io.on('command', function( _command ) {
    console.log( 'got command', _command )

    // always send the welcome command, might rename, it can be fired after server resets
    if ( _command.command == "welcome") {
      _self.target = _command.payload

      // dispatch it as welcome command
      nodes.forEach( function( node, i ) {
        if ( node.target == "welcome" || node.target == "ready" ) {
          node.callback(_command.payload)
        }
      })
    }

    // when a reset of the target is requested
    if ( _command.command == "reset_uuid") {
      console.log("reset uuid", _command.payload)
      _self.target = _command.payload

      // dispatch it as reset  command
      nodes.forEach( function( node, i ) {
        if ( node.target == "reset_uuid" || node.target == "reset" ) {
          node.callback(_command.payload)
        }
      })

    }

    // Depricated, write your own html to display
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
   *  socketcontroller.send( "a78r", 0, [ "mixer1", "blend", 6 ] )
   *  socketcontroller.send( "a78r", 112, [ "mixer1", "pod", gamepad1.x-axis ] )
   *  socketcontroller.send( "a78r", 15, [ 1, 2, 3, 4 ] )
   *
   * @function Controller#SocketController#send
   * @param {string} _client - the client uid to be sent to, ie. ad48
   * @param {integer} _trigger - unique id of the command, to be interpreted on the client
   * @param {array} _commands - the actual _commands being send
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
   *  removeEventListener, removes event listeners.
   * @example
   *  socketcontroller.removeEventListener(1)
   * @function Controller#SocketController#removeEventListener
   * @param {integer} _trigger - the unique id of the command to be sent
   *
  */
  self.removeEventListener = function( _trigger ) {
    nodes.forEach( function(node, i ) {
      if ( node.target == _trigger ) {
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
   * @param {integer} _trigger - the unique id of the command to be sent
   * @param {function} _callback - a function that executes when the trigger fires
   *
  */
  _self.addEventListener = function( _trigger, _callback,  ) {
    nodes.push( { target: _trigger, callback: _callback } )
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
