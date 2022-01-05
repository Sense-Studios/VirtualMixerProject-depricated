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

  [ [1,0],[2,1],[],[],[],[],[],[] ],
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
  if (is_playing) {
    elm = document.getElementById('tracker')
    if (elm.scrollTop >= 1008) elm.scrollTop = 0
    elm.scrollBy(0,16)
    //if ( (elm.scrollTop/16)%4 == 0 ) console.log( elm.scrollTop/16 )

    current_id = elm.scrollTop/16 // row
    selectedElements = document.querySelectorAll('td[data-row="'+current_id+'"]')
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

        if ( !isNaN(index) ) {
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

        if ( !isNaN(opacity) ) {
          var channel = Number(item.dataset.col) + 1
          var source = window["channel" + channel + "_source"]
          source.alpha(opacity)
          console.log("opacity", opacity, " on channel", channel)
        }

        if ( !isNaN(cue) ) {
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
      }
    })
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
