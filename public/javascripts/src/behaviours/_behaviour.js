function Behaviour( renderer, options ) {

  // create and instance
  var _self = this;

  // set or get uid
  _self.uuid = "Behaviour" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Behaviour"

  renderer.add(_self)

  function addTrigger( _obj ) {
    triggers.push( { obj }, time, beats )

  }

  function fireTrigger( _obj ) {
    obj[trigger.action.method], trigger.action.args, trigger.mod

    // should repeat?
  }

  triggers = []

  _self.init = function (){}
  _self.update = function(){
    triggers.each( function( t, i) {
      console.log(t)
    })
  }

  _self.load = function( _behaviour ) {

    console.log("LOADED A Behaviour")
    _behaviour.triggers.forEach( function( trigger, i) {

      if ( trigger.action.on !== undefined) {
        trigger.action.on.forEach( function( obj, i ) {
          addTrigger( obj )
          // filemanager1.changez()
        })
      }

      if ( trigger.action.with !== undefined ) {
        trigger.action.width.forEach( function( obj, i ) {
          init.filemanager1 [trigger.action.method]()
          // mixer.pod = -1

        })
      }

    });
  }

  setTimeout( function() {
    //filemanager1.change()
    //filemanager2.change()
    //filemanager3.change()
    //filemanager4.change()

  }, 12000)


  var changez_mod = 8000
  var jump_mod = 7200
  var scratch_mod = 12000

  setTimeout(function(){
    filemanager1.changez()
    filemanager2.changez()
    filemanager3.changez()
    filemanager4.changez()
  }, 16000 )

  // this is a hokey pokey controller
  // call this a behaviour?

  function changez() {
    if (Math.random() > 0.25 ) {
      filemanager1.change();
    }else if (Math.random() > 0.50 ) {
      filemanager2.change();
    }else if (Math.random() > 0.75 ) {
      filemanager3.change();
    }else{
      filemanager4.change();
    }
    var r = Math.floor( Math.random() * changez_mod )
    setTimeout( function() {
      changez()
    }, r )
  };
  changez()


  /*
  function jumps() {
    var r = Math.floor( Math.random() * jump_mod )
    setTimeout( function() {
      jumps()
    }, r )

    try {
      if (Math.random() > 0.5 ) {
        testSource1.video.currentTime = Math.random() * testSource1.video.duration
        console.log("src 1 jumps")
      }else{
        testSource2.video.currentTime = Math.random() * testSource2.video.duration
        console.log("src 2 jumps")
      }
    }catch(err) {}
  };
  jumps()


  function scratch() {
    var r = Math.floor( Math.random() * scratch_mod )
    setTimeout( function() {
      scratch()
    }, r )

    try {
      var rq = ( Math.random() * 0.6 ) + 0.7
      //var rq = Math.pow( (Math.random() * 0.5), 0.3 )
      if ( Math.random() > 0.5 ) {
        testSource1.video.playbackRate = rq //+ 0.7
        console.log("src 1 scxratches", rq)
      }else{
        testSource2.video.playbackRate = rq //+ 0.7
        console.log("src 1 scxratches", rq)
      }
    }catch(err) { console.log("err:", err)}
  };
  scratch()
  */
}
