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
  _self.title = ""

  if ( _options ) {
    if ( "title" in _options ) _self.title = _options.title
  }
  // I don't think we need this
  //_renderer.add( _self )

  // ---
  _self.io.on('msg', function( _msg ) {
    console.log( 'got msg', _msg )
  })

  _self.io.on('command', function( _command ) {
    console.log( 'got command', _command )
    if ( _command.command == "welcome") _self.target = _command.payload
    if ( document.getElementById('sockets')) document.getElementById('sockets').innerHTML += "<div>" + _self.title  + " Socket: " + _self.target + "</div>"
  })

  /*
  _self.io.on('sync', function( _command ) ) {
   // got time
   // find attached source
   // (if video?) set time to source
  }
  */

  _self.io.on('controller', function(_msg) {
    if ( _self.debug ) console.log( 'got controller', _msg )

    // { client: _client, trigger: _trigger, commands: _commands }

    nodes.forEach( function( node, i ) {
      if ( _self.debug ) console.log("find node", i, node, _msg, _self.target)
      if (_msg.client == _self.target && node.target == _msg.trigger ) {
      //if ( _arr[0] == node[0] ) {
        if ( _self.debug ) console.log("execute callback!")
        //node[1]( _arr[1] )

        // { client: _client, trigger: _trigger, commands: _commands }
        // if _trigger == node[1]
        node.callback(_msg.commands)

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
  // ---------------------------------------------------------------------------

  /**
   * @description
   *  send info to a client for a trigger
   * @example
   *  socketcontroller.send( "client_123456", 0, [ 1, 2, 3, 4 ] )
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

  var nodes = []

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

  /*
  var dispatchMidiEvent = function(e) {
    nodes.forEach(function( _obj ){
      if ( _obj.target == e.data[1] ) {
        _obj.callback(e.data)
      }
    });
  }


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
