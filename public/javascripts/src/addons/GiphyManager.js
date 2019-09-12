GiphyManager.prototype = new Addon();
GiphyManager.constructor = GiphyManager;

/**
 * @summary
 *   Aquires a set of Gif Files [Giphy](https://giphy.com/), based on tags, and allows choosing from that.
 *   Giphy Example on codepen:
 *   <a href="https://codepen.io/xangadix/pen/vqmWzN" target="_blank">codepen</a>
 *
 * @description
 *  Like the FileManager, the Giphymanager aquires a set of gif files between which you can choose. It connects to a Gifsource.
 *
 * @example
 *  var gifsource1 = new GifSource( renderer, {} )
 *  var gifmanager1 = new GiphyManager( gifsource1 )
 *  gifmanager1.search('vj', function(){ // search giphy and do the callback
 *    gifmanager1.change();     // changes from one giffile to the other in the set
 *  })
 *
 *  Thee is a working example on codepen: https://codepen.io/xangadix/pen/vqmWzN
 *
 * @constructor Addon#Gyphymanager
 * @implements Addon
 * @param {GifSource} some available gifsource source
 */

function GiphyManager( _source ) {

  var _self = this
  _self.uuid = "GiphyManager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.source = _source
  _self.file = ""
  _self.programs = []
  _self.program = ""

  // set in environment
  // this key is for demo purposes only
  var key = "tIovPHdiZhUF3w0UC6ETdEzjYOaFZQFu"

  /**
   * @description same as [search]{@link Addon#Needle#Gyphymanager#search}
   * @function Addon#Gyphymanager#needle
   * @param {string} query - Search term
   */

  _self.needle = function( _needle, _callback ) {
    var u = new Utils()
    u.get('//api.giphy.com/v1/gifs/search?api_key='+key+'&q='+_needle, function(d) {
      console.log(" === GIPHY (re)LOADED === ")
      _self.programs = JSON.parse(d).data
      if (_callback != undefined) _callback ()
    })
  }

   /**
    * @description
    *  loads a set of gif files from giphy based on
    * @function Addon#Gyphymanager#search
    * @param {string} query - Search term
    */
  _self.search = function( _query, _callback ) {
    _self.needle( _query, _callback );
  }

  /**
   * @description
   *  loads a set of gif files from giphy based on
   * @function Addon#Gyphymanager#setSrc
   * @param {string} file - set filename
   */
  _self.setSrc = function( _file ) {
    console.log("set source: ", _file)
    _self.source.src( _file )
  }

  // load another source from the stack
  /**
   * @description
   *  changes the gif file for another one in the collection
   *  loaded by [search()]{@link Addon#Gyphymanager#search}
   * @function Addon#Gyphymanager#change
   */
  _self.change = function() {
    if ( _self.programs.length == 0 ) return "no programs found :("
    _self.program = _self.programs[ Math.floor( Math.random() * _self.programs.length ) ]
    _self.file = _self.program
    _self.setSrc( _self.program.images.original.url );
  }

  /**
   * @description
   *  same as [change()]{@link Addon#Gyphymanager#change}
   * @alias Addon#Gyphymanager#changez
   */
  _self.changez = function(){
    _self.change()
  }

  // load it up with defaults
  //_self.needle("vj")
}
