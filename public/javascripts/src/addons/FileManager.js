function FileManager( _source ) {

  var _self = this

  try {
    renderer
  } catch(e) {
    _self.function_list = [["CHANGE", "method", "changez"], ["POD", "set","pod"] ]
    return
  }

  _self.uuid = "Filemanager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.defaultQuality = ""
  _self.source = _source
  _self.set = []
  //_self.programs = []
  _self.file
  _self.renderer = renderer // do we even need this ?!!

  _self.load_set = function( _set ) {
    var u = new Utils()
    u.get( _set, function(d) {
      console.log("-->", d)
      _self.set = JSON.parse(d)
    })
  }

  _self.setSrc = function( file ) {
    console.log("set source: ", file)
    _self.source.src(file)
  }

  _self.getFileById = function( _id ) {
    var match = null
  }

  _self.getSrcByTags = function( _tags ) {
    // _tags = array
    if ( programs.length == 0 ) return "no programs"

    var matches = []
    programs.forEach( function( p, i) {
      //console.log(i, p)
      _tags.forEach( function( t, j) {
        //console.log( j, t)
        if ( p.tags.includes(t) && p.assets != undefined ) {
          if ( p.assets._type == "Video" ) matches.push(p)
        }
      })
    })

    if ( matches.length == 0 ) return "no matches"
    var program = matches[ Math.floor( Math.random() * matches.length )]
    console.log(">> ", matches.length, program.title)
    _self.setSrc( _self.getSrcByQuality( program ) );
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  _self.load = function( _file ) {
    utils.get( _file, function(d) {
      console.log('got:', JSON.parse(d) )
      _self.set = JSON.parse(d)
    } )
  }

  // load another source from the stack
  _self.change = function( _tag ) {

    if ( _self.set.length != 0 ) {
      var r = _self.set[ Math.floor( Math.random() * _self.set.length ) ];
      console.log("from set:", r )
      _self.setSrc( r )
    }
    return

    if ( programs.length == 0 ) return "no programs"
    if ( _tag ) {
      _self.getSrcByTags( [ _tag ] );
      return;
    }

    console.log("change video")
    var program = programs[ Math.floor( Math.random() * programs.length ) ]
    if ( program.assets._type != "Video" ) {
      // noit elegible, try again
      _self.change()
      return
    }

    //var notv = null
    //$.get('/set/notv', function(d) { notv = JSON.parse(d) })

    console.log("SOURCE")
    //var source = notv[ Math.floor( Math.random() * notv.length) ];
    //var source = occupy_chaos[ Math.floor( Math.random() * occupy_chaos.length) ];

    if (_self.set.length > 0) {
      var source = _self.set[ Math.floor( Math.random() * _self.set.length) ];

      //var source = _self.getSrcByQuality( program )
      _self.setSrc( source );
    }


    /*
    if (Math.random() > 0.5 ) {
      _self.getSrcByTags(["awesome"])
    }else{
      _self.getSrcByTags(["runner"])
    }
    */
  }

  // for old times sake,
  _self.changez = function( _tag ){
    _self.change( _tag )
  }

  // get the version by it's quality ( marduq asset library )
  _self.getSrcByQuality = function( _program, _quality ) {
    if ( _quality == undefined ) _quality = "720p_h264"
    var match = null
    _program.assets.versions.forEach( function(version) {
      if ( version.label == _quality ) match = version
    })
    return match.url;
  }
}
