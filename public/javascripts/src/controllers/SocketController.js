SocketController.prototype = new Controller();  // assign prototype to marqer
SocketController.constructor = SocketController;  // re-assign constructor

/**
 * @summary
 *  So the idea is that this component is build into the controller
 *  contacts the 'display', and sends all controller data from here to there.
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

function SocketController( _renderer, _options  ) {
  var _self = this;

  // exposed variables.
  _self.uuid = "SocketController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};
  _self.gamepad = {}
  _self.bypass = true
  _self.debug = false
  _self.socket_pairing_id = "123456"
  _self.relay  //  the object being relayed by the socket

  if ( _options ) {
    if ("default" in _options) {}
  }

  _options = {}
  _renderer.add( _self )

  // ---
  _self.addRelay = function( _relay ) {
    _self.relay = _relay

    // fun thing about numbering your event listeners
    for ( var i = 0; i < 1000; i++ ) {
      relay.addEventListener( i, dispatchSocketEvent )
    }
  }

  // ---


  // ---


  // Helpers
  _self.removeEventListener = function( _target, _callback ) {

  }

  _self.addEventListener = function( _target, _callback ) {

  }

  var dispatchSocketEvent = function( _arr ) {
    nodes.forEach( function( node, i ) {
      //console.log(node, i, _arr[0], node.target)
      if ( _arr[0] == node.target ) {
        node.callback( _arr[1] )
      }
    })
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
