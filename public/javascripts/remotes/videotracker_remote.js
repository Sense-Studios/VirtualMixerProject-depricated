var is_playing = false


// -----------------------------------------------------------------------------
// Build Instruments

var current_instrument_id = 0
var INSTRUMENTS = []
saved_file.instruments.forEach(function( instrument, i ) {   INSTRUMENTS.push(instrument.url) })

var build_instruments = function( _instruments ) {
  INSTRUMENTS.forEach((instrument, i) => {
    //var elm = document.getElementById('#instrument')
    var table = document.getElementById('instruments').children[0]
    table.innerHTML = table.innerHTML + "<tr><td>" + i + "</td><td><input class='instrument' id='instrument_'"+i+" value='" + instrument + "'></td><td class='instrument_pointer' data-instrument-id='"+i+"'>»</td></tr>"
  });
}

build_instruments(INSTRUMENTS)

// add interaction to instruments
document.querySelectorAll('.instrument').forEach( function( instrument, i ) {
  instrument.onchange = function(e) { INSTRUMENTS[i] = instrument.value }
})

// -----------------------------------------------------------------------------
// FILL THE TRACK

var fill_values = function( _val ) {
  _val.forEach((row, x) => {
    row.forEach((col, y) => {
      console.log("filling: row:", x, "col:", y)
      if ( col[0] != undefined ) {
        var elm = document.querySelector('td[data-rowcol="'+x + "," + y +'"]')
        console.log("has col: ", col, "rowcol: ", x, y, elm)

        // starts the index of an instrument
        console.log( "-", col[0], elm.querySelector('.note'), "--" )

        // elm.querySelector('.index').textContent = col[0]
        if ( col[0] ) elm.querySelector('.note').textContent = col[0]
        if ( col[1] ) elm.querySelector('.index').textContent = col[1]
        if ( col[2] ) elm.querySelector('.opacity').textContent = col[2]
        if ( col[3] ) elm.querySelector('.cue').textContent = col[3]
        if ( col[4] ) elm.querySelector('.effect').textContent = col[4]
        if ( col[5] ) elm.querySelector('.effect_extra').textContent = col[5]
      }
    });
  });
}

fill_values(initial_data)


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

  v = document.getElementById("instrument_video")
  var newleft  = ( (v.currentTime / v.duration ) * 100 ) + "%"

  //if (v.paused)  {
  //  v.style.opacity = 0.3
  //} else {
  //  v.style.opacity = 1
  //}

  // loop?
  //setTimeout( function() {
  //  newleft
  //})

  //console.log(newleft)
  document.querySelector('.playhead').style.left = newleft


  // 1 beat = 128/60 = 2.01
  // 1 beat = 128/60 = 2.01
  // 60 000 /
  setTimeout( update, ( ( 60000 / bpm ) / 4 ) )
}
update()

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
        }

      //keymap.forEach((key, i) => {
      //  console.log("git key", key)
      // if (note == key[0]) {
        /*
         var cues = saved_file.instruments[current_instrument_id].cues
         cues.forEach((cue, j) => {
           if ( cue[0] == key[0] ) {
             var v = document.getElementById('index')
             v.currentTime = Number(cue[1])
           }
         });
       }
        */

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

    // Override that shit
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

var reset = function() {
  elm = document.getElementById('tracker')
  elm.scrollTop = -16
  current_row_id = 0
}

document.getElementById('bpm_display').onchange = function() {
  bpm = Number(this.value)
}

// -----------------------------------------------------------------------------
// interaction

// instruments, rollover and click
var SELECTED_INSTRUMENT = 0
document.getElementById('instruments').querySelectorAll('tr').forEach( function(elm, i) {
  elm.onclick = function( evt ) {
    var siblings = document.getElementById('instruments').querySelectorAll('tr')
    siblings.forEach(function(elm, i){ elm.classList.remove('selected')})
    elm.classList.add('selected')
    SELECTED_INSTRUMENT = elm.querySelectorAll('td')[0].innerText
  }
})

keys = []
selected_in_row = 1
current_row_id = 0

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

  html = `
    <div class="trigger_cell">
      <input class="note" value="${cell.querySelector('.note').innerText}"/>
      <input class="index" value="${cell.querySelector('.index').innerText}"/>
      <input class="opacity" value="${cell.querySelector('.opacity').innerText}"/>
      <input class="cue" value="${cell.querySelector('.cue').innerText}"/>
      <input class="effect" value="${cell.querySelector('.effect').innerText}"/>
      <input class="effect_extra" value="${cell.querySelector('.effect_extra').innerText}"/>
    </div>
  `

  cell.innerHTML = html
  cell.querySelector('.index').focus()

}
select_cell()

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

function export_sheet() {
  var new_sheet = []
  var main = document.getElementById('main_table')
  main.querySelectorAll('.track_row').forEach( function( row, i ) {
    new_sheet.push([])
    row.querySelectorAll('.trigger_cell').forEach( function(cell, j) {
      new_sheet[i].push([])
      cell.querySelectorAll('span').forEach( function(cell, k) {
        new_sheet[i][j].push(cell.innerText)
      })
    });
  })
  // return JSON.stringify(new_sheet)
  return new_sheet
}

function import_sheet(sheet_data) {
  // TODO
}

// open through  button
function open_instrument(_id){
  document.getElementById('page1_player').classList.remove('selected')
  document.getElementById('page2_instrument').classList.add('selected')
  console.log("Instrument: ", _id, INSTRUMENTS[_id])
  document.querySelector("#page2_instrument .title").innerHTML = "INSTRUMENT: " + _id + ": " + INSTRUMENTS[_id]
  load_up_instrument(_id)
}

function open_tracker() {
  document.getElementById('page1_player').classList.add('selected')
  document.getElementById('page2_instrument').classList.remove('selected')
}

document.querySelectorAll('.instrument_pointer').forEach((pointer, i) => {
  pointer.onclick = function() { open_instrument( pointer.dataset.instrumentId ) }
});

document.getElementById('tracker_back').onclick = function() { open_tracker() }

var instrument_preview_interval = setInterval(function(){})

// reset tracker
function reset() {
  elm = document.getElementById('tracker')
  elm.scrollTop = 0
  current_row_id = 0
}
