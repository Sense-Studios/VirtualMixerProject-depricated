var is_playing = false
var is_recording = false
var current_sheet = 0
var selected_in_row = 1
var current_row_id = 0

// KEYMAP ----------------------------------------------------------------------
// document.getElementById("main_table").querySelectorAll("tr")

/*
49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187,
 1,  2,  3,  4,  5,  6,  7,  8,  9,  0,   -,   =,

81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221,
 q,  w,  e,  r,  t,  y,  u,  i,  o,  p,   [,   ],

65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 220,
 a,  s,  d,  f,  g,  h,  j,  k,   l,   ;,   ',   \,

192, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191
 `,  z,  x,  c,  v,  b,  n,  m,   ,,   .,   /

 https://wikide.openmpt.org/images/thumb/5/50/Setup_keyboard_keymap.png/500px-Setup_keyboard_keymap.png

*/

var keys = []
var keymap = [
   ["C1", 81 ], // q
   ["C#1", 50 ], // 2
   ["D1", 87 ], // w
   ["D#1", 51 ], // 3
   ["E1", 69 ], // e
   ["F1", 82 ], // r
   ["F#1", 53 ], // 5
   ["G1", 84 ], // t
   ["G#1", 54 ], // 6
   ["A1", 89 ], // y
   ["A#1", 55 ], // 7
   ["B1", 85 ], // u
   ["C2", 73 ], // i
   ["C#2", 57 ], // 9
   ["D2", 79 ], // o
   ["D#2", 48 ], // 0
   ["E2", 80 ], // p
   ["F2", 219 ], // [
   ["F#2", 187 ], // =
   ["G2", 221 ], // ]

   ["C3", 90 ], // z
   ["C#3", 83 ], // s
   ["D3", 88 ], // x
   ["D#3", 68 ], // d
   ["E3", 67 ], // c
   ["F3", 86 ], // v
   ["F#3", 71 ], // g
   ["G3", 66 ], // b
   ["G#3", 72 ], // h
   ["A3", 78 ], // n
   ["A#3", 74 ], // j
   ["B3", 77 ] // m
 ]

// -----------------------------------------------------------------------------
// FILL THE TRACK

var fill_values = function( _val ) {
  console.log("fill")

  saved_file.sheet_data[0] = _val

  _val.forEach((row, x) => {
    row.forEach((col, y) => {
      //console.log("filling: row:", x, "col:", y)
      if ( col[0] != undefined ) {
        var elm = document.querySelector('td[data-rowcol="'+x + "," + y +'"]')
        // console.log("has col: ", col, "rowcol: ", x, y, elm)

        // starts the index of an instrument
        // console.log( "-", col[0], elm.querySelector('.note'), "--" )

        // elm.querySelector('.index').textContent = col[0]
        //if ( col[0] ) elm.querySelector('.note').textContent = col[0]
        //if ( col[1] ) elm.querySelector('.index').textContent = col[1]
        //if ( col[2] ) elm.querySelector('.opacity').textContent = col[2]
        //if ( col[3] ) elm.querySelector('.cue').textContent = col[3]
        //if ( col[4] ) elm.querySelector('.effect').textContent = col[4]
        //if ( col[5] ) elm.querySelector('.effect_extra').textContent = col[5]

        elm.querySelector('.note').textContent = col[0]
        elm.querySelector('.index').textContent = col[1]
        elm.querySelector('.opacity').textContent = col[2]
        elm.querySelector('.cue').textContent = col[3]
        elm.querySelector('.effect').textContent = col[4]
        elm.querySelector('.effect_extra').textContent = col[5]

      }
    });
  });
}

// Update helper: check if there is an entry in the cell, and execute it
function checkEntry(item, i) {
  var note = item.querySelector('.note').textContent
  var index = item.querySelector('.index').textContent
  var opacity = item.querySelector('.opacity').textContent
  var cue = item.querySelector('.cue').textContent
  var effect = item.querySelector('.effect').textContent
  var effect_extra = elm.querySelector('.effect_extra').textContent

  if (
      !isNaN(note) && note != "" ||
      !isNaN(index) && index != "" ||
      !isNaN(opacity) && opacity != ""  ||
      !isNaN(cue) && cue != ""  ||
      !isNaN(effect) && effect != ""  ||
      !isNaN(effect_extra)  && effect_extra != ""
    ) {

    console.log("got something",i, !isNaN(note), !isNaN(index),!isNaN(opacity),!isNaN(cue),!isNaN(effect),!isNaN(effect_extra))
    console.log( item.dataset )
    console.log("note ", note )
    console.log("index ", index )
    console.log("opacity ", opacity )
    console.log("cue ", cue )
    console.log("effect ", effect )
    console.log("effect_extra ", effect_extra )

    // Set Note
    if (note) {
      console.log("git note", note)
      var channel = Number(item.dataset.col) + 1
      var source = window["channel" + channel + "_source"]
      if ( source.video.seeking ) {
        console.warn("video is seeking")
        return
      }

      // failsafe
      if (!saved_file.instruments[index]) return

      var cues = saved_file.instruments[index].cues
      cues.forEach((cue, j) => {
         if ( cue[0] == note ) {
          source.video.currentTime = Number(cue[1])
          source.video.play()

          // set timout for source out
          // Number(cue[1])
          console.log("we got contact", cue, note, Number(cue[1]))

          // now we actually need to check the last cue too\
          // something about killing the channel if the note has expired cue[2]
          // if cue[1]
        }
      });
    }

    // Set Index
    if ( !isNaN(index) && index != "" ) {
      var channel = Number(item.dataset.col) + 1
      var source = window["channel" + channel + "_source"]
      console.log("should update:", source.video.src.indexOf(INSTRUMENTS[ index ]), INSTRUMENTS[ index ], source.video.src )
      if ( source.video.src.indexOf( encodeURI( INSTRUMENTS[ index ] ) ) == -1 ) {
        source.video.src = INSTRUMENTS[ index ]
        console.warn("source updates!");
        console.log("source", INSTRUMENTS[ index ], " on channel", channel)
        source.video.play()
      }
    }

    // Set Opacity
    if ( !isNaN(opacity) && opacity != "" ) {
      var channel = Number(item.dataset.col) + 1
      var source = window["channel" + channel + "_source"]
      console.log("opacity", channel, source, opacity, " on channel", channel)
      source.alpha(opacity)
    }

    // Override that shit, when mute is checked
    if ( document.getElementById('channel' + channel + '_mute').checked ) {
      //source.alpha(0)
      end_chain.setChainLink(channel-1, 0)
    }else{
      end_chain.setChainLink(channel-1, 1)
    }

    // Set cue
    if ( !isNaN(cue) && cue != "" ) {
      if ( source.video.seeking ) {
        console.warn("video is seeking")
        return
      }
      var channel = Number(item.dataset.col) + 1
      var source = window["channel" + channel + "_source"]
      source.video.currentTime = cue
      source.video.play()
      console.log("cue", cue, " on channel", channel)
    }

    // Effect
    // Effect_extra
  }
}

// Tracker interaction helper
function select_cell( _none = "" ){
  var elm = document.getElementById("main_table")
  var row = elm.querySelectorAll("tr")[current_row_id]
  var cell = row.querySelectorAll("td")[selected_in_row] // console.log( current_row_id, selected_in_row )
  // console.log("cell", _none, row, current_row_id, cell)

  // reset others
  elm.querySelectorAll("td.selected").forEach(function(td, i) {
    //if ( td == cell ) return

    // console.log("td remove:", td)

    html = `
      <div class="trigger_cell">
        <span class="note">${td.querySelector('.note').value}</span>
        <span class="index">${td.querySelector('.index').value}</span>
        <span class="opacity">${td.querySelector('.opacity').value}</span>
        <span class="cue">${td.querySelector('.cue').value}</span>
        <span class="effect">${td.querySelector('.effect').value}</span>
        <span class="effect_extra">${td.querySelector('.effect_extra').value}</span>
      </div>
    `

    td.innerHTML = html
    td.classList.remove('selected')
  })

  if (_none == "none") {
    // reset all
    return
  }

  //highlight
  cell.classList.add('selected')

  // <input class="note" value="${cell.querySelector('.note').innerText}"/>
  var randid = "note_" + Math.round( Math.random() * 1000000 )
  var current_note = cell.querySelector('.note').innerText
  html = `
    <div class="trigger_cell">
      <select id="note-${randid}" class="note" value=""/></select>
      <input class="index" value="${cell.querySelector('.index').innerText}"/>
      <input class="opacity" value="${cell.querySelector('.opacity').innerText}"/>
      <input class="cue" value="${cell.querySelector('.cue').innerText}"/>
      <input class="effect" value="${cell.querySelector('.effect').innerText}"/>
      <input class="effect_extra" value="${cell.querySelector('.effect_extra').innerText}"/>
    </div>
  `

  cell.innerHTML = html
  fillnotekeys( document.getElementById(`note-${randid}`), current_note )
  // cell.querySelector('.index').focus()
}

// Tracker reset helper
var reset = function() {
  elm = document.getElementById('tracker')
  elm.scrollTop = -16
  current_row_id = 0
}

// helper
var fillnotekeys = function( _selectelement, _select ) {
  // console.log("fill keys", _selectelement, "note:", _select)
  var html = "<option value=''></option>"
  keymap.forEach((note, i) => {
    if ( _select == note[0] ) {
      html += `<option selected value='${note[0]}'>${note[0]}</option>`
    }else{
      html += `<option value='${note[0]}'>${note[0]}</option>`
    }
  });
  _selectelement.innerHTML = html
}

// MAIN
select_cell()
fill_values( saved_file.sheet_data[current_sheet])
//fill_values( clear_data )
