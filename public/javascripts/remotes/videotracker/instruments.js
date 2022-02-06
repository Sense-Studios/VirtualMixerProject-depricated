// -----------------------------------------------------------------------------
// Build Instruments

var current_instrument_id = 0
var INSTRUMENTS = []
var SELECTED_INSTRUMENT = 0

var build_instruments = function( _instruments ) {
  var table = document.getElementById('instruments').children[0]
  table.innerHTML = []
  INSTRUMENTS.forEach((instrument, i) => {
    //var elm = document.getElementById('#instrument')
    table.innerHTML = table.innerHTML + "<tr><td>" + i + "</td><td><input class='instrument' data-instrumentindex='" + i + "' id='instrument_'"+i+" value='" + instrument + "'></td><td class='instrument_pointer' data-instrument-id='"+i+"'>»</td></tr>"
  });

  // UI button trigger
  document.querySelectorAll('.instrument_pointer').forEach((pointer, i) => {
    pointer.onclick = function() {
      open_instrument( pointer.dataset.instrumentId )
    }
  });

  // add type interaction to instruments
  document.querySelectorAll('.instrument').forEach( function( instrument, i ) {
    instrument.onchange = function() {
      _index = this.dataset.instrumentindex
      INSTRUMENTS[_index] = this.value
      saved_file.instruments[_index].url = this.value
    }
  })
}

// -----------------------------------------------------------------------------
// interaction

// instruments, rollover and click
var init_instruments = function() {
  console.log("init instrument", document.getElementById('instruments').querySelectorAll('tr'))
  document.getElementById('instruments').querySelectorAll('tr').forEach( function(elm, i) {
    elm.onclick = function( evt ) {
      console.log("add click hadnler: ", elm.querySelectorAll('td')[1].innerText, elm.querySelectorAll('td')[2].dataset.instrumentId)
      var siblings = document.getElementById('instruments').querySelectorAll('tr')
      siblings.forEach(function(elm, i){ elm.classList.remove('selected')})
      elm.classList.add('selected')
      SELECTED_INSTRUMENT = elm.querySelectorAll('td')[1].innerText
      current_instrument_id = elm.querySelectorAll('td')[2].dataset.instrumentId
    }
  })
}

// UI open through  button
function open_instrument(_id){
  document.getElementById('page1_player').classList.remove('selected')
  document.getElementById('page2_instrument').classList.add('selected')
  console.log("Instrument: ", _id, INSTRUMENTS[_id])
  document.querySelector("#page2_instrument .title").innerHTML = "INSTRUMENT: " + _id + ": " + INSTRUMENTS[_id]
  load_up_instrument(_id)
}

// -----------------------------------------------------------------------------
// INIT
saved_file.instruments.forEach(function( instrument, i ) { INSTRUMENTS.push(instrument.url) })
build_instruments(INSTRUMENTS)
init_instruments()
