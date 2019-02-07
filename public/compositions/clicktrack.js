/*
* Example 1
*
* mixes 2 sold sources together
*
*/

// create a renderer
var renderer = new GlRenderer();

// create some solids
var red = new SolidSource( renderer, { color: { r: 1.0, g: 0.0, b: 0.0 } } );
var green = new SolidSource( renderer, { color: { r: 0.0, g: 1.0, b: 0.0 } } );
var blue = new SolidSource( renderer, { color: { r: 0.0, g: 0.0, b: 1.0 } } );

var source1 = new VideoSource( renderer, {  })
var source2 = new VideoSource( renderer, {  })
var filemanager1
var filemanager2

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

// finally asign that mixer to the output
var output = new Output( renderer, mixer1 )
//var analysis = new AudioAnalysis( renderer, { audio: '/audio/rage_hard.mp3' } );
//analysis.mod = 0.5
//analysis.bpm = 24

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

//var bpm = analysis;


var spreadsheet_orig_url = "https://docs.google.com/spreadsheets/d/1UoFjm5NZJXBfVgeFzYzWyfzRLjg4TjB4bAsTumQjsr4/edit#gid=0";
var key = "AIzaSyDm-v-9cap8pY-pBp21fvEJbHddR1t6iNk";
var spreadsheet_id = spreadsheet_orig_url.match(/[A-Za-z0-9_]{44}/gi)[0];
var spreadsheet_url = "https://sheets.googleapis.com/v4/spreadsheets/"+spreadsheet_id+"/?key=" + key;
var sheet = "Blad1"
var spreadsheet_data_url = "https://sheets.googleapis.com/v4/spreadsheets/"+spreadsheet_id+"/values/"+sheet+"?key=" + key;

console.log("open: ", spreadsheet_url)
console.log("sheet: ", spreadsheet_data_url)

//$.get('/clients/movietrader/tools/tool_data.json', function(d) {
var u = new Utils()
var items = []
u.get(spreadsheet_data_url, function(v) {
    var items = [];
    d = JSON.parse(v).values
    for ( var i = 2 ; i < d.length; i++ ) {
        items.push(d[i]);
    }

    startTheShow(items)
})

// add a function that moves the mixer handle from left to right.
var c = 0;
var time = 0
var startTime = (new Date()).getTime();
var helper = {
  setTime: function( _time ) {
    c = _time/100
    time = time
  }
}

function startTheShow(_items) {
  console.log("start the show", _items)
  setInterval( function() {
    var now = (new Date()).getTime();
    c += 0.01
    // time = Math.round(c*10000)/10000
    time = (now-startTime)/1000

    //console.log(" >> ", time)
    // var startTime = (new Date()).getTime();
    //mixer1.pod ( ( Math.sin(c) * 0.5 ) + 0.5 );

    document.getElementById("currenttime").innerHTML = time
    _items.forEach(function( val, i ) {

      if ( time > parseFloat(val) ) {
        var execute = _items.splice(0,1)[0]
        console.log("execute?: ", i, execute, execute.length)
        if (execute.length >= 3) {
          //try{
            console.log("EXECUTE: ", i, execute)
            var module = window[execute[1]]
            if ( isNaN(execute[3]) ) {
              module[ execute[2] ]( execute[3] )
            }else{
              module[ execute[2] ]( parseFloat(execute[3]) )
            }
        }
      }
    })

  },10)
}
