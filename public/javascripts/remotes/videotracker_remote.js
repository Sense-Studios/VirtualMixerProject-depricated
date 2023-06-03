// override
var is_playing = false
var is_recording = false


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

    // document.getElementById('mp3_file')
    if (document.getElementById('audio_player').paused ) {
      document.getElementById('audio_player').currentTime = 0
      document.getElementById('audio_player').play()
    }

    if (elm.scrollTop >= 1024) {
       elm.scrollTop = 0
       document.getElementById('audio_player').currentTime = 0
       document.getElementById('audio_player').play()

       if (!document.getElementById('loop_sheet_checkbox').checked) {
         // go_to_next_sheet(_index)
         document.querySelectorAll(".sheets_container .sheet").forEach((othersheet, j) => {
           othersheet.classList.remove('selected')
         });

         saved_file.sheet_data[current_sheet] = read_values()
         current_sheet += 1
         if ( current_sheet >= saved_file.sheet_data.length ) current_sheet = 0
         fill_values( saved_file.sheet_data[current_sheet], current_sheet )
         reset()
         document.getElementById('sheet_' + current_sheet).classList.add('selected')
         // === end go_to_next_sheet
       }
    }

    current_row_id = Math.round(elm.scrollTop/16) // row_id

    // afdter evaluation we update
    elm.scrollBy(0,16)

  }else{
    if ( !document.getElementById('audio_player').paused ) {
      document.getElementById('audio_player').pause()
    }

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

  // monitoring (TODO: MOve to slowtick?)
  if (is_playing && document.getElementById('is_playing_button').classList.contains('inactive')) {
    document.getElementById('is_playing_button').classList.add('active')
    document.getElementById('is_playing_button').classList.remove('inactive')

  }else if (!is_playing && document.getElementById('is_playing_button').classList.contains('active')) {
    document.getElementById('is_playing_button').classList.add('inactive')
    document.getElementById('is_playing_button').classList.remove('active')
  }else{
  }

  if (is_recording && document.getElementById('is_recording_button').classList.contains('inactive')) {
    document.getElementById('is_recording_button').classList.add('active')
    document.getElementById('is_recording_button').classList.remove('inactive')

  } else if (!is_recording && document.getElementById('is_recording_button').classList.contains('active')) {
    document.getElementById('is_recording_button').classList.add('inactive')
    document.getElementById('is_recording_button').classList.remove('active')
  }else{
  }

  if (is_recording) {
    console.log("recording ...")
  }
}

var scroll_step = 16
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
    elm.scrollBy(0,-scroll_step)
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
    elm.scrollBy(0,scroll_step)
    current_row_id += 1
    select_cell()

    evt.preventDefault
    return false
  }

  // home: RESET TRACKER
  if (evt.which == 36) {
    select_cell('none')
    reset()
    return
  }

  // backspace
  // if (evt.which == 8) {
  //  updatebpm()
  // }

  // for keymap, only use when other buttons turned negative
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
  saved_file.bpm = Math.round(bpm*100)/100
}

// -----------------------------------------------------------------------------
// Import and Export
// -----------------------------------------------------------------------------
function import_sheet( _data ) {

  console.log("import sheet", _data)

  if (!_data) {
    // confirm("will import from clipboard!")
    document.body.focus()
    navigator.clipboard.readText().then( function(_data) {
      console.log(_data)
      saved_file = JSON.parse(_data)
    });
  }else{
    saved_file = JSON.parse(_data)
  }

  fill_values( saved_file.sheet_data[current_sheet] )
  document.getElementById('bpm_display').value = saved_file.bpm
  document.getElementById('mp3_file').value = saved_file.mp3
  bpm = saved_file.bpm
  // loop = saved_file loop

  INSTRUMENTS = []
  saved_file.instruments.forEach(function( instrument, i ) {   INSTRUMENTS.push(instrument.url) })
  build_instruments(INSTRUMENTS)
  init_instruments()
}

function export_sheet() {
  saved_file.sheet_data[current_sheet] = read_values()
  navigator.clipboard.writeText( JSON.stringify( saved_file ) )
  alert("exported to clipboard!")
}

document.getElementById('mp3_file').onchange = function() {
  saved_file.mp3 = document.getElementById('mp3_file').value
}

document.getElementById('tracker_back').onclick = function() {
  document.getElementById('page1_player').classList.add('selected')
  document.getElementById('page2_instrument').classList.remove('selected')
}

// -----------------------------------------------------------------------------
var instrument_preview_interval = setInterval(function(){})

document.getElementById('bpm_display').onchange = function() {
  bpm = Number(this.value)
}

document.onkeyup = function(e){
    console.log(document.querySelector('td.selected'))

    if ( document.querySelector('td.selected') === null ) return

    var trackervalues = document.querySelector('td.selected .trigger_cell').children

    // Del/ Backspace
    if (e.which == 46 || e.which == 8) {
      trackervalues[0].value = ""
      trackervalues[1].value = ""
      trackervalues[2].value = ""
      trackervalues[3].value = ""
      trackervalues[4].value = ""
      trackervalues[5].value = ""
      return

      // One down? Four down?
    }

    if (is_recording) {
      // check the keymap
      console.log("(key up) check keymap", e.which)

      if (!e.ctrlKey) {
        keymap.forEach((key, i) => {
         // console.log("--", e.which, key[1])
         if (e.which == key[1]) {
           trackervalues[0].value = key[0]
           trackervalues[1].value = current_instrument_id
           trackervalues[2].value = 1
           trackervalues[3].value = ""
           trackervalues[4].value = ""
           trackervalues[5].value = ""

           // scroll tracker
           if (elm.scrollTop >= 1006) {
             elm.scrollTop = 0
             return
           }
           elm.scrollBy(0,16)
           current_row_id += 1
           select_cell()
           console.log("move element ...")
           return
         }
       })
     }
   }

    console.log("check key", e.key, e.ctrlKey)
    if ((e.key == 'c') && e.ctrlKey){
        console.log("go go go!")
        var clipboard_text = ""
        clipboard_text += trackervalues[0].value // note
        clipboard_text += "|" + trackervalues[1].value // index
        clipboard_text += "|" + trackervalues[2].value // opacity
        clipboard_text += "|" + trackervalues[3].value // cue
        clipboard_text += "|" + trackervalues[4].value // effect
        clipboard_text += "|" + trackervalues[5].value // effect_extra
        console.log(clipboard_text)
        navigator.clipboard.writeText(clipboard_text)
        // One down? Four down?
    }

    if ((e.key == 'v') && e.ctrlKey){
        console.log(" has clipboard data ", navigator.clipboard)
        navigator.clipboard.readText().then(function(clipboard_text) {
          console.log("we have", clipboard_text )
          clipboard_text = clipboard_text.split("|")

          console.log("go go go", trackervalues, clipboard_text)
          trackervalues[0].value = clipboard_text[0]
          trackervalues[1].value = clipboard_text[1]
          trackervalues[2].value = clipboard_text[2]
          trackervalues[3].value = clipboard_text[3]
          trackervalues[4].value = clipboard_text[4]
          trackervalues[5].value = clipboard_text[5]
        })

        // One down? Four down?
    }
}

// change perspective

m = renderer.scene.children[0]
m.position.z = -10
m.scale.x = 1.4

// START
update()
