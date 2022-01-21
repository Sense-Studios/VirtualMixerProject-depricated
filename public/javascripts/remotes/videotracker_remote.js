

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
   ["F#2", 81 ], // =
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
 // Constants



var keys = []

//  trackeditor


// -----------------------------------------------------------------------------
// Update Cycle
// -----------------------------------------------------------------------------

var update = function() {

  elm = document.getElementById('tracker')

  // if (elm.scrollTop >= 1006) elm.scrollTop = 0
  // if (elm.scrollTop <= 0) elm.scrollTop = 1006
  // console.log( elm.scrollTop, current_row_id )

  if (is_playing) {
    select_cell("none")
    selectedElements = document.querySelectorAll('td[data-row="'+current_row_id+'"]')
    selectedElements.forEach( (item, i)=> checkEntry(item, i)  )

    if (elm.scrollTop >= 1022) {
       elm.scrollTop = 0
    }

    current_row_id = Math.round(elm.scrollTop/16) // row_id

    // afdter evaluation we update
    elm.scrollBy(0,16)

  }else{
    elm.scrollTop = Math.round( ( elm.scrollTop / 16 ) ) * 16
    current_row_id = Math.round( elm.scrollTop / 16 ) // row_id
    selectedElements = document.querySelectorAll('td[data-row="'+current_row_id+'"]')

    // black, while not playing
    channel1_source.alpha(0)
    channel2_source.alpha(0)
    channel3_source.alpha(0)
    channel4_source.alpha(0)
    channel5_source.alpha(0)
    channel6_source.alpha(0)
    channel7_source.alpha(0)
    channel8_source.alpha(0)
  }

  // For the instrument editor
  v = document.getElementById("instrument_video")
  var newleft  = ( (v.currentTime / v.duration ) * 100 ) + "%"
  document.querySelector('.playhead').style.left = newleft

  // update taking bpm into account
  setTimeout( update, ( ( 60000 / bpm ) / 4 ) )
}



window.onkeydown = function(evt) {
  console.log("onkeydownevent:", evt.which)

  //32 -- space: TRACKER PLAY TOGGLE
  if (evt.which == 32) {
    is_playing = !is_playing
    evt.preventDefault
    return false
  }

  //37 -- left: NAVIGATE TRACKER LEFT
  if ( evt.which == 37 ) {
    selected_in_row -= 1
    if (selected_in_row < 1) selected_in_row = 1
    select_cell()
    evt.preventDefault
    return false
  }

  //39 -- right: NAVIGATE TRACKER RIGHT
  if ( evt.which == 39 ) {
    selected_in_row += 1
    if (selected_in_row > 8) selected_in_row = 8
    select_cell()
    evt.preventDefault
    return false
  }

  //38 -- up: NAVIGATE TRACKER UP
  if (evt.which == 38) {
    if (elm.scrollTop <= 0) {
      elm.scrollTop = 1006
      return
    }
    elm.scrollBy(0,-16)
    current_row_id -= 1
    select_cell()

    evt.preventDefault
    return false
  }

  //40 -- down: NAVIGATE TRACKER DOWN
  if (evt.which == 40) {
    if (elm.scrollTop >= 1006) {
      elm.scrollTop = 0
      return
    }
    elm.scrollBy(0,16)
    current_row_id += 1
    select_cell()

    evt.preventDefault
    return false
  }

  // home: RESET TRACKER
  if (evt.which == 36) {
    select_cell('none')
    reset()
  }

  // backspace
  if (evt.which == 8) {
    updatebpm()
  }

  keymap.forEach((key, i) => {
   if (evt.which == key[1]) {
     var cues = saved_file.instruments[current_instrument_id].cues
     cues.forEach((cue, j) => {
       if ( cue[0] == key[0] ) {
         var v = document.getElementById('instrument_video')
         v.currentTime = Number(cue[1])
       }
     });
   }
  });
}

function updatebpm() {
  tap_bpm.tap()
  bpm = tap_bpm.bpm
  document.getElementById('bpm_display').value = Math.round(bpm*100)/100
}

function import_sheet( _data ) {
  saved_file = JSON.parse(_data)
}

function export_sheet() {
  navigator.clipboard.writeText( JSON.stringify( saved_file ) )
}

document.getElementById('tracker_back').onclick = function() {
  document.getElementById('page1_player').classList.add('selected')
  document.getElementById('page2_instrument').classList.remove('selected')
}

var instrument_preview_interval = setInterval(function(){})

// reset tracker
function reset() {
  elm = document.getElementById('tracker')
  elm.scrollTop = 0
  current_row_id = 0
}

document.getElementById('bpm_display').onchange = function() {
  bpm = Number(this.value)
}

update()
