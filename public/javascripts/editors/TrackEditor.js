var sheets = [
    [  3,  5,  0,  0, 10, 13, 15  ],
    [  1,  0,  0,  0,  9,  0,  0  ],
    [  3,  0,  0,  0,  0,  0,  0  ],
    [  1,  6,  0,  0,  0,  0,  0  ],   // 4
    [  3,  0,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  0,  9,  0, 16  ],
    [  3,  5,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  7, 10, 14,  0  ],   // 8
    [  0,  0,  0,  0,  0 , 0,  0  ],
    [  0,  6,  0,  0,  0,  0, 17  ],
    [  0,  0,  0,  0,  0,  0,  0  ],
    [  0,  5,  0,  0,  0,  0, 15  ],   // 12
    [  3,  6,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  8,  0,  0,  0  ],
    [  1,  6,  0,  9, 10, 13,  0  ],   //// 16
    [  3,  5,  0,  0,  0,  0,  0  ],
    [  3,  5,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  0,  0,  0,  0  ],
    [  1,  6,  0,  0,  0 , 0,  0  ],   // 20
    [  3,  0,  0,  0,  0 , 0,  0  ],
    [  3,  0,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  0,  0,  0,  0  ],
    [  3,  5,  0,  0,  0,  0,  0  ],   // 24
    [  1,  0,  0,  0,  0,  0,  0  ],   //
    [  3,  0,  0,  0, 10, 14, 16  ],
    [  1,  6,  0,  0,  0,  0,  0  ],
    [  3,  5,  0,  0,  0,  0,  0  ],  //  28
    [  1,  6,  0,  0,  9,  0,  0  ],  //
    [  3,  5,  0,  0, 10,  0,  0  ],
    [  1,  6,  0,  0,  9,  0,  0  ],
    [  3,  5,  0,  0,  0,  0,  0  ],  // 32
    [  1,  6,  0,  0,  0,  0,  0  ],   //
    [  3,  5,  0,  0, 10,  0,  0  ],
    [  1,  0,  0,  0,  9,  0,  0  ],
    [  3,  0,  0,  0,  0,  0,  0  ],
    [  1,  6,  0,  0,  0,  0, 17  ],   // 36
    [  3,  0,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  0,  9,  0,  0  ],
    [  3,  5,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  7, 10,  0, 15  ],   // 40
    [  0,  0,  0,  0,  0 , 0,  0  ],
    [  0,  6,  0,  0,  0,  0,  0  ],
    [  0,  0,  0,  0,  0,  0,  0  ],
    [  0,  5,  0,  0,  0,  0,  0  ],   // 44
    [  3,  6,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  8,  0,  0,  0  ],
    [  3,  5,  0,  0,  0,  0,  0  ],
    [  1,  6,  0,  9, 10,  0,  0  ],   //// 52
    [  3,  5,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  0,  0,  0,  0  ],
    [  3,  0,  0,  0,  0 , 0,  0  ],
    [  1,  6,  0,  0,  0 , 0,  0  ],   // 56
    [  3,  0,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  0,  0,  0,  0  ],
    [  3,  5,  0,  0,  0,  0,  0  ],
    [  1,  0,  0,  0,  0,  0,  0  ],   // 60
    [  1,  0,  0,  0,  0,  0,  0  ],   //
    [  1,  0,  0,  0,  0,  0,  0  ],   //
    [  1,  0,  0,  0,  0,  0,  0  ],   //
    [  1,  0,  0,  0,  0,  0,  0  ],   // 64
    [  1,  0,  0,  0,  0,  0,  0  ],   //
    [  1,  0,  0,  0,  0,  0,  0  ],   //
    [  3,  0,  0,  0, 10,  0, 16  ],
    [  1,  0,  0,  0,  0,  0,  0  ],   // 68
    [  1,  6,  0,  0,  0,  0,  0  ],
    [  3,  5,  0,  0,  0,  0,  0  ],
    [  1,  6,  0,  0,  9,  0,  0  ],  //
    [  3,  5,  0,  0, 10,  0, 15  ],  //  72
    [  1,  6,  0,  0,  9,  0,  0  ],
    [  3,  5,  0,  0,  0,  0,  0  ],
    [  1,  6,  0,  0,  4,  0,  0  ]   //
]

var TrackEditor = function( _options ) {
  var _self = this

  _self.generateTrack = function( _rows, _cols ) {
    // generate track
    html = "<table class='table'>"
    for ( var y = 1; y <= _rows; y++ ) {
      y%4 == 0 ? html += "<tr class='tablerow alternate'>" : html += "<tr class='tablerow'>"

      for ( var x = 0; x < _cols; x++ ) {
        html += "<td>" + sheets[y-1][x] + "</td>"
      }

      html += "</tr>"
    }

    html += "</table>"

    document.getElementById('trackgrid').innerHTML = html
  }
}

var track = new TrackEditor()
track.generateTrack(sheets.length,sheets[0].length)

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

  rows[_beats%sheets.length].classList.add('active');



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
