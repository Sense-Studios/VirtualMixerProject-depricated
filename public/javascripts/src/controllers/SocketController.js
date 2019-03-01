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
  _self.debug = false
  _self.socket_pairing_id = "123456"
  _self.io = io.connect(); // 'http://83.137.150.207:3001'
  _self.target = ""

  nodes = []
  if ( _options ) {}

  // I don't think we need this
  //_renderer.add( _self )

  // ---
  _self.io.on('msg', function( _msg ) {
    console.log( 'got msg', _msg )
  })

  _self.io.on('command', function( _command ) {
    console.log( 'got command', _command )
    if ( _command.command == "welcome") _self.target = _command.payload
  })

  _self.io.on('controller', function(_arr) {
    if ( _self.debug ) console.log( 'got controller', _arr )

    nodes.forEach( function( node, i ) {
      if ( _arr[0] == node[0] ) {
        node[1]( _arr[1] )

        // dispatchEvent( client, 1, )
        // _obj.target(e.data) [ x, y, z ]
      }
    })
  })

  _self.io.on('test', function( msg ) {
    console.log( 'get test', msg )
    // emit to findsocket(uuid)
  })

  // ---

  // Helpers
  _self.removeEventListener = function( _target, _callback ) {

  }

  // nodes = [ [ 1, func() ] ]
  _self.addEventListener = function( _target, _callback ) {
    nodes.push( [ _target, _callback ] )
    // nodes.push( { target: _target, callback: _callback } )
    _self.io.on(_target, function( _msg, _target ) {
      console.log( 'got custom target msg', _msg, _target )
    })

    console.log("socketcontroller got listener", _target, _callback)
    console.log(">>> ", nodes )
  }

  // depricated
  var dispatchSocketEvent = function( _arr ) {
    console.log("socket dispatching")
    nodes.forEach( function( node, i ) {
      //console.log(node, i, _arr[0], node.target)
      if ( _arr[0] == node.target ) {
        node.callback( _arr[1] )
        _self.io.emit( _arr )
      }
    })
  }

  _self.dispatchEvent = function( _command, _target, _payload ) {
    //target
    console.log("going to send " + JSON.stringify(_payload) + " to: ", _target, " by ", _command )
    _self.io.emit(_command, {target:_target, command:_command, payload:_payload});
  }

  _self.bind = function( _num, _arr ) {
    // bind an event ?
  }
}

/*
    // -------------------------------------------------------------------------
    // sending side
    var gamepad = new GamePadController( renderer, {} )

    // creates the sockets
    var socket = new SocketController( renderer, { uuid: '123', controller: gamepad } );

    // -------------------------------------------------------------------------
    // receiving side
    var socket = new SocketController( renderer, { uuid: '123', controller: ''})
    socket.addEventListener( 1, function )
    socket.addEventListener( 1, function )
    socket.addEventListener( 1, function )

*/
