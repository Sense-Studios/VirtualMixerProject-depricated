var is_playing = false
var is_recording = false
var current_sheet = 0
var selected_in_row = 1
var current_row_id = 0

// -----------------------------------------------------------------------------
// FILL THE TRACK

var fill_values = function( _val ) {
  console.log("fill")
  _val.forEach((row, x) => {
    row.forEach((col, y) => {
      //console.log("filling: row:", x, "col:", y)
      if ( col[0] != undefined ) {
        var elm = document.querySelector('td[data-rowcol="'+x + "," + y +'"]')
        console.log("has col: ", col, "rowcol: ", x, y, elm)

        // starts the index of an instrument
        console.log( "-", col[0], elm.querySelector('.note'), "--" )

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

// Tracker reset helper
var reset = function() {
  elm = document.getElementById('tracker')
  elm.scrollTop = -16
  current_row_id = 0
}

// MAIN
select_cell()
//fill_values( saved_file.sheet_data[current_sheet])
fill_values( clear_data )
