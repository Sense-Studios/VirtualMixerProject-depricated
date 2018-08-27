function FireBaseControl( renderer, _mixer1, _mixer2, _mixer3 ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "FireBaseControl_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.clients = {};
  _self.bypass = true

  // source.renderer ?
  var _mixers = []
  var _filemanagers = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // Firebase refs
  var _dbRef, _clientRef, _client, clients
  var leftx = 0
  var lefty = 0

  // init with a tap contoller
  _self.init = function() {
    console.log("init FireBase contoller.")
    // window.addEventListener( 'keydown', keyHandler )
    // window.addEventListener("gamepadconnected", connecthandler )

    // This is just another firebase, but it should be removed from the
    // code and added in a tutorial on firebase.

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDgrYfOUDN1QLRDcY4z45WwkcOjkXiImNQ",
      authDomain: "mixerbase-829c2.firebaseapp.com",
      databaseURL: "https://mixerbase-829c2.firebaseio.com",
      storageBucket: "mixerbase-829c2.appspot.com",
      messagingSenderId: "568387460963"
    };

    firebase.initializeApp(config);

    _dbRef = firebase.database()
    _clientRef = "/client_1/"
    _client = _dbRef.ref(_clientRef)
    clients = []

    //$.each( clients, function( i, c ) {
    //  c.dbref.ref('/client/').on('value', function( e ) {
    //    c.update( e )
    //  })
    //})

    _client.on('value', function(e) {
      //console.log("I update you", e)
      //console.log( _client.child( "/leftx" ).val() )
      //console.log( _client.child( "/lefty" ).val() )
    });

    // a overwritable timer interval to avoid collisions
    var _to

    _client.child( "gamepad/leftx" ).on('value', function(e) {
      leftx = e.val()
      updateMixers( leftx, lefty )
    })

    _client.child( "gamepad/lefty" ).on('value', function(e) {
      lefty = e.val()
      updateMixers( leftx, lefty )
    })

    _client.child( "gamepad/button_1" ).on('value', function(e) {
      //clearTimeout(_to); _to = setTimeout( function() { filemanager1.change() } , 200 )
      clearTimeout(_to); _to = setTimeout( function() { giphymanager1.change() } , 200 )
    })

    _client.child( "gamepad/button_2" ).on('value', function(e) {
      clearTimeout(_to); _to = setTimeout( function() { filemanager2.change() } , 200 )
    })

    _client.child( "gamepad/button_3" ).on('value', function(e) {
      clearTimeout(_to); _to = setTimeout( function() { filemanager3.change() } , 200 )
    })

    _client.child( "gamepad/button_4" ).on('value', function(e) {
      clearTimeout(_to); _to = setTimeout( function() { filemanager4.change() } , 200 )
    })

    // init firebase
    var i = 0
    while(i < 17) {
      _client.child( "mobilepad/button_" + i ).on('value', function(e) {
        console.log('i click you', i, e.key)
      })
      i++;
    }
  }

  _self.update = function() {}
  _self.render = function() {}

  // ---------------------------------------------------------------------------
  // Helpers

  _self.addMixer = function( _mixer ) {
    _mixers.push( _mixer )
  }

  _self.addFileManager = function( _filemanager ) {
    _filemanagers.push( _filemanager )
  }

  // ---------------------------------------------------------------------------
  // "Private"

  var updateMixers = function( leftx, lefty ) {
    // might need some more tweaking, to make this more flexible
    // or, we just add some behaviour and/or configuration
    // oringal GANSTA SENSE STYLE
    // _mixers[0].pod( leftx/2+0.5 )
    // _mixers[1].pod( leftx/2+0.5 )
    // _mixers[2].pod( lefty/2+0.5 )
    console.log("update mixers")
    _mixer1.pod( leftx/2+0.5 )
    _mixer2.pod( leftx/2+0.5 )
    _mixer3.pod( lefty/2+0.5 )

  }

  var updateButton = function( _button ) {
    /*
    if ( i == 0 ) { clearTimeout(to1); to1 = setTimeout( function() { filemanager1.change(); } , 200 ) }
    if ( i == 1 ) { clearTimeout(to2); to2 = setTimeout( function() { filemanager2.change(); } , 200 ) }
    if ( i == 2 ) { clearTimeout(to3); to3 = setTimeout( function() { filemanager3.change(); } , 200 ) }
    if ( i == 3 ) { clearTimeout(to4); to4 = setTimeout( function() { filemanager4.change(); } , 200 ) }
    */
  }

  var keyHandler = function( _event ) {
    // should be some way to check focus of this BPM instance
    // if _self.hasFocus
    //}
  }
}


/*
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
    var gp = navigator.getGamepads()[e.gamepad.index];
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      gp.index, gp.id,
      gp.buttons.length, gp.axes.length);
});
*/
