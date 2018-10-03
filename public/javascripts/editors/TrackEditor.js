var sheets = [
[  1, 15,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],

[  0, 16,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],

[  2, 15,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0, 16,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],

[  0, 15,  0,  0,  0,  0,  0  ],
[  0, 16,  0,  0,  0,  0,  0  ],
[  0, 15,  0,  0,  0,  0,  0  ],
[  0, 16,  0,  0,  0,  0,  0  ],

// ----------------------------

[  1, 15,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0, 16,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],

[  0,  0,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],

[  2, 15,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0, 16,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],

[  0, 15,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ],
[  0, 16,  0,  0,  0,  0,  0  ],
[  0,  0,  0,  0,  0,  0,  0  ]
]

var TrackEditor = function( _options ) {
  var _self = this

  _self.generateTrack = function( _rows, _cols ) {
    // generate track
    var html = "<table class='table'>"
    for ( var y = 1; y <= _rows; y++ ) {
      y%4 == 0 ? html += "<tr class='tablerow alternate'>" : html += "<tr class='tablerow'>"

      for ( var x = 0; x < _cols; x++ ) {
        html += "<td class='_"+ sheets[y-1][x] + "'>" + sheets[y-1][x] + "</td>"
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
