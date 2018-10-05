
var sheets = [[]]
var track

var TrackEditor = function( _options ) {
  var _self = this

  _self.generateTrack = function( _rows, _cols ) {
    // generate track
    var html = "<table class='table'>"
    for ( var y = 1; y <= _rows; y++ ) {
      y%4 == 0 ? html += "<tr class='tablerow alternate'>" : html += "<tr class='tablerow'>"

      for ( var x = 0; x < _cols; x++ ) {
        html += "<td class='_"+ sheets[0][y-1][x] + "'>"
        html +=  sheets[0][y-1][x] + "\t..... ... ..."
        html +=  "</td>"
      }

      html += "</tr>"
    }

    html += "</table>"

    document.getElementById('trackgrid').innerHTML = html
  }
}

// INIT
var u = new Utils()
u.get('/io', function(d) {
  console.log(d)
  sheets = JSON.parse(d)
  track = new TrackEditor()
  track.generateTrack(sheets[0].length,sheets[0][0].length)
})

u.post('/io', { sheets: sheets }, function(d) {
  console.log("posted sheets, ", d)
})

var _beats = 0
var socket = io();
socket.on('chat message', function(msg){
  console.log(msg)
  //$('#messages').append($('<li>').text(msg));
});

socket.on('command', function(msg){
  console.log(msg)
  //$('#messages').append($('<li>').text(msg));

  // setUID
  if (msg == "") {}
  if (msg == "test") { console.log("msg", msg)}
  if (msg.command == "test") { console.log("test:", msg.payload)}
  if (msg.command == "beats") { setBeats( msg.payload ) }
  if (msg.command == "updatesheets") { updateSheets( JSON.parse(msg.payload.sheets) ) }

});


var setBeats = function( _num ) {
  console.log("beats!", _num )
  //console.log( document.querySelector(".table") )
  _beats = _num
  var rows = document.getElementsByClassName('tablerow')
  for( var i = 0; i < rows.length; i++ ) {
      // console.log(i, rows[i])
      rows[i].classList.remove('active');
  }

  rows[_beats%sheets[0].length].classList.add('active');

}

var updateSheets = function( _sheets ) {
  sheets = _sheets
  console.log(sheets)
  document.getElementById('trackgrid').innerHTML = ""
  track.generateTrack(sheets[0].length,sheets[0][0].length)
}

// ping?
// hasmaster? (end)
// (getmaster)
// audio
// send beats?



socket.on('identify', function(msg) {
  var uuid = "Client_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
})

socket.on('ismaster', function(msg) {
  var ismaster = true
})
