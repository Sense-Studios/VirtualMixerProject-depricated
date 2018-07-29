function GiphyManager( _source ) {

  var _self = this
  _self.uuid = "GiphyManager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.source = _source
  _self.file
  _self.programs
  _self.program
  _self.renderer = renderer // do we even need this ?!!

  var key = "tIovPHdiZhUF3w0UC6ETdEzjYOaFZQFu"

  _self.needle = function( _needle ) {
    $.get('http://api.giphy.com/v1/gifs/search?api_key='+key+'&q='+_needle, function(d) {
      _self.programs = d.data
      console.log(" === GIPHY (re)LOADED === ")
    })
  }

  // alternate
  _self.search = function( _query ) {
    _self.needle( _query );
  }

  _self.setSrc = function( file ) {
    console.log("set source: ", file)
    _self.source.src(file)
  }

  // load another source from the stack
  _self.change = function() {
    if ( _self.programs.length == 0 ) return "no programs"
    _self.program = _self.programs[ Math.floor( Math.random() * _self.programs.length ) ]
    _self.setSrc( _self.program.images.original.url );
  }

  // for old times sake,
  _self.changez = function(){
    _self.change()
  }

  // load it up with defauilts
  _self.needle("vj")
}
