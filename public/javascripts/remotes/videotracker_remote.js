// DATA ------------------------------------------------------------------------

// setup for actually saving data
// one data format to rule them all!
var saved_file = {
  bmp: 128,
  mp3: '',
  title: '',
  description: '',
  author: '',
  instruments: [
    {
      url: '/video/ignore/dune/Armies.mp4',
      cues: [ ["C2",1], ["D2", 2] ]
    },
    {
      url: '/video/ignore/dune/Armies_2.mp4',
      cues: [ ["C2",1], ["D2", 2] ]
    },
    {
      url: "/video/ignore/dune/Armies_2.mp4",
      cues: []
    },
    {
      url: "/video/ignore/dune/duncan_approaching.mp4",
      cues: []
    },
    {
      url: "/video/ignore/dune/face_duncan.mp4",
      cues: []
    },

    {
      url: "/video/ignore/dune/the_desert_2.mp4",
      cues: []
    },
    {
      url: "/video/ignore/dune/welcome_to_gidi_prime.mp4",
      cues: []
    },

      {
      url: "/video/ignore/dune/House_artreides_long.mp4",
      cues: [  ["C2",1], ["D2", 5] ]
    },
    {
      url: "/video/ignore/flash/flash_1.mp4",
      cues: []
    },
    {
      url: "/video/ignore/flash/flash_slow_1.mp4",
      cues: []
    }
  ],
  sheet_data: [
      [[["4","0","0.1","",""],["8","1","0.1","",""],["5","1","0.1","",""],["3","1","0.1","",""],["6","1","0.1","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["5","2","","",""],["","","","",""],["6","0","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["8","1","0","",""],["5","1","","",""],["3","0","","",""],["6","1","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["5","2","0","",""],["3","1","0","",""],["6","0","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["5","0.5","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","2","0","",""],["8","2","0","",""],["5","2","0","",""],["3","0","","",""],["6","1","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","2","","",""],["","","","",""],["5","0.5","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","2","","",""],["","","","",""],["5","2","0","",""],["","","","",""],["6","0","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","1","","",""],["","","","",""],["5","5.2","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["8","1","0","",""],["5","1","0","",""],["3","2","0","",""],["6","1","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","0","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["6","0","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","1","3","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["8","2","0","",""],["","","","",""],["","","","",""],["6","1","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","0.5","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","0.5","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","2","","",""],["","","","",""],["","","","",""],["","","","",""],["6","0","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","0.5","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["5","0","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","2","4","",""],["8","1","0","",""],["","","","",""],["3","0","0","",""],["6","1","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","2","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","0","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","1","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","4","","",""],["","","","",""],["","","","",""],["","","","",""],["6","0","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","0","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["5","1.5","0","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","0.5","0","",""],["8","2","0","",""],["","","","",""],["","","","",""],["6","1","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","2","5","",""],["","","","",""],["","","","",""],["3","1","0","",""],["6","0","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["5","0","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","2","0","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["8","1","0","",""],["","","","",""],["","","","",""],["6","1","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["4","0.5","","",""],["","","","",""],["","","","",""],["","","","",""],["6","0","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["5","0.5","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]],[["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]]],
    [ "sheet 1" ],
    [ "sheet 1" ]
  ]
}


// this is gonna be depricated
var INSTRUMENTS = []

// load up instruments
saved_file.instruments.forEach(function( instrument, i ) {
  // add something something
  INSTRUMENTS.push(instrument.url)
})

// id, opaacity, cue_time, effect_nuk, effect_value
var clear_data = [
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
]
var initial_data = saved_file.sheet_data[ 0 ]

// VMX -------------------------------------------------------------------------

// create the main renderer
var renderer = new GlRenderer({element: 'glcanvas'});

// create bpm?
// var bpm = new BPM()

// channels
var channel1_source = new VideoSource(renderer, { src: "" })
//var channel1_filemanager = new FileManager( channel1_source )
var channel1_effect = new ColorEffect( renderer, { source: channel1_source } )
var channel1_monitor = new Monitor( renderer, { source: channel1_effect, element: 'monitoring_canvas_1' })

var channel2_source = new VideoSource(renderer, { src: "" })
//var channel2_filemanager = new FileManager( channel2_source )
var channel2_effect = new ColorEffect( renderer, { source: channel2_source } )
var channel2_monitor = new Monitor( renderer, { source: channel2_effect, element: 'monitoring_canvas_2' })

var channel3_source = new VideoSource(renderer, { src: "" })
//var channel3_filemanager = new FileManager( channel3_source )
var channel3_effect = new ColorEffect( renderer, { source: channel3_source } )
var channel3_monitor = new Monitor( renderer, { source: channel3_effect, element: 'monitoring_canvas_3' })

var channel4_source = new VideoSource(renderer, { src: "" })
//var channel4_filemanager = new FileManager( channel4_source )
var channel4_effect = new ColorEffect( renderer, { source: channel4_source } )
var channel4_monitor = new Monitor( renderer, { source: channel4_effect, element: 'monitoring_canvas_4' })

var channel5_source = new VideoSource(renderer, { src: "" })
//var channel5_filemanager = new FileManager( channel5_source )
var channel5_effect = new ColorEffect( renderer, { source: channel5_source } )
var channel5_monitor = new Monitor( renderer, { source: channel5_effect, element: 'monitoring_canvas_5' })

var channel6_source = new VideoSource(renderer, { src: "" })
//var channel6_filemanager = new FileManager( channel6_source )
var channel6_effect = new ColorEffect( renderer, { source: channel6_source } )
var channel6_monitor = new Monitor( renderer, { source: channel6_effect, element: 'monitoring_canvas_6' })

var channel7_source = new VideoSource(renderer, { src: "" })
//var channel7_filemanager = new FileManager( channel7_source )
var channel7_effect = new ColorEffect( renderer, { source: channel7_source } )
var channel7_monitor = new Monitor( renderer, { source: channel7_effect, element: 'monitoring_canvas_7' })

var channel8_source = new VideoSource(renderer, { src: "" })
//var channel8_filemanager = new FileManager( channel8_source )
var channel8_effect = new ColorEffect( renderer, { source: channel8_source } )
var channel8_monitor = new Monitor( renderer, { source: channel8_effect, element: 'monitoring_canvas_8' })

var end_chain = new Chain( renderer, { sources: [
  channel1_effect, channel2_effect, channel3_effect, channel4_effect,
  channel5_effect, channel6_effect, channel7_effect, channel8_effect
] } );

var tap_bpm = new BPM(renderer);



// master effects
// var master_effect1 = new ColorEffect( renderer, { source: end_chain } )
// var master_effect2 = new ColorEffect( renderer, { source: master_effect1 } )

// mixer?
// var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

// preview out
// var monitor = new Monitor( renderer, { source: mixer1, element: 'monitoring_canvas' })

// final out
var output = new Output( renderer, end_chain )


// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

// disable looping
channel1_source.video.loop = false
channel2_source.video.loop = false
channel3_source.video.loop = false
channel4_source.video.loop = false
channel5_source.video.loop = false
channel6_source.video.loop = false
channel7_source.video.loop = false
channel8_source.video.loop = false

// c_effect.effect(14)
// contrast.effect(61)
// contrast.extra(0.4)

var bpm = tap_bpm.bpm
var is_playing = false



// Build Instruments -----------------------------------------------------------

var build_instruments = function( _instruments ) {
  INSTRUMENTS.forEach((instrument, i) => {
    //var elm = document.getElementById('#instrument')
    var table = document.getElementById('instruments').children[0]
    table.innerHTML = table.innerHTML + "<tr><td>" + i + "</td><td><input class='instrument' id='instrument_'"+i+" value='" + instrument + "'></td><td class='instrument_pointer' data-instrument-id='"+i+"'>»</td></tr>"
  });
}

build_instruments(INSTRUMENTS)

// add interaction
document.querySelectorAll('.instrument').forEach( function( instrument, i ) {
  instrument.onchange = function(e) { INSTRUMENTS[i] = instrument.value }
})

// -----------------------------------------------------------------------------
//

var fill_values = function( _val ) {
  _val.forEach((row, x) => {
    row.forEach((col, y) => {
      console.log("filling: row:", x, "col:", y)
      if ( col[0] != undefined ) {
        var elm = document.querySelector('td[data-rowcol="'+x + "," + y +'"]')
        console.log("has col: ", col, "rowcol: ", x, y, elm)

        // starts the index of an instrument
        // elm.querySelector('.index').textContent = col[0]
        if ( !isNaN(col[0]) ) elm.querySelector('.index').textContent = col[0]
        if ( !isNaN(col[1]) ) elm.querySelector('.opacity').textContent = col[1]
        if ( !isNaN(col[2]) ) elm.querySelector('.cue').textContent = col[2]
        if ( !isNaN(col[3]) ) elm.querySelector('.effect').textContent = col[3]
        if ( !isNaN(col[4]) ) elm.querySelector('.effect_extra').textContent = col[4]
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

  //if (elm.scrollTop >= 1006) elm.scrollTop = 0
  //if (elm.scrollTop <= 0) elm.scrollTop = 1006
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

  // 1 beat = 128/60 = 2.01
  // 1 beat = 128/60 = 2.01
  // 60 000 /
  setTimeout( update, ( ( 60000 / bpm ) / 4 ) )
}
update()

// check if there is an entry in the cell, and execute it
function checkEntry(item, i) {
  var index = item.querySelector('.index').textContent
  var opacity = item.querySelector('.opacity').textContent
  var cue = item.querySelector('.cue').textContent
  var effect = item.querySelector('.effect').textContent
  var effect_extra = elm.querySelector('.effect_extra').textContent

  if (
      !isNaN(index) && index != "" ||
      !isNaN(opacity) && opacity != ""  ||
      !isNaN(cue) && cue != ""  ||
      !isNaN(effect) && effect != ""  ||
      !isNaN(effect_extra)  && effect_extra != ""
    ) {

    console.log("got something",i, !isNaN(index),!isNaN(opacity),!isNaN(cue),!isNaN(effect),!isNaN(effect_extra))
    console.log( item.dataset )
    console.log("index ", index )
    console.log("opacity ", opacity )
    console.log("cue ", cue )
    console.log("effect ", effect )
    console.log("effect_extra ", effect_extra )

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

window.onkeydown = function(evt) {
  console.log("event:", evt.which)

  //32 -- space

  //38 -- up
  //37 -- left
  //39 -- right
  //40 -- down

  if (evt.which == 32) {
    is_playing = !is_playing
    evt.preventDefault
    return false
  }

  if ( evt.which == 37 ) {
    selected_in_row -= 1
    if (selected_in_row < 1) selected_in_row = 1
    select_cell()
    evt.preventDefault
    return false
  }

  if ( evt.which == 39 ) {
    selected_in_row += 1
    if (selected_in_row > 8) selected_in_row = 8
    select_cell()
    evt.preventDefault
    return false
  }

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

  // home
  if (evt.which == 36) {
    select_cell('none')
    reset()
  }

  if (evt.which == 8) {
    updatebpm()
  }

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


   C

   C#

   D

   D#

   E

   F

   F#

  */
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

}

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

function load_up_instrument(_id) {
  var v = document.getElementById('instrument_video')
  v.src = INSTRUMENTS[_id]

  var c = document.getElementById('cue_canvas')
  var width = document.querySelector('.cueeditor').offsetWidth
  c.width = width
  c.height = 250
  var cctx = c.getContext( '2d' );

  // cctx.clearRect(0, 0, 1024, 1024); // send nothing
  var cnt = 0
  var cues = saved_file.instruments[_id].cues
  var loaded_cues = 0

  clearInterval(instrument_preview_interval)
  instrument_preview_interval = setInterval( function() {

    //var idmgData = cctx.getImageData(0, 0, 1000, 1000);
    //cctx.rect( cnt + 150, 0, 1000, 300);
    //cctx.clip();
    //cctx.drawImage( v, cnt, 0, 360, 1280, cnt, 0, 200, 400 );

    //The source image is taken from the coordinates (33, 71),
    // with a width of 104 and a height of 124. It is drawn to the canvas
    //  at (21, 20), where it is given a width of 87 and a height of 104.
    //console.log('trr', r_h, r_w)
    var r_h = v.videoHeight
    var r_w = v.videoWidth

    if ( v.readyState === v.HAVE_ENOUGH_DATA && !v.seeking) {


      //cctx.drawImage( v, 960, 0, 960, 1080, cnt-10, 0, 150, 240 );
      cctx.drawImage( v, r_w/2, 0, r_w/2, r_h, cnt-5, 0, 150, 240 );
      //cctx.putImageData(imgData, 0, 0);

      //console.log("ding", cnt)
      //|              |
      //       900

      //----------------
      //duration / width

      v.currentTime += ( v.duration / width) * 10

      if ( v.currentTime >= v.duration ) {
        clearInterval(instrument_preview_interval)
      }
      cnt += 10

      // cues.sort() ?
      //console.log( loaded_cues, v.currentTime )
      // cues[ loaded_cues ][0] = Note
      // cues[ loaded_cues ][1] = in-point
      if ( cues.length > 0 && loaded_cues < cues.length ) {
        if ( cues[ loaded_cues ][1] < v.currentTime ) {
          console.log("found a CUE!", loaded_cues, cues[ loaded_cues ])
          loaded_cues += 1
        }
      }
    }
  },10) // end interval

  var scrub_interval = setInterval(function() {}, 1000000)
  c.onmousedown = function(evt) {
    console.log("mousedown, START")
    clearInterval(scrub_interval)
    //scrub_interval = setInterval( function() {
    v.currentTime = ( evt.offsetX / width ) * v.duration

    c.onmousemove = function(mm_evt) {
      console.log("tik", v.seeking, mm_evt.offsetX )
      if (!v.seeking) {
        v.currentTime = ( mm_evt.offsetX / width ) * v.duration
      }
    }
  }

  c.onmouseup = function(evt) {
    console.log("mouseup, stop")
    clearInterval(scrub_interval)
    c.onmousemove = null
  }

  /*
  var i = 0
  _self.update = function() {


    if (_self.bypass = false) return
    if ( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA && !videoElement.seeking) {
      canvasElementContext.drawImage( videoElement, 0, 0, texture_size, texture_size );

      if ( videoTexture ) videoTexture.needsUpdate = true;
    }else{
      canvasElementContext.drawImage( videoElement, 0, 0, texture_size, texture_size );  // send last image
      // TODO: console.log("SEND IN BLACK!") ?
      // canvasElementContext.clearRect(0, 0, 1024, 1024); // send nothing
      //_self.alpha = 0
      if ( videoTexture ) videoTexture.needsUpdate = true;
    }
  }
  */
}

function reset() {
  elm = document.getElementById('tracker')
  elm.scrollTop = 0
  current_row_id = 0
}
