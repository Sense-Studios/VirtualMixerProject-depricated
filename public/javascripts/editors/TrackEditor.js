var TrackEditor = function( _options ) {
  var _self = this

  _self.generateTrack = function( _rows, _cols ) {
    // generate track
    html = "<table>"
    for ( var y = 1; y <= _rows; y++ ) {
      y%4 == 0 ? html += "<tr class='alternate'>" : html += "<tr>"
      for ( var x = 0; x < _cols; x++ ) {
        html += "<td>........</td>"
      }
      html += "<tr>"
    }

    html += "</table>"

    document.getElementById('trackgrid').innerHTML = html
  }
}

var track = new TrackEditor()
track.generateTrack(64,12)
