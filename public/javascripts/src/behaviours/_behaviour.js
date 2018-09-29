/*

1 ______________________________________________________________________________
2 ______________________________________________________________________________
3 ______________________________________________________________________________
4 ______________________________________________________________________________
5 ______________________________________________________________________________
6 ______________________________________________________________________________
7 ______________________________________________________________________________
8 ______________________________________________________________________________
9 ______________________________________________________________________________
0 ______________________________________________________________________________





*/


function Behaviour( renderer, options ) {

  // create and instance
  var _self = this;

  // set or get uid
  _self.uuid = "Behaviour" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Behaviour"

  _self.beats = 0
  _self.time = (new Date()).getTime()
  _self.script = {}
  _self.sheets = []

  renderer.add(_self)

  function addTrigger( _obj ) {
    if ( _obj.mod.type == "seconds" ) {
      triggers.push( [_obj, _self.time + _obj.mod.value, null ] )
    }else if ( _obj.mod.type == "beats" ) {
      triggers.push( [_obj, _self.beats + _obj.mod.value ] )
    }else if ( _obj.mod.type == "random-seconds" ) {
      triggers.push( [_obj, _self.time + ( Math.random() * _obj.mod.value), null ] )
    }else if ( _obj.mod.type == "random-beats" ) {
      triggers.push( [_obj, _self.beats + ( Math.random() * _obj.mod.value ) ] )
    }else{

    }
  }

  //function fireTrigger( _obj ) {
  //  obj[trigger.action.method], trigger.action.args, trigger.mod
    // should repeat?
  //}

  triggers = []
  _self.tr = triggers
  old_bpm = 1

  _self.init = function (){}
  _self.update = function(){

    // updat time
    _self.time = (new Date()).getTime()
    // _self.beats = +1 if
    // bps

    // updat beats
    var bpsr = Math.round( bpm.render() * 4 )



    if ( bpsr != old_bpm ) {
      _self.beats += 1
      old_bpm = bpsr
    }
    //if ( bpsr == 0 ) old_bpm = 1

    // checkTriggers()
    checkSheets()
  }

  // ---------------------------------------------------------------------------
  _self.load = function( _behaviour ) {
    _self.script = _behaviour
    _self.sheets = _behaviour.sheets
    console.log("loaded A BEHAVIOUR", _behaviour.title )

    _behaviour.triggers.forEach( function( trigger, i) {
      addTrigger(trigger)
    });


      //if ( trigger.action.on !== undefined) {
      //  trigger.action.on.forEach( function( obj, i ) {
      //    console.log(" ====> ", obj)
      //    addTrigger( obj )
      //    // filemanager1.changez()
      //  })
      //}

      //if ( trigger.action.with !== undefined ) {
      //  trigger.action.width.forEach( function( _src, i ) {
      //    // init.filemanager1 [trigger.action.method]()
          // mixer.pod = -1 ?

      //    _self.jump( _src )


      //  })
    //  }
    //});
  }

  _self.jump = function( _src ) {
    console.log("how high?", _src )
    _src.video.currentTime = Math.random() * _src.video.duration
  }

  // ---------------------------------------------------------------------------
  var sheet_pointer = 0
  var old_sheet_pointer = 0
  var checkSheets = function() {
    sheet_pointer = _self.beats%_self.sheets[0].length

    if ( old_sheet_pointer != sheet_pointer ) {
      console.log( "Boem:", sheet_pointer, "sheets:", _self.sheets[0][sheet_pointer] )
      old_sheet_pointer = sheet_pointer
      _self.sheets[0][sheet_pointer].forEach( function( trigger_pointer ) {

        if ( trigger_pointer != 0 ) {
           fireTrigger( triggers[ trigger_pointer ] )
        }

      })
    }
  }

  var fireTrigger = function(trigger) {
    if ( trigger[0].action.method !== undefined ) {
      trigger[0].action.on.forEach( function( _obj ) {
        console.log("DO", trigger[0].action.method, "on", _obj.uuid, "args",  trigger[0].action.args )
        _obj[trigger[0].action.method]( trigger[0].action.args  )
      })
      return true
    }

    if ( trigger[0].action.set !== undefined ) {
      trigger[0].action.on.forEach( function( _obj ) {
        console.log("SET", trigger[0].action.args, "on", trigger[0].action.set, "at", _obj.uuid )
        _obj[trigger[0].action.set] = trigger[0].action.args
      })
      return true
    }

    if ( trigger[0].action.internal !== undefined ) {
      trigger[0].action.on.forEach( function( _obj ) {
        _self[ trigger[0].action.internal ](_obj)
        console.log("INTERNAL",  trigger[0].action.args, "on", _obj.uuid )
      })
      return true
    }
  }

  var checkTriggers = function()  {

    var kill = []

    triggers.forEach( function( trigger, i) {

      var had_update = false
      if ( trigger[0].mod.type == "seconds" || trigger[0].mod.type == "random-seconds" ) {
        if ( _self.time > trigger[1] ) {
          console.log("TRAEDASDASASDADSDAS SECONDS", trigger[0].mod.type  )
          had_update = fireTrigger( trigger )
        }

      }else if ( trigger[0].mod.type == "beats" || trigger[0].mod.type == "random-beats" ) {
        //console.log("-->", trigger, trigger[0].mod.type, trigger[1], _self.beats, ">", trigger[1])
        if (  _self.beats > trigger[1] ) {
          had_update = fireTrigger( trigger )
        }
      }

      if (had_update) {
         if ( trigger[0].mod.repeat == true ) addTrigger( trigger[0] )
         if ( trigger[0].mod.after !== null ) addTrigger( _self.script.triggers[ trigger[0].mod.after ] )
         triggers.splice(i, 1)
      }
    })
  } //

  setTimeout( function() {
    // filemanager1.change()
    // filemanager2.change()
    // filemanager3.change()
    // filemanager4.change()

  }, 12000)


  var changez_mod = 8000
  var jump_mod = 7200
  var scratch_mod = 12000

  //setTimeout(function(){
  //  filemanager1.changez()
  //  filemanager2.changez()
  //  filemanager3.changez()
  //  filemanager4.changez()
  //}, 16000 )

  // this is a hokey pokey controller
  // call this a behaviour?

  /*
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
  */
  //changez()


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
