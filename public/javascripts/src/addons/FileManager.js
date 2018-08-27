/**
 * @description
 *   FileManager
 *
 * @example
 *  let filemanager1 = new FileManager( renderer, { audio: 'mymusic.mp3' } );
 * @implements Addon
 * @constructor Addon#FileManager
 * @param {GlRenderer} renderer
 * @param {Source}  source
 * @author Sense Studios
 */
function FileManager( _source ) {

  var _self = this
  _self.uuid = "Filemanager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.defaultQuality = ""
  _self.source = _source
  _self.programs = []
  _self.file
  _self.renderer = renderer // do we even need this ?!!


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
        if ( p.tags.includes(t) ) {
          matches.push(p)
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

  // load another source from the stack
  _self.change = function( _tag ) {

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
    _self.setSrc( _self.getSrcByQuality( program ) );
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
