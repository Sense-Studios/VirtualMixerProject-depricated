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
  if (!_data) {
    navigator.clipboard.readText().then( function(_data) {
      console.log(_data)
      saved_file = JSON.parse(_data)
      fill_values( saved_file.sheet_data[current_sheet])
    });
  }else{
    saved_file = JSON.parse(_data)
    fill_values( saved_file.sheet_data[current_sheet])
  }
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
