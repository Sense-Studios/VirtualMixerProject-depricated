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

// c_effect.effect(14)
// contrast.effect(61)
// contrast.extra(0.4)
var INSTRUMENTS = []

// add something something
INSTRUMENTS.push("/video/ignore/dune/Armies.mp4")
INSTRUMENTS.push("/video/ignore/dune/Armies_2.mp4")
INSTRUMENTS.push("/video/ignore/dune/duncan_approaching.mp4")
INSTRUMENTS.push("/video/ignore/dune/face_duncan.mp4")
INSTRUMENTS.push("/video/ignore/dune/the_desert_2.mp4")
INSTRUMENTS.push("/video/ignore/dune/welcome_to_gidi_prime.mp4")

// id, opaacity, cue_time, effect_nuk, effect_value
var initial_data = [
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [1,1],[2,1],[2,1],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [1,0],[2,0,1.0],[2,1,1.0],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [1,1],[2,1],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [1,0],[2,0],[],[],[],[],[],[] ],
  [ [1,1],[],[],[],[],[],[] ],
  [ [1,0],[],[],[],[],[],[],[] ],
  [ [1,1],[],[],[],[],[],[],[] ],

  [ [],[2,1],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [1,0, 0],[2,0],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [1,0],[2,1],[],[],[],[],[],[] ],
  [ [1,1],[],[],[],[],[],[] ],
  [ [1,0],[],[],[],[],[],[],[] ],
  [ [1,1],[],[],[],[],[],[],[] ],

  [ [],[],[2,0],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [1,0,1.0],[2,1],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[2,0],[4,1],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [1,0,12.5],[2,1],[],[],[],[],[],[] ],
  [ [1,1],[],[],[],[],[],[] ],
  [ [1,0],[],[],[],[],[],[],[] ],
  [ [1,1],[],[],[],[],[],[],[] ],

  [ [],[2,0],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [1,0],[2,1],[],[],[],[],[],[] ],
  [ [1,1],[],[],[],[],[],[] ],
  [ [1,0],[],[],[],[],[],[],[] ],
  [ [1,1],[],[],[],[],[],[],[] ],

  [ [1,0],[2,0],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],

  [ [],[2,1],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ],
  [ [],[],[],[],[],[],[],[] ]
]

var is_playing = false
var bpm = 133

var build_instruments = function( _instruments ) {
  INSTRUMENTS.forEach((instrument, i) => {
    //var elm = document.getElementById('#instrument')
    var table = document.getElementById('instruments').children[0]
    table.innerHTML = table.innerHTML + "<tr><td>" + i + "</td><td>" + instrument + "</td></tr>"

  });

}

build_instruments(INSTRUMENTS)

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

var update = function() {

  elm = document.getElementById('tracker')

  //if (elm.scrollTop >= 1006) elm.scrollTop = 0
  //if (elm.scrollTop <= 0) elm.scrollTop = 1006

  elm.scrollTop = Math.round( ( elm.scrollTop/16 ) ) * 16
  current_row_id = elm.scrollTop/16 // row_id
  selectedElements = document.querySelectorAll('td[data-row="'+current_row_id+'"]')

  // console.log( elm.scrollTop, current_row_id )

  if (is_playing) {
    select_cell("none")
    if (elm.scrollTop >= 1006) elm.scrollTop = 0
    elm.scrollBy(0,16)

    selectedElements.forEach(function( item, i ) {
      var index = item.querySelector('.index').textContent
      var opacity = item.querySelector('.opacity').textContent
      var cue = item.querySelector('.cue').textContent
      var effect = item.querySelector('.effect').textContent
      var effect_extra = elm.querySelector('.effect_extra').textContent

      if ( !isNaN(index) || !isNaN(opacity) || !isNaN(cue) || !isNaN(effect) || !isNaN(effect_extra) ) {
        console.log("got something",i," ------ ")
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
          if ( source.video.src.indexOf(INSTRUMENTS[ index ]) == -1 ) {
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
    })
  }else{
    // not playing
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

var reset = function() {
  elm = document.getElementById('tracker')
  elm.scrollTop = 0
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
  console.log("cell", _none, row, current_row_id, cell)

  // reset others
  elm.querySelectorAll("td.selected").forEach(function(td, i) {
    //if ( td == cell ) return

    console.log("td remove:", td)

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
  // console.log("event:", evt.which)

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

  */
}

function updatebpm() {
  tap_bpm.tap()
  bpm = tap_bpm.bpm
  document.getElementById('bpm_display').value = Math.round(bpm*100)/100
}
