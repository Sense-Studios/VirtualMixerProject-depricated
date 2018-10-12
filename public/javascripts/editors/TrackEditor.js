
var sheets = [[]]
var sheet_index = 0
var track

var blank_functions = [[".....", "",""]]
var mixer_functions = [["BLEND", "method","blendMode"], ["MIX", "method","mixMode"], ["POD", "set", "pod"] ]
var filemanager_functions = [["CHANGE", "method", "changez"], ["POD", "set","pod"] ]
var source_functions = [["JUMP","internal","jump"]]
var bpm_functions = [ ["AUTO", "method", "toggleAutoBpm"],["MODDOWN", "method", "modDown"],["MODUP", "method", "modUp"],["MOD", "method", "modNum"]]

// instruments ?
var options = [
  [ ".....", blank_functions ],
  [ "MIX01", mixer_functions ],
  [ "MIX02", mixer_functions ],
  [ "MIX03", mixer_functions ],
  [ "MIX04", mixer_functions ],
  [ "MIX05", mixer_functions ],
  [ "VID01", source_functions ],
  [ "VID02", source_functions ],
  [ "VID03", source_functions ],
  [ "FIL01", filemanager_functions ],
  [ "FIL02", filemanager_functions ],
  [ "FIL03", filemanager_functions ],
  [ "BPM01", bpm_functions ]
]

var TrackEditor = function( _options ) {
  var _self = this

  _self.generateTrack = function( _rows, _cols ) {
    // generate track
    var html = "<table class='table pattern' id='pattern'>"
    for ( var y = 0; y < _rows; y++ ) {
      y%4 == 0 ? html += "<tr class='tablerow alternate'>" : html += "<tr class='tablerow'>"

      for ( var x = 0; x < _cols; x++ ) {
        html += "<td width='"
        html += (99/_cols)+"%' class='_"
        html +=  sheets[ sheet_index ][y][x][2]
        html +=  " " + sheets[ sheet_index ][y][x][0]
        html += " tablecell' data-index='0' data-x='"+x+"' data-y='"+y+"'>"

        //html +=  sheets[ sheet_index ][y-1][x]   // index
        //html += "\t..... ... ..."
        html += "<select class='target' data-index='0'>"
        html += " <option selected>" + sheets[ sheet_index ][y][x][0] + "</option>"
        options.forEach(function(opt, i) { html += "<option>" + opt[0] + "</option>" });
        html += " </select>"
        html += "<select class='action' data-index='0'>"
        html += "<option selected>"+sheets[ sheet_index ][y][x][1]+"</option>"
        // load
        // from
        options.forEach( function( opt, i ) {
          if ( opt[0] == sheets[ sheet_index ][y][x][0] ) {
            opt[1].forEach( function( func, i ) {
              html += "<option>" + func[0] + "</option>"
            })
          }
        });
        html += "</select>"
        html += "<input class='pattern_input' value='" + sheets[ sheet_index ][y][x][2] + "'>"
        html +=  "</td>"
      }
      html += "</tr>"
    }

    html += "</table>"

    document.getElementById('trackgrid').innerHTML = html
    var tc = document.getElementsByClassName('tablecell')
    //console.log(p_i)

    for( var i = 0; i < tc.length; i++) {


      tc[i].tableindex = i

      tc[i].setAttribute( "data-index", i )
      tc[i].children[0].setAttribute( "data-index", i )
      tc[i].children[1].setAttribute( "data-index", i )
      tc[i].children[2].setAttribute( "data-index", i )

      // add change listeners
      var target = tc[i].getElementsByClassName('target')[0]
      target.addEventListener('change', function(evt) {
        var html = ""
        options.forEach( function( opt, i) {
          if ( opt[0] == evt.srcElement.value ) {
            opt[1].forEach( function ( func, i ) {
              html += "<option>" + func[0] + "</option>"
            })
          }
        })

        evt.srcElement.nextElementSibling.innerHTML = html
        evt.srcElement.setAttribute( "data-index", i )
        update(evt.srcElement)
      })

      var action = tc[i].getElementsByClassName('action')[0]
      action.addEventListener('change', function(evt) {
        console.log("change action", evt.srcElement)
        evt.srcElement.setAttribute( "data-index", i )
        update(evt.srcElement)
      })


      var action = tc[i].getElementsByClassName('pattern_input')[0]
      action.addEventListener('change', function(evt) {
        evt.srcElement.setAttribute( "data-index", i )
        update(evt.srcElement)
      })




      /*
      var tar = tc[i].getElementsByClassName('target')[0]
      tar.addEventListener('change', function(evt) {
        var html = ""
        options.forEach( function( opt, i) {
          if ( opt[0] == evt.srcElement.value ) {
            opt[1].forEach( function ( func, i ) {
              html += "<option>" + func[0] + "</option>"
            })
          }
        })
        evt.srcElement.nextElementSibling.innerHTML = html
      })
      */


      /* ------------ */

      // var tablecells = tc[i].getElementsByClassName('tablecell') //[0]
      // var targets = tc[i].getElementsByClassName('target')[0]
      // var actions = tc[i].getElementsByClassName('action')[0]


      var update = function(elm) {
        var tablecell = elm.parentElement
        //console.log("elm change", elm, elm.value, i)
        console.log(tablecell)



        var index = tablecell.getAttribute("data-index")
        var pointer_x = tablecell.getAttribute("data-x")
        var pointer_y = tablecell.getAttribute("data-y")

        console.log("--->", index, sheets[index])

        sheets[ sheet_index ][pointer_y][pointer_x][0] =  tablecell.children[0].value
        sheets[ sheet_index ][pointer_y][pointer_x][1] =  tablecell.children[1].value
        sheets[ sheet_index ][pointer_y][pointer_x][2] =  tablecell.children[2].value

        //setTimeout(function() { document.getElementsByClassName('pattern_input')[evt.srcElement.tableindex].focus() },  200)
        updateSheets(sheets)

        //console.log("now start posting sheets")
        postSheets()
        return true
      }
    }
  }
}

var holder

// INIT
var u = new Utils()
u.get('/io', function(d) {
  console.log(d)
  sheets = JSON.parse(d)
  track = new TrackEditor()
  track.generateTrack(sheets[ sheet_index ].length,sheets[0][0].length)
})

var postSheets = function() {
  console.log("-->", JSON.stringify(sheets))
  u.post('/io', "sheets=" + JSON.stringify(sheets) + "&sheetindex=" + sheet_index, function(d) {
    console.log("posted sheets, ", d)
  })
}

var _beats = 0
var socket = io();
socket.on('chat message', function(msg){
  console.log(msg)
  //$('#messages').append($('<li>').text(msg));
});

socket.on('command', function(msg){
  if (msg.command != "beats") console.log(msg)
  //$('#messages').append($('<li>').text(msg));

  // setUID
  if (msg == "") {}
  if (msg == "test") { console.log("msg", msg)}
  if (msg.command == "test") { console.log("test:", msg.payload)}
  if (msg.command == "beats") { setBeats( msg.payload ) }
  if (msg.command == "updatesheets") { updateSheets( JSON.parse(msg.payload.sheets) ) }

});


var setBeats = function( _num ) {
  //console.log("beats!", _num )
  //console.log( document.querySelector(".table") )
  _beats = _num
  var rows = document.getElementsByClassName('tablerow')
  for( var i = 0; i < rows.length; i++ ) {
      // console.log(i, rows[i])
      rows[i].classList.remove('active');
  }

  rows[_beats%sheets[ sheet_index ].length].classList.add('active');
  var pattern = document.getElementsByClassName('pattern')
  //pattern[0].style.top = ((-_beats%sheets[0].length * 20) + 320) + "px"
}

document.getElementById("button_sheet_1").addEventListener('click', function(elm) {
  updateSheets( sheets, 0)
  postSheets()
});

document.getElementById("button_sheet_2").addEventListener('click', function(elm) {
  updateSheets( sheets, 1)
  postSheets()
});

var updateSheets = function( _sheets, _id ) {
  console.log(" >>>", _sheets)
  sheets = _sheets
  console.log(sheets)
  document.getElementById('trackgrid').innerHTML = ""

  if (_id != undefined) {
    sheet_index = _id
  }

  track.generateTrack(sheets[ sheet_index ].length,sheets[0][0].length)
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
