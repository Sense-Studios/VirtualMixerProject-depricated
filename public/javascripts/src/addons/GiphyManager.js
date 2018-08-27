/**
 * @description
 *   GiphyManager
 *
 * @example
 * var gifmanager1 = new Gyphymanager( renderer );
 * gifmanager1.search('vj');
 * gifmanager1.change();
 * @implements Addon
 * @constructor Addon#Gyphymanager
 * @param {GlRenderer} renderer
 * @param {GifSource} source
 */
function GiphyManager( _source ) {

  var _self = this
  _self.uuid = "GiphyManager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.source = _source
  _self.file
  _self.programs
  _self.program
  _self.renderer = renderer // do we even need this ?!!

  // set in environment
  var key = "tIovPHdiZhUF3w0UC6ETdEzjYOaFZQFu"

  /**
   * @description same as [search]{@link Addon#Needle#Gyphymanager#search}
   * @function Addon#Gyphymanager#needle
   * @param {string} query - Search term
   */
  _self.needle = function( _needle ) {
    $.get('http://api.giphy.com/v1/gifs/search?api_key='+key+'&q='+_needle, function(d) {
      _self.programs = d.data
      console.log(" === GIPHY (re)LOADED === ")
    })
  }

   /**
    * @description
    *  loads a set of gif files from giphy based on
    * @function Addon#Gyphymanager#search
    * @param {string} query - Search term
    */
  _self.search = function( _query ) {
    _self.needle( _query );
  }

  // alternate
  _self.setSrc = function( file ) {
    console.log("set source: ", file)
    _self.source.src(file)
  }

  // load another source from the stack
  /**
   * @description
   *  changes the gif file for another one in the collection
   *  loaded by [search()]{@link Addon#Gyphymanager#search}
   * @function Addon#Gyphymanager#change
   */
  _self.change = function() {
    if ( _self.programs.length == 0 ) return "no programs"
    _self.program = _self.programs[ Math.floor( Math.random() * _self.programs.length ) ]
    _self.setSrc( _self.program.images.original.url );
  }

  /**
   * @description
   *  same as [change()]{@link Addon#Gyphymanager#change}
   * @function Addon#Gyphymanager#changez
   */
  _self.changez = function(){
    _self.change()
  }

  // load it up with defaults
  _self.needle("vj")
}
