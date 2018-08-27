
/**
 * Wraps around a Three.js GLRenderer and sets up the scene and shaders.
 * @constructor GlRenderer
 * @example
 *    <!-- a Canvas element with id: glcanvas is required! -->
 *    <canvas id="glcanvas"></canvas>
 *
 *
 *    <script>
 *      let renderer = new GlRenderer();
 *
 *      var red = new SolidSource( renderer, { color: { r: 1.0, g: 0.0, b: 0.0 } } );
 *      let output = new Output( renderer, red )
 *
 *      renderer.init();
 *      renderer.render();
 *    </script>
 */

var GlRenderer = function() {

  console.log("created renderer")

  var _self = this
  /** This is a description of the foo function. */
  // set up threejs scene
  _self.scene = new THREE.Scene();
  _self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  _self.camera.position.z = 20

  // container for all elements that inherit init() and update()
  _self.nodes = [] // sources modules and effects

  // containers for custom uniforms and cosutomDefines
  _self.customUniforms = {}
  _self.customDefines = {}

  // base vertexShader
  _self.vertexShader = "\
\nvarying vec2 vUv;\
\nvoid main() {\
\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
\n  vUv = uv;\
\n}"

  // base fragment shader
  _self.fragmentShader = "\
\nuniform sampler2D textureTest;\
\nuniform float wave;\
\n/* custom_uniforms */\n\
\n/* custom_helpers */\n\
\nvarying vec2 vUv;\
\nvoid main() {\
\n  /* custom_main */\n\
\n}"

  // ---------------------------------------------------------------------------
  /** @function GlRenderer#init */
  _self.init = function(  ) {
    console.log("init renderer")
    _self.glrenderer = new THREE.WebGLRenderer( { canvas: glcanvas, alpha: false } );

    // init nodes
    // reset the renderer, for a new lay out
    /**
     * All the nodes currently added to this renderer
     * @member GlRenderer#nodes
     */
    _self.nodes.forEach(function(n){ n.init() });

    // create the shader
    _self.shaderMaterial = new THREE.ShaderMaterial({
       uniforms: _self.customUniforms,
       defines: _self.customDefines,
       vertexShader: _self.vertexShader,
       fragmentShader: _self.fragmentShader,
       side: THREE.DoubleSide,
       transparent: true
    })

    // apply the shader material to a surface
    _self.flatGeometry = new THREE.PlaneGeometry( 67, 38 );
    _self.flatGeometry.translate( 0, 0, 0 );
    _self.surface = new THREE.Mesh( _self.flatGeometry, _self.shaderMaterial );
    // surface.position.set(60,50,150);

    /**
     * A reference to the threejs scene
     * @member GlRenderer#scene
     */
    _self.scene.add( _self.surface );
  }

  // ---------------------------------------------------------------------------
  var r = Math.round(Math.random()*100)
  /** @function GlRenderer#render */
  _self.render = function() {
  	requestAnimationFrame( _self.render );
  	_self.glrenderer.render( _self.scene, _self.camera );
    _self.glrenderer.setSize( window.innerWidth, window.innerHeight );
    _self.nodes.forEach( function(n) { n.update() } );
  }

  // ---------------------------------------------------------------------------
  // Helpers

  // adds nodes to the renderer
  // function is implicit, and is colled by the modules
  _self.add = function( module ) {
    _self.nodes.push( module )
  }

  // reset the renderer, for a new lay out
  /**
   * Disposes the renderer
   * @function GlRenderer#dispose
   */
  _self.dispose = function() {
    _self.shaderMaterial
    _self.flatGeometry
    _self.scene.remove(_self.surface)
    _self.glrenderer.resetGLState()
    _self.customUniforms = {}
    _self.customDefines = {}
    // base vertexShader

    /**
     * The vertex shader
     * @member GlRenderer#vertexShader
     */
    _self.vertexShader = "\
  \nvarying vec2 vUv;\
  \nvoid main() {\
  \n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
  \n  vUv = uv;\
  \n}"

  /**
   * The fragment shader
   * @member GlRenderer#fragmentShader
   */
    // base fragment shader
    _self.fragmentShader = "\
  \nuniform sampler2D textureTest;\
  \nuniform float wave;\
  \n/* custom_uniforms */\n\
  \n/* custom_helpers */\n\
  \nvarying vec2 vUv;\
  \nvoid main() {\
  \n  /* custom_main */\n\
  \n}"
    _self.nodes = []
  }
}

function AudioAnalysis( renderer ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Analysis_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Addon"
  _self.audio = ""
  _self.bypass = false

    // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // init with a tap contoller
  _self.init = function() {
    console.log("init Audio Analysis Addon.")
    //window.addEventListener( 'keydown', keyHandler )
  }

  _self.update = function() {
    // var tempoData = getTempo(dataSet)
    // getBlackout // TODO
    // getAmbience // TODO
    // 
  }

  _self.scheme = function() {

  }
}

function BPM( renderer ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "BPM_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  window["bpm_" + _self.uuid]
  _self.type = "Addon"
  _self.bpm = 128              // beats per minute
  _self.bps = 2.133333         // beats per second
  _self.sec = 0                // second counter, from which the actual float is calculated
  _self.bpm_float = 0.46875    // 60 / 128, current float of bpm
  _self.mod = 1                // 0.25, 0.5, 1, 2, 4, etc.

  _self.useAutoBpm = true      // auto bpm
  _self.autoBpmData = {}       // info object for the auto bpm
  _self.useMicrophone = false  // use useMicrophone for autoBPM
  _self.audio_src = ""         // audio file or stream (useMicrophone = false)
  _self.bypass = false

  // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // define scheme for this Addon
  _self.scheme = function() {
    var scheme = {
      description: {
        "name": "BPM",
        "type": "Addon"
      },
      inputs: {
        "bypass": "Boolean",
        "audio": "Addon",
        "mod": "number"
      },
      outputs: {
        "bpm": "number",
        "bpm_float": "float"
      }
    }
    return scheme;
  }

  // init with a tap contoller
  _self.init = function() {
    console.log("init BPM contoller.")

    // initialize autoBPM with an audio object
    initializeAutoBpm()
  }

  // UPDATE
  var starttime = (new Date()).getTime()
  _self.update = function() {
    nodes.forEach( function( node ) {
      node( _self.render() );
    });

    c = ((new Date()).getTime() - starttime) / 1000;
    _self.sec = c * Math.PI * _self.bpm / 60            // * _self.mod
    _self.bpm_float = ( Math.sin( _self.sec ) + 1 ) / 2 // Math.sin( 128 / 60 )
  }

  // half or double the bpm
  _self.modUp = function() { _self.mod *= 2; }
  _self.modDown = function() { _self.mod *= .5; }

  // add nodes
  _self.add = function( _func ) {
    nodes.push( _func )
  }

  _self.render = function() {
    // returns current bpm 'position' as a value between 0 - 1
    return _self.bpm_float
  }

  // ---------------------------------------------------------------------------
  // Tapped beat control
  var last = Number(new Date());
  var bpms = [ 128, 128 ,128 ,128 ,128 ];
  var time = 0;
  var avg = 0;

  _self.tap = function() {
    useAutoBPM = false
    time  = Number(new Date()) - last
    last = Number(new Date());
    if ( time < 10000 && time > 10 ) {
      bpms.splice(0,1)
      bpms.push( 60000/time )
      avg = bpms.reduce(function(a, b) { return a + b; }) / bpms.length;
      _self.bpm = avg
      _self.bps = avg/60
    }
  }

  // ---------------------------------------------------------------------------
  // AUTO BPM
  // because of timing issues, autobpm runs seperate from the update call

  // setup ---------------------------------------------------------------------
  var audio = new Audio()
  var context = new AudioContext(); // AudioContext object instance
  var source = context.createMediaElementSource(audio);
  var bandpassFilter = context.createBiquadFilter();
  var analyser = context.createAnalyser();
  var start = Date.now();
  var d = 0; // counter for non-rendered bpm

  // config --------------------------------------------------------------------
  // with ~ 200 samples/s it takes ~ 20 seconds to adjust
  var sampleLength = 4000;
  var dataSet = new Array(sampleLength);
  var peaks = new Array(sampleLength);
  var bufferLength
  var foundpeaks = [];
  var peak_max = 60;
  var peak_min = 15;
  var treshold = 1;
  var intervalCounts = [];

  // this should be set externally (at createion)
  // audio.src = 'http://nabu.sense-studios.com/proxy.php?url=http://208.123.119.17:7904';
  console.log("SET AUDIO SRC")
  //audio.setAttribute('crossorigin', 'anonymous');
  // audio.src =  'http://37.220.36.53:7904';
  //audio.src = '/audio/fear_is_the_mind_killer_audio.mp3'
  audio.src = '/audio/fulke_absurd.mp3'
  //audio.src = '/audio/rage_hard.mp3'
  // audio.src = '/audio/i_own_it.mp3'
  // audio.src = '/audio/100_metronome.mp3'
  // audio.src = '/audio/120_metronome.mp3'
  // audio.src = '/audio/140_metronome.mp3'

  audio.controls = true;
  audio.loop = true;
  audio.autoplay = true;

  bandpassFilter.type = "lowpass";

  // or as argument(settings.passFreq ? settings.passFreq : 350);
  bandpassFilter.frequency.value = 350
  bandpassFilter.Q.value = 1

  analyser.fftSize = 128;
  bufferLength = analyser.frequencyBinCount;

  // firstload for mobile
  $("body").click(function() {
    console.log("Auto BPM is initialized!", audio.src);
    audio.play();
    document.body.webkitRequestFullScreen()
  });

  // initialize Audio, used in the first run
  var initializeAudio = new Promise( function( resolve, reject ) {
    source.connect(bandpassFilter);
    bandpassFilter.connect(analyser);

    // COMMENT THIS OUT FOR NOW SOUND
    source.connect(context.destination);

    resolve(audio);
    reject(err);
  })

  var initializeAutoBpm = function() {
    initializeAudio.then( function(r) {
      console.log("Auto BPM is initialized!", audio.src);
      audio.play();
      setInterval( sampler, 1);                 // as fast as we can, we need those samples

    }).catch( function(err){
      console.log("Error: Auto BPM ERROR ", err);
    });
  }

  var sampler = function() {
    if ( !_self.useAutoBpm ) return;
    if ( _self.audio_src != "" && !_self.useMicrophone ) return;
    if ( _self.bypass ) return;
    // if  no src && no mic -- return
    // if ... -- return

    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray)

    // precalc
    var now = Date.now()
    var high = 0
    dataArray.forEach( (d,i)=> { if ( d > high ) high = d })
    dataSet.push( [ now, high ] )

    if (dataSet.length > sampleLength) dataSet.splice(0, dataSet.length - sampleLength)
    d++

    // SLOWPOKE
    // take a snapshot every 1/10 second and calculate beat
    if ( ( now - start) > 100 ) {

      var tempoData = getTempo(dataSet)
      //var tempoCounts = tempoData.tempoCounts
      // getBlackout // TODO
      // getAmbience // TODO
      // drawData(dataSet) // DEPRICATED
      //if (tempoCounts[0] !== undefined) window.bpm = tempoCounts[0].tempo

      // $('#info').html( dataSet.length + "\t " + c * 10 + " samples/s" + "\t peaks: "  + foundpeaks.length + "\tBPM: <strong>"+ Math.round(window.bpm) + " </strong> ("+Math.round(window.bpm2)+") \t\tconfidence: <em>" + window.confidence + " <strong>" + window.calibrating + "</strong></em>" ) //.+ " -- " + _dataSet[ _dataSet.length - 1 ] )
      // console.log(" ### AUTOBPM: ",  window.calibrating, tempoData.bpm, d, tempoData.foundpeaks.length, treshold )
      window.bpm_test = tempoData.bpm
      _self.sec = c * Math.PI * tempoData.bpm / 60
      start = Date.now()
      d = 0
    }
  }

  // blink on the beat
  var doBlink = function() {
    if ( audio.paused ) {
      $('.blink').hide()
    }else{
      $('.blink').toggle()
    }
    setTimeout( doBlink, (60/window.bpm_test)*1000 )
  }
  doBlink()

  // rewrite of getTempo without display and local vars
  var getTempo = function( _data ) {
    foundpeaks = []                    // reset foundpeaks
    peaks = new Array( _data.length )  // reset peaks

    // find peaks
    for ( var i = 0; i < _data.length; i++ ) {
      if ( _data[i] !== undefined && _data[i][1] > ( treshold * 128 ) ) {
        peaks[i] = [ dataSet[i][0], 1 ];           // update in peaks
        foundpeaks.push( [ _data[i][0], 1 ] );     // add to foundpeaks
        i += 50;                                   // += 0.4s, to move past this peak
      }
    }

    // make sure we have enough peaks by adjusting the treshhold
    if ( foundpeaks.length < peak_min ) treshold -= 0.05;
    if ( foundpeaks.length > peak_max ) treshold += 0.05;
    if ( treshold > 2 ) treshold = 2;
    if ( treshold < 1 ) treshold = 1;

    // calculate tempo by grouping peaks and calculate interval between them
    // see: http://joesul.li/van/beat-detection-using-web-audio/
    // for more information on this method and the sources of the algroritm
    var tempoCounts = groupNeighborsByTempo( countIntervalsBetweenNearbyPeaks( foundpeaks ) );
    tempoCounts.sort( mycomparator );                             // sort tempo's by 'score', or most neighbours
    if ( tempoCounts.length == 0 ) {
      tempoCounts[0] = { tempo: 0 }; // if no temp is found, return 0
    }else{
      // DISPLAY
      var html = ""
      tempoCounts.reverse().forEach(function(v,i) {
        html += i + ", " + v.tempo + ", " + v.count + "\t ["
        var j = 0
        while( j < v.count) {
          html += '#'
          j++
        }
        html += ']<br/>'
      })
      $('#info').html(html)
    }

    var confidence = "calibrating"
    var calibrating = false
    if ( _data[0] === undefined ) {
      calibrating = true
      $('.blink').css('background-color','rgba(150,150,150,0.5) !important')
    }else{
      calibrating = false

      if (tempoCounts[0] === undefined  || tempoCounts[1] === undefined ) {
        console.log("holdit")
        return
      }

      var confidence_mod = tempoCounts[0].count - tempoCounts[1].count
      if ( confidence_mod <= 2 ) {
        confidence = "low"
        $('.blink').css('background-color','red')
      }else if( confidence_mod > 2 && confidence_mod <= 7) {
        confidence = "average"
        $('.blink').css('background-color','yellow')
      }else if( confidence_mod > 7 ) {
        confidence = "high"
        $('.blink').css('background-color','white')
      }
    }

    // return an object with all the necc. data.
    var tempoData = {
      bpm: tempoCounts[0].tempo,     // suggested bpm
      confidence: confidence,
      calibrating: calibrating,
      treshold: treshold,            // current treshold
      tempoCounts: tempoCounts,      // current tempoCounts
      foundpeaks:  foundpeaks,       // current found peaks
      peaks: peaks                   // all peaks, for display only
    }

    return tempoData;
  }

  // HELPERS
  // sort helper
  var mycomparator = function ( a,b ) {
    return parseInt( a.count, 10 ) - parseInt( b.count, 10 );
  }

  // generate interval counter
  var countIntervalsBetweenNearbyPeaks = function( _peaks ) {

    // reset
    intervalCounts = [];

    _peaks.forEach(function(peak, index) {
      for(var i = 0; i < 10; i++) {
        if ( _peaks[index + i] !== undefined ) {
          var interval = _peaks[index + i][0] - peak[0];
          var foundInterval = intervalCounts.some( function(intervalCount) {
            if (intervalCount.interval === interval) return intervalCount.count++;
          });
          if (!foundInterval) intervalCounts.push({ interval: interval, count: 1 });
        }
      }
    });

    return intervalCounts;
  }

  // group intervalcounts by temp
  var groupNeighborsByTempo = function( intervalCounts ) {

    // reset
    var tempoCounts = []
    var noTempo = false

    // start the interval counts
    intervalCounts.forEach(function(intervalCount, i) {

      // Convert an interval to tempo
      if (intervalCount.interval != 0 && !isNaN(intervalCount.interval)) {
        var theoreticalTempo = 60 / (intervalCount.interval / 1000)
      }

      // Adjust the tempo to fit within the 90-180 BPM range
      while (theoreticalTempo < 90) theoreticalTempo *= 2;
      while (theoreticalTempo > 180) theoreticalTempo /= 2;

      // round to 2 beat
      theoreticalTempo = Math.round( theoreticalTempo/2 ) * 2

      var foundTempo = tempoCounts.some(function(tempoCount) {
        if (tempoCount.tempo === theoreticalTempo && !noTempo )
          return tempoCount.count += intervalCount.count;
      });

      // add it to the tempoCounts
      if (!foundTempo) {
        if ( theoreticalTempo && !noTempo ) {
          tempoCounts.push({
            tempo: theoreticalTempo,
            count: intervalCount.count
          })
        }
      }
    });

    return tempoCounts
  } // end groupNeighborsByTempo

} // end BPM

function FileManager( _source ) {

  var _self = this
  _self.uuid = "Filemanager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.defaultQuality = ""
  _self.source = _source
  _self.programs = []
  _self.file
  _self.renderer = renderer // do we even need this ?!!


  _self.setSrc = function( file ) {
    console.log("set source: ", file)
    _self.source.src(file)
  }

  _self.getFileById = function( _id ) {
    var match = null
  }

  _self.getSrcByTags = function( _tags ) {
    // _tags = array
    if ( programs.length == 0 ) return "no programs"

    var matches = []
    programs.forEach( function( p, i) {
      //console.log(i, p)
      _tags.forEach( function( t, j) {
        //console.log( j, t)
        if ( p.tags.includes(t) ) {
          matches.push(p)
        }
      })
    })

    if ( matches.length == 0 ) return "no matches"
    var program = matches[ Math.floor( Math.random() * matches.length )]
    console.log(">> ", matches.length, program.title)
    _self.setSrc( _self.getSrcByQuality( program ) );
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  // load another source from the stack
  _self.change = function( _tag ) {

    if ( programs.length == 0 ) return "no programs"
    if ( _tag ) {
      _self.getSrcByTags( [ _tag ] );
      return;
    }

    console.log("change video")
    var program = programs[ Math.floor( Math.random() * programs.length ) ]
    if ( program.assets._type != "Video" ) {
      // noit elegible, try again
      _self.change()
      return
    }
    _self.setSrc( _self.getSrcByQuality( program ) );
  }

  // for old times sake,
  _self.changez = function( _tag ){
    _self.change( _tag )
  }

  // get the version by it's quality ( marduq asset library )
  _self.getSrcByQuality = function( _program, _quality ) {
    if ( _quality == undefined ) _quality = "720p_h264"
    var match = null
    _program.assets.versions.forEach( function(version) {
      if ( version.label == _quality ) match = version
    })
    return match.url;
  }
}

function GiphyManager( _source ) {

  var _self = this
  _self.uuid = "GiphyManager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.source = _source
  _self.file
  _self.programs
  _self.program
  _self.renderer = renderer // do we even need this ?!!

  var key = "tIovPHdiZhUF3w0UC6ETdEzjYOaFZQFu"

  _self.needle = function( _needle ) {
    $.get('http://api.giphy.com/v1/gifs/search?api_key='+key+'&q='+_needle, function(d) {
      _self.programs = d.data
      console.log(" === GIPHY (re)LOADED === ")
    })
  }

  // alternate
  _self.search = function( _query ) {
    _self.needle( _query );
  }

  _self.setSrc = function( file ) {
    console.log("set source: ", file)
    _self.source.src(file)
  }

  // load another source from the stack
  _self.change = function() {
    if ( _self.programs.length == 0 ) return "no programs"
    _self.program = _self.programs[ Math.floor( Math.random() * _self.programs.length ) ]
    _self.setSrc( _self.program.images.original.url );
  }

  // for old times sake,
  _self.changez = function(){
    _self.change()
  }

  // load it up with defauilts
  _self.needle("vj")
}


function FireBaseControl( renderer, _mixer1, _mixer2, _mixer3 ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "FireBaseControl_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.clients = {};
  _self.bypass = true

  // source.renderer ?
  var _mixers = []
  var _filemanagers = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // Firebase refs
  var _dbRef, _clientRef, _client, clients
  var leftx = 0
  var lefty = 0

  // init with a tap contoller
  _self.init = function() {
    console.log("init FireBase contoller.")
    // window.addEventListener( 'keydown', keyHandler )
    // window.addEventListener("gamepadconnected", connecthandler )

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDgrYfOUDN1QLRDcY4z45WwkcOjkXiImNQ",
      authDomain: "mixerbase-829c2.firebaseapp.com",
      databaseURL: "https://mixerbase-829c2.firebaseio.com",
      storageBucket: "mixerbase-829c2.appspot.com",
      messagingSenderId: "568387460963"
    };

    firebase.initializeApp(config);

    _dbRef = firebase.database()
    _clientRef = "/client_1/"
    _client = _dbRef.ref(_clientRef)
    clients = []

    //$.each( clients, function( i, c ) {
    //  c.dbref.ref('/client/').on('value', function( e ) {
    //    c.update( e )
    //  })
    //})

    _client.on('value', function(e) {
      //console.log("I update you", e)
      //console.log( _client.child( "/leftx" ).val() )
      //console.log( _client.child( "/lefty" ).val() )
    });

    // a overwritable timer interval to avoid collisions
    var _to

    _client.child( "gamepad/leftx" ).on('value', function(e) {
      leftx = e.val()
      updateMixers( leftx, lefty )
    })

    _client.child( "gamepad/lefty" ).on('value', function(e) {
      lefty = e.val()
      updateMixers( leftx, lefty )
    })

    _client.child( "gamepad/button_1" ).on('value', function(e) {
      //clearTimeout(_to); _to = setTimeout( function() { filemanager1.change() } , 200 )
      clearTimeout(_to); _to = setTimeout( function() { giphymanager1.change() } , 200 )
    })

    _client.child( "gamepad/button_2" ).on('value', function(e) {
      clearTimeout(_to); _to = setTimeout( function() { filemanager2.change() } , 200 )
    })

    _client.child( "gamepad/button_3" ).on('value', function(e) {
      clearTimeout(_to); _to = setTimeout( function() { filemanager3.change() } , 200 )
    })

    _client.child( "gamepad/button_4" ).on('value', function(e) {
      clearTimeout(_to); _to = setTimeout( function() { filemanager4.change() } , 200 )
    })

    // init firebase
    var i = 0
    while(i < 17) {
      _client.child( "mobilepad/button_" + i ).on('value', function(e) {
        console.log('i click you', i, e.key)
      })
      i++;
    }
  }

  _self.update = function() {}
  _self.render = function() {}

  // ---------------------------------------------------------------------------
  // Helpers

  _self.addMixer = function( _mixer ) {
    _mixers.push( _mixer )
  }

  _self.addFileManager = function( _filemanager ) {
    _filemanagers.push( _filemanager )
  }

  // ---------------------------------------------------------------------------
  // "Private"

  var updateMixers = function( leftx, lefty ) {
    // might need some more tweaking, to make this more flexible
    // or, we just add some behaviour and/or configuration
    // oringal GANSTA SENSE STYLE
    // _mixers[0].pod( leftx/2+0.5 )
    // _mixers[1].pod( leftx/2+0.5 )
    // _mixers[2].pod( lefty/2+0.5 )
    console.log("update mixers")
    _mixer1.pod( leftx/2+0.5 )
    _mixer2.pod( leftx/2+0.5 )
    _mixer3.pod( lefty/2+0.5 )

  }

  var updateButton = function( _button ) {
    /*
    if ( i == 0 ) { clearTimeout(to1); to1 = setTimeout( function() { filemanager1.change(); } , 200 ) }
    if ( i == 1 ) { clearTimeout(to2); to2 = setTimeout( function() { filemanager2.change(); } , 200 ) }
    if ( i == 2 ) { clearTimeout(to3); to3 = setTimeout( function() { filemanager3.change(); } , 200 ) }
    if ( i == 3 ) { clearTimeout(to4); to4 = setTimeout( function() { filemanager4.change(); } , 200 ) }
    */
  }

  var keyHandler = function( _event ) {
    // should be some way to check focus of this BPM instance
    // if _self.hasFocus
    //}
  }
}


/*
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
    var gp = navigator.getGamepads()[e.gamepad.index];
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      gp.index, gp.id,
      gp.buttons.length, gp.axes.length);
});
*/

function GamePad( renderer, _mixer1, _mixer2, _mixer3 ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "GamePad_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};
  _self.bypass = true

  // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // init with a tap contoller
  _self.init = function() {
    console.log("init GamepadController contoller.")
    //window.addEventListener( 'keydown', keyHandler )

    window.addEventListener("gamepadconnected", connecthandler )


  }

  var to1, to2, to3, to4, to5, to6, to7, to8
  var lock
  _self.update = function() {
    // console.log(_self.controllers[0].axes)
    // console.log( navigator.getGamepads()[0].axes )
    // console.log( navigator.getGamepads()[0].axes
    // [0.003921627998352051, 0.003921627998352051, 0, 0, 0, 0.003921627998352051, 0.003921627998352051, 0, 0, 3.2857141494750977]
    // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
    //   LP                RP         W
    if ( _self.bypass ) return;

    var buttons = navigator.getGamepads()[0].buttons
    //console.log(navigator.getGamepads()[0].buttons)
    navigator.getGamepads()[0].buttons.forEach(function(b, i){
      if ( b.pressed ) {
        console.log(" i press you ", i, b)
        // HACKITY

        // if we use thje same timeout it worsk too
        if ( i == 0 ) { clearTimeout(to1); to1 = setTimeout( function() { filemanager1.change(); } , 200 ) }
        if ( i == 1 ) { clearTimeout(to2); to2 = setTimeout( function() { filemanager2.change(); } , 200 ) }
        if ( i == 2 ) { clearTimeout(to3); to3 = setTimeout( function() { filemanager3.change(); } , 200 ) }
        if ( i == 3 ) { clearTimeout(to4); to4 = setTimeout( function() { filemanager4.change(); } , 200 ) }

        // if ( i == 4 ) { clearTimeout(to1); to1 = setTimeout( function() { VideoSource. } , 200 ) }
        // if ( i == 5 ) { clearTimeout(to1); to1 = setTimeout( function() { } , 200 ) }
        // if ( i == 6 ) { clearTimeout(to1); to1 = setTimeout( function() { } , 200 ) }
        // if ( i == 7 ) { clearTimeout(to1); to1 = setTimeout( function() { } , 200 ) }

      }
    })

    var axes = navigator.getGamepads()[0].axes
    var leftx = axes[0];
    var lefty = axes[1];

    var rightx = axes[5];
    var righty = axes[6];

    var weird = axes[9];

    // oringal GANSTA SENSE STYLE
    _mixer1.pod(leftx/2+0.5)
    _mixer2.pod(leftx/2+0.5)
    _mixer3.pod(lefty/2+0.5)

    // oringal GANSTA SENSE STYLE
    //_mixer1.pod(Math.abs(leftx))
    //_mixer2.pod(Math.abs(lefty))
    //_mixer3.pod(lefty/2+0.5)


  }

  // ---------------------------------------------------------------------------
  // Helpers

  _self.add = function( _func ) {
    nodes.push( _func )
  }

  _self.render = function() {
    return _self.controllers
  }

  // ---------------------------------------------------------------------------
  // "Private"

  var addgamepad = function( gamepad ) {
    _self.controllers[gamepad.index] = gamepad
    console.log(gamepad.id, gamepad.index )
  }

  var connecthandler = function( e ) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id);
    addgamepad(e.gamepad)
    _self.bypass = false
  }

  var keyHandler = function( _event ) {
    // should be some way to check focus of this BPM instance
    // if _self.hasFocus
    //}
  }
}


/*
window.addEventListener("gamepadconnected", function(e) {
  console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    e.gamepad.index, e.gamepad.id,
    e.gamepad.buttons.length, e.gamepad.axes.length);
    var gp = navigator.getGamepads()[e.gamepad.index];
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      gp.index, gp.id,
      gp.buttons.length, gp.axes.length);
});
*/

function GamePadHorizontalControl( renderer ) {
}

function GamePadVerticalControl( renderer ) {

}


// refers to ...
// https://gist.github.com/xangadix/936ae1925ff690f8eb430014ba5bc65e

function MidiController( renderer, _mixer1, _mixer2, _mixer3 ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Midi_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};
  _self.bypass = true

  // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // init with a tap contoller
  _self.init = function() {
    console.log("init MidiController contoller.")
    //window.addEventListener( 'keydown', keyHandler )
  }

  _self.update = function() {
  }

  _self.scheme = function() {
    var scheme = {
      inputs: {
      },
      outputs: {
        tones: [],
        floats: [],
        visual: [],
        audio: []
      }
    }
    return scheme
  }
}

function NumpadBpmMixerControl( renderer, _mixer, _bpm ) {

  var _self = this

  // exposed variables.
  _self.uuid = "NumpadBpmMixer_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};

  var _bpms = []
  var _mixers = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // init with a tap contoller
  _self.init = function() {
    window.addEventListener( 'keydown', keyDownHandler )
    window.addEventListener( 'keyup', keyUpHandler )
  }

  _self.update = function() {}
  _self.render = function() {}

  // ---------------------------------------------------------------------------
  // Helpers

  _self.addMixer = function( _mixer ) {
    _mixers.push( _mixer )

  }

  _self.addBpm = function( _bpm ) {
    _bpms.push( _bpm )
  }

  // --------------------------------------------------------------------------
  var blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ];
  var mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  var _to;

  $('body').click( function() { _bpms.forEach( function( b ) { b.tap() } ) } );

  var keyDownHandler = function( _event ) {
    // should be some way to check focus of this BPM instance
    // if _self.hasFocus

    // 36 / 103, 38 / 104, 33 / 105, 107

    // 37 / 103, 38 / 101, 39 / 102

    // 35 /  97, 40 /  98, 33 / 105,  13

    // 45 /  96,         , 46 / 110

    console.log("had key: ", _event.which)

    var keybindings = [

      // BPM
      //[ 219, function() { _bpms.forEach( function( b ) { b.bpm -= 1   } ); } ], // [[]
      //[ 221, function() { _bpms.forEach( function( b ) { b.bpm += 1   } ); } ],  // ]
      [ 109, function() { _bpms.forEach( function( b ) { b.bpm -= 1   } ); } ], //  numpad -
      [ 107, function() { _bpms.forEach( function( b ) { b.bpm += 1   } ); } ],  // numpad +

      [ 106, function() { _bpms.forEach( function( b ) { b.bpm *= 2   } ); } ],  // numpad *
      [ 111, function() { _bpms.forEach( function( b ) { b.bpm *= 0.5 } ); } ],  // numpad /

      [ 101, function() { _bpms.forEach( function( b ) { b.tap()      } ); }  ],  // numpad 5

      // hackity
      [  96, function() { switcher1.doSwitch(0) } ],  // 0
      [ 110, function() { switcher1.doSwitch(1) } ],  // .
      [  75, function() { switcher1.doSwitch(0) } ],  // k
      [  76, function() { switcher1.doSwitch(1) } ],  // l
      [  66, function() { _bpms.forEach( function( b ) { b.tap()      } ); }  ],  // b
      [  32, function() { _bpms.forEach( function( b ) { b.tap()      } ); }  ],  // [space]

      // hack
      //[  219, function() { clearTimeout(_to); _to = setTimeout( function() { filemanager1.change() } , 200 ) } ], // [
      [  81, function() { clearTimeout(_to); _to = setTimeout( function() { giphymanager1.change() } , 200 ) } ], // q
      //[  87, function() { clearTimeout(_to); _to = setTimeout( function() { giphymanager1.change() } , 200 ) } ], // w

      [  87, function() { clearTimeout(_to); _to = setTimeout( function() { filemanager2.change("awesome") } , 200 ) } ], // w
      [  69, function() { clearTimeout(_to); _to = setTimeout( function() { filemanager3.change("runner") } , 200 ) } ], // e
      [  82, function() { clearTimeout(_to); _to = setTimeout( function() { filemanager4.change() } , 200 ) } ], // r

      [  65, function() { giphymanager1.source.currentFrame( Math.floor( Math.random() * giphymanager1.source.duration() ) ) } ], // a
      [  83, function() { filemanager2.source.currentTime( Math.floor( Math.random() * filemanager2.source.duration() ) ) } ], // b
      [  68, function() { filemanager3.source.currentTime( Math.floor( Math.random() * filemanager3.source.duration() ) ) } ], // c

      [  188, function() { mixer3.pod( mixer3.pod() - 0.1 ) } ], // ,
      [  190, function() { mixer3.pod( mixer3.pod() + 0.1 ) } ], // .
      //[  190, function() { mixer3.pod( mixer3.pod() + 0.1 ) } ], // .


      // MIXER
      // [ 219, function() { return i -= 1 } ], // 4
      // [ 221, function() { return i += 1 } ]  // 6

      // reset
      [ 104, function() { _mixers.forEach( function(m) { m.blendMode(1); m.mixMode(1); blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ]; mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }) }],  // 8

      [ 103, function() { blendmodes.unshift( blendmodes.pop() ); _mixers.forEach( function(m) { m.blendMode(blendmodes[0]); } ) } ],  // 7
      [ 105, function() { blendmodes.push( blendmodes.shift());   _mixers.forEach( function(m) { m.blendMode(blendmodes[0]); } ) } ],  // 9
      [ 100, function() { mixmodes.unshift( mixmodes.pop() );     _mixers.forEach( function(m) { m.mixMode(mixmodes[0]);     } ) } ],  // 4
      [ 102, function() { mixmodes.push( mixmodes.shift());       _mixers.forEach( function(m) { m.mixMode(mixmodes[0]);     } ) } ],  // 6

      [ 97, function() { console.log("mix trans left, down") } ],  // 6
      //[ 95, function() { transmodes.unshift( transmodes.pop() ); mixmode = transmodes[0]; } ],  // 6
      [ 99, function() { console.log("mmix trans right, down") } ]  // 6

    ]

    keybindings.forEach( function( bind ) {
      if ( bind[0] == _event.which ) {
        bind[1]();
        //console.log("numpad Handled key", bind[0], _bpm.bpm,  _mixer.mixMode(),  _mixer.blendMode() )
        console.log("numpad Handled key DOWN", bind[0], _bpm.bpm,  _mixer.mixMode(),  _mixer.blendMode() )
      }
    })
  }

  var keyUpHandler = function( _event ) {
    var keybindings = [
      [ 97, function() { console.log("mix trans left, up") } ],  // 6
      //[ 95, function() { transmodes.unshift( transmodes.pop() ); mixmode = transmodes[0]; } ],  // 6
      [ 99, function() { console.log("mmix trans right, up") } ]  // 6
    ]

    keybindings.forEach( function( bind ) {
      if ( bind[0] == _event.which ) {
        bind[1]();
        console.log("numpad Handled key UP", bind[0], _bpm.bpm,  _mixer.mixMode(),  _mixer.blendMode() )
      }
    })
  }

}


function SourceControl( renderer, source ) {
  // source.renderer ?

}


// fragment
// vec3 b_w = ( source.x + source.y + source.z) / 3
// vec3 amount = source.xyz + ( b_w.xyx * _alpha )
// col = vec3(col.r+col.g+col.b)/3.0;
// col = vec4( vec3(col.r+col.g+col.b)/3.0, _alpha );

function BlackAndWhite( renderer, _source ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( options.uuid == undefined ) {
    _self.uuid = "Effect_BlackAndWhite_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }


  _self.type = "Effect"

  var source = _source

  _self.init = function() {

    // add uniforms to renderer
    // renderer.customUniforms[_self.uuid+'_mixmode'] = { type: "i", value: 1 }

    // add uniforms to fragmentshader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_mixmode;\n/* custom_uniforms */')

    // _output * uuid_alpha_1
    // uuid_alpha_1 * -pod
    // uuid_alpha_2 * +pod

    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = blend( '+source1.uuid+'_output ,'+source2.uuid+'_output, '+_self.uuid+'_blendmode );\n  /* custom_main */')
  }

  _self.update = function() {

    // mixmode
    // blendmode
    // pod
  }
}

function Chain(renderer, options) {

  // THIS IS DEPRICATED
  // TODO: Rewrite

  // create and instance
  var _self = this;

  // set or get uid
  if ( options.uuid == undefined ) {
    _self.uuid = "Chain_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  // add to renderer
  renderer.add(_self)

  // set options
  var _options;
  if ( options != undefined ) _options = options


  _self.type = "Module"
  _self.sources = options.sources


  // Depricated, needs to exit with an output node like uuid_output
  _self.init = function() {
    _self.sources.forEach( function( source ) {
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'final_output = final_output + vec3( texture2D( '+source.uuid+', vUv ).xyz * '+source.uuid+'_alpha );\n  /* custom_main */')
      //'vec3 '+_self.uuid+'_output =
    });
  }

  _self.update = function() {}
}

/**
 * A mixer mixes two sources together. It can crossfade the sources with different MixModes and BlendModes
 *
 * @example let myMixer = new Mixer( renderer, { source1: myVideoSource, source2: myOtherMixer });
 * @constructor Mixer
 * @param renderer:GlRenderer
 * @param options:Object
 * requires source1 and source 2 in options param with a source
 */

function Mixer( renderer, options ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( options.uuid == undefined ) {
    _self.uuid = "Mixer_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  // add to renderer
  renderer.add(_self)

  // set options
  var _options;
  if ( options != undefined ) _options = options

  // set type
  _self.type = "Module"

  // add local variables
  var alpha1 = 1
  var alpha2 = 0
  var pod = 0
  var mixmode = 1
  // of 8 1: NORMAL, 2: HARD, 3: NAM, 4: FAM, 5: LEFT, 6: RIGHT, 7: CENTER, 8: BOOM
  _self.mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  //var transmodes = [ 1, 2, 3 ]
  //var transmodes = 1


  var blendmode = 1
  // of 18: 1 ADD (default), 2 SUBSTRACT, 3 MULTIPLY, 4 DARKEN, 5 COLOUR BURN,
  // 6 LINEAR_BURN, 7 LIGHTEN,  8 SCREEN, 9 COLOUR_DODGE, 10 LINEAR_DODGE,
  // 11 OVERLAY, 12 SOFT_LIGHT, 13 HARD_LIGHT, 14 VIVID_LIGHT, 15 LINEAR_LIGHT,
  // 16 PIN_LIGHT, 17 DIFFERENCE, 18 EXCLUSION
  _self.blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ]

  var source1, source2
  source1 = options.source1
  source2 = options.source2

  _self.init = function() {

    // add uniforms to renderer
    renderer.customUniforms[_self.uuid+'_mixmode'] = { type: "i", value: 1 }
    renderer.customUniforms[_self.uuid+'_blendmode'] = { type: "i", value: 1 }
    //renderer.customUniforms[_self.uuid+'_pod'] = { type: "f", value: 0.5 }
    renderer.customUniforms[_self.uuid+'_alpha1'] = { type: "f", value: 0.5 }
    renderer.customUniforms[_self.uuid+'_alpha2'] = { type: "f", value: 0.5 }
    renderer.customUniforms[_self.uuid+'_sampler'] = { type: "t", value: null }

    // add uniforms to fragmentshader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_mixmode;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_blendmode;\n/* custom_uniforms */')
    //renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_pod;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha1;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha2;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')

    // add blendmodes helper, we only need it once
    if ( renderer.fragmentShader.indexOf('vec3 blend ( vec3 src, vec3 dst, int blendmode )') == -1 ) {
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_helpers */','\
\nvec3 blend ( vec3 src, vec3 dst, int blendmode ) {\
\n  if ( blendmode ==  1 ) return src + dst;\
\n  if ( blendmode ==  2 ) return src - dst;\
\n  if ( blendmode ==  3 ) return src * dst;\
\n  if ( blendmode ==  4 ) return min(src, dst);\
\n  if ( blendmode ==  5)  return vec3((src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z)));\
\n  if ( blendmode ==  6 ) return (src + dst) - 1.0;\
\n  if ( blendmode ==  7 ) return max(src, dst);\
\n  if ( blendmode ==  8 ) return (src + dst) - (src * dst);\
\n  if ( blendmode ==  9 ) return vec3((src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z)));\
\n  if ( blendmode == 10 ) return src + dst;\
\n  if ( blendmode == 11 ) return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\
\n  if ( blendmode == 12 ) return vec3((src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z))));\
\n  if ( blendmode == 13 ) return vec3((src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)), (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z)));\
\n  if ( blendmode == 14 ) return vec3((src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z))));\
\n  if ( blendmode == 15 ) return 2.0 * src + dst - 1.0;\
\n  if ( blendmode == 16 ) return vec3((src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), (src.x > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z));\
\n  if ( blendmode == 17 ) return abs(dst - src);\
\n  if ( blendmode == 18 ) return src + dst - 2.0 * src * dst;\
\n  return src + dst;\
\n}\n/* custom_helpers */');
    }

    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = blend( '+source1.uuid+'_output * '+_self.uuid+'_alpha1,'+source2.uuid+'_output * '+_self.uuid+'_alpha2, '+_self.uuid+'_blendmode );\n  /* custom_main */')
  }

  _self.update = function() {
  }

  _self.render = function() {
    return pod
  }

  // ---------------------------------------------------------------------------
  // HELPERS

  // you shouldnt be able to set these directly
  _self.alpha1 = function() { return alpha1 }
  _self.alpha2 = function() { return alpha2 }

  /**
   * @description total 8; 1: NORMAL (default), 2: HARD, 3: NAM, 4: FAM, 5: LEFT, 6: RIGHT, 7: CENTER, 8: BOOM
   * @function Mixer#mixMode
   * @param {number} Number of the mixmode
   */
  _self.mixMode = function( _num ) {
    if ( _num != undefined ) { mixmode = _num }
    return mixmode
  }

  /**
   * @description total of 18: 1 ADD (default), 2 SUBSTRACT, 3 MULTIPLY, 4 DARKEN, 5 COLOUR BURN, 6 LINEAR_BURN, 7 LIGHTEN,  8 SCREEN, 9 COLOUR_DODGE, 10 LINEAR_DODGE,11 OVERLAY, 12 SOFT_LIGHT, 13 HARD_LIGHT, 14 VIVID_LIGHT, 15 LINEAR_LIGHT,16 PIN_LIGHT, 17 DIFFERENCE, 18 EXCLUSION
   * @function Mixer#blendMode
   * @param {number} Number of the blendMode
   */
  _self.blendMode = function( _num ) {
    if ( _num != undefined ) {
      blendmode = _num
      renderer.customUniforms[_self.uuid+'_blendmode'].value = blendmode
    }
    return blendmode
  }

  /**
   * @description the position of the handle, fader or pod. 0 is left, 1 is right
   * @function Mixer#pod
   * @param {float} position of the handle, between 0 and 1
   */
  _self.pod = function( _num ) {
    if ( _num != undefined ) {

      // set pod position
      pod = _num

      // evaluate current mix style
      // normal mix
      if (mixmode == 1) {
        alpha1 = pod
        alpha2 = 1 - pod
      }

      // hard mix
      if (mixmode == 2) {
        alpha1 = Math.round( pod )
        alpha2 = Math.round( 1-pod )
      }

      // NAM mix
      if (mixmode == 3) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
        if ( alpha1 > 1 ) alpha1 = 1;
        if ( alpha2 > 1 ) alpha2 = 1;
      }

      // FAM mix
      if (mixmode == 4) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
      }

      // Non Dark mix
      if (mixmode == 5) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
        if ( alpha1 > 1 ) alpha1 = 1;
        if ( alpha2 > 1 ) alpha2 = 1;
        alpha1 += 0.36;
        alpha2 += 0.36;
      }

      // left
      if (mixmode == 6) {
        alpha1 = 1;
        alpha2 = 0;
      }

      // right
      if (mixmode == 7) {
        alpha1 = 0;
        alpha2 = 1;
      }

      // center
      if (mixmode == 8) {
        alpha1 = 0.5;
        alpha2 = 0.5;
      }

      // BOOM
      if (mixmode == 9) {
        alpha1 = 1;
        alpha2 = 1;
      }

      // send alphas to the shader
      renderer.customUniforms[_self.uuid+'_alpha1'].value = alpha1;
      renderer.customUniforms[_self.uuid+'_alpha2'].value = alpha2;
    }
    return pod;
  }
}

function Output(renderer, _source ) {

  // create and instance
  var _self = this;

  // set or get uid
  _self.uuid = "Output_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Module"
  
  // add to renderer
  renderer.add(_self)

  // add source
  var source = _source

  _self.init = function() {
    // renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'final_output = '+ source.uuid +'_output;\n  /* custom_main */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\n  gl_FragColor = vec4( '+ source.uuid +'_output, 1.0 );\n')
  }

  _self.update = function() {}
}

function Switcher(renderer, _sources ) {

  // create and instance
  var _self = this;
  _self.sources = _sources // array

  // set or get uid
  _self.uuid = "Switcher_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Module"

  // add to renderer
  renderer.add(_self)

  // add source

  _self.active_source = 0

  _self.init = function() {

    renderer.customUniforms[_self.uuid+'_active_source'] = { type: "i", value: 1 }

    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_active_source;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')

    // we actually need this for each instance itt. the Mixer
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_helpers */','\
\nvec3 get_source_'+_self.uuid+' ( int active_source, vec3 src1, vec3 src2 ) {\
\n  if ( active_source ==  0 ) return src1;\
\n  if ( active_source ==  1 ) return src2;\
\n}'
);

    // TODO: add a foreach to allow infinite number of sources

    // renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'final_output = '+ source.uuid +'_output;\n  /* custom_main */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = get_source_'+_self.uuid+'('+_self.uuid+'_active_source, '+_sources[0].uuid +'_output, '+_sources[1].uuid +'_output );\n  /* custom_main */')

    // TODO: add a foreach to allow infinite number of sources

  }



  _self.update = function() {}
  _self.render = function() {
    return _self.sources[ _self.active_source ]
  }

  _self.doSwitch = function( _num ) {
    if ( _num == undefined ) {
      if (_self.active_source == 0) {
        _self.active_source = 1
      }else{
        _self.active_source = 0
      }
    }else{
      if ( _num != 0 && _num != 1) {
        console.log( _self.uuid, _num, "not allowed")
      }else{
        _self.active_source = _num
      }
    }
    renderer.customUniforms[_self.uuid+'_active_source'] = { type: "i", value: _self.active_source }
    return _self.active_source

    // TODO: add a foreach to allow infinite number of sources
  }
}



GifSource.prototype = new Source(); // assign prototype to marqer
GifSource.constructor = GifSource;  // re-assign constructor

/**
 * @implements Source
 * @constructor Source#GifSource
 * @param {GlRenderer} renderer - GlRenderer object
 * @param {Object} options - JSON Object
 */
function GifSource( renderer, options ) {

  // create and instance
  var _self = this;
  if ( options.uuid == undefined ) {
    _self.uuid = "GifSource_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  var _self = this;
  _self.type = "GifSource"

  // allow bypass
  _self.bypass = true;

  // add to renderer
  renderer.add(_self)

  // set options
  var _options;
  if ( options != undefined ) _options = options;

  // create elements (private)
  var canvasElement, gifElement, canvasElementContext, gifTexture, supergifelement; // wrapperElemen

  var alpha = 1;

  _self.init = function() {

    canvasElement = document.createElement('canvas');
    canvasElement.width = 1024;
    canvasElement.height = 1024;
    canvasElementContext = canvasElement.getContext( '2d' );

    gifTexture = new THREE.Texture( canvasElement );


    // set the uniforms on the renderer
    renderer.customUniforms[_self.uuid] = { type: "t", value: gifTexture }
    renderer.customUniforms[_self.uuid+'_alpha'] = { type: "f", value: alpha }

    // add uniforms to shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D '+_self.uuid+';\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_output;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha;\n/* custom_uniforms */')

    // add output to main function
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec3 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv ).xyz * '+_self.uuid+'_alpha );\n  /* custom_main */')

    // expose gif and canvas
    _self.gif = supergifelement
    _self.canvas = canvasElement

    // actual gif stuff
    window.image_source = new Image()

    //$('body').append("<div id='gif_"+_self.uuid+"' rel:auto_play='1'></div>");
    gifElement = document.createElement('div')
    gifElement.setAttribute('id', 'gif_'+_self.uuid)
    gifElement.setAttribute('rel:auto_play', '1')
    supergifelement = new SuperGif( { gif: gifElement, c_w: "1024px", c_h: "576px" } );
    // sup1.load();
    console.log(_self.uuid, " Load...")
    supergifelement.load_url("http://nabu.sense-studios.com/assets/nabu_themes/sense/slowclap.gif")
    _self.bypass = false
  }

  _self.update = function() {

    // FIXME: something evil happened here.
    //if (_self.bypass == false) return
    try {
      canvasElementContext.clearRect(0, 0, 1024, 1024);
      canvasElementContext.drawImage( supergifelement.get_canvas(), 0, 0, 1024, 1024  );
      if ( gifTexture ) gifTexture.needsUpdate = true;
    }catch(e){
      // not yet
    }
  }

  _self.render = function() {
    return gifTexture
  }


  // Interface -----------------------------------------------------------------

  // Helpers
  _self.src = function( _file ) {
    gifElement = document.createElement('div')
    gifElement.setAttribute('id', 'gif_'+_self.uuid)
    gifElement.setAttribute('rel:auto_play', '1')
    supergifelement = new SuperGif( { gif: gifElement, c_w: "1024px", c_h: "576px" } );
    supergifelement.load_url(_file)
  }

  _self.play =         function() { return supergifelement.play() }
  _self.pause =        function() { return supergifelement.pause() }
  _self.paused =       function() { return !supergifelement.get_playing() }
  _self.currentFrame = function( _num ) {
    if ( _num === undefined ) {
      return supergifelement.get_current_frame();
    } else {
      supergifelement.move_to(_num);
      return _num;
    }

  }  // seconds
  _self.duration =     function() { return supergifelement.get_length() }        // seconds
};


SVGSource.prototype = new Source(); // assign prototype to marqer
SVGSource.constructor = SVGSource;  // re-assign constructor

// TODO
// hook Lottie up

function SVGSource(renderer, options) {}

//function SolidSource
// https://github.com/mrdoob/three.js/wiki/Uniforms-types

SolidSource.prototype = new Source(); // assign prototype to marqer
SolidSource.constructor = SolidSource;  // re-assign constructor

/**
 * @implements Source
 * @constructor Source#SolidSource
 * @example var red = new SolidSource( renderer, { color: { r: 1.0, g: 0.0, b: 0.0 } } );
 * @param {GlRenderer} renderer - GlRenderer object
 * @param {Object} options - JSON Object
 */

function SolidSource(renderer, options) {
  // vec3( 1.0, 0.0, 0.0 )

  var _self = this;
  if ( options.uuid == undefined ) {
    _self.uuid = "SolidSource_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  // no updates
  _self.bypass = true;

  // add to renderer
  renderer.add(_self)

  // set options
  var _options;
  var color = { r:0.0, g:0.0, b:0.0 } // add alpha

  if ( options != undefined ) _options = options;

  _self.init = function() {
    console.log("init solid", _options)
    if (_options.color != undefined) color = _options.color

    // add uniforms
    renderer.customUniforms[_self.uuid + "_color"] = { type: "v3", value: new THREE.Vector3( color.r, color.g, color.b ) }

    // ad variables to shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_color;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_output;\n/* custom_uniforms */')

    // add output to shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec3 '+_self.uuid+'_output = '+_self.uuid+'_color;\n  /* custom_main */')
  }

  _self.update = function() {}
  _self.render = function() { return color; }

  // ---------------------------------------------------------------------------
  // Helpers
  /**
  * @implements Source
  * @function Source#SolidSource#color
  * @example red.color( { r: 0.0, g: 0.0, b: 1.0 } );
  * @param {float} r - red value
  * @param {float} g - green value
  * @param {float} b - blue value
  * @returns color
  */
  _self.color = function( c ) {
    if ( c != undefined ) {
      color = c
      renderer.customUniforms[_self.uuid + "_color"] = { type: "v3", value: new THREE.Vector3( color.r, color.g, color.b ) }
    }
    return color
  }
}


  // create and instance


TextSource.prototype = new Source(); // assign prototype to marqer
TextSource.constructor = TextSource;  // re-assign constructor

  // TODO: implement these as arrays ?
  // This is new, but better
  // var videos =        [];   // video1, video2, video3, ...
  // var divTextures = [];   // divTexture1, divTextures,  ...
  // var bufferImages =  [];   // bufferImage1, bufferImage2, ...

function TextSource(renderer, options) {

  // create and instance
  var _self = this;

  if ( options.uuid == undefined ) {
    _self.uuid = "TextSource_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  _self.type = "TextSource"

  // allow bypass
  _self.bypass = true;

  // add to renderer
  renderer.add(_self)

  // set options
  var _options;
  if ( options != undefined ) _options = options;

  // create elements (private)
  var canvasElement, divElement, canvasElementContext, divTexture; // wrapperElemen
  var alpha = 1;

  // initialize
  _self.init = function() {

    console.log("init text source", _self.uuid)

    // create video element
    divElement = document.createElement('DIV');
    divElement.innerHTML = "<h1> Awaiting text </h1>"
    //divElement.setAttribute("crossorigin","anonymous")
    //divElement.muted= true

    // set the source
    //if ( options.src == undefined ) {
    //  divElement.src = "//nabu-dev.s3.amazonaws.com/uploads/video/567498216465766873000000/720p_h264.mp4";
    //} else {
    //  divElement.src = options.src
    //}
    // console.log('created div element: ', divElement )

    // set properties
    divElement.height = 1024
    divElement.width = 1024
    //divElement.loop = true          // must call after setting/changing source
    //divElement.load();              // must call after setting/changing source
    _self.firstplay = false

    //var playInterval = setInterval( function() {
    //  if ( divElement.readyState == 4 ) {
    //    var r = Math.random() * divElement.duration
    //    divElement.currentTime = r
    //    divElement.play();
    //    _self.firstplay = true
    //    console.log(_self.uuid, "First Play; ", r)
    //    clearInterval(playInterval)
    //  }
    //}, 400 )

    // firstload for mobile
    //$("body").click(function() {
    //  divElement.play();
    //  _self.firstplay = true
    //});

    //divElement.volume = 0;
    //divElement.currentTime = Math.random() * 60   // use random in point

    // listen for a timer update (as it is playing)
    // video1.addEventListener('timeupdate', function() {firebase.database().ref('/client_1/video1').child('currentTime').set( video1.currentTime );})
    // video2.currentTime = 20;

    // create canvas
    canvasElement = document.createElement('canvas');
    document.body.appendChild(canvasElement)
    canvasElement.width = 1024;
    canvasElement.height = 1024;
    canvasElementContext = canvasElement.getContext( '2d' );

    // create the divTexture
    divTexture = new THREE.CanvasTexture( canvasElement );
    // divTexture.minFilter = THREE.LinearFilter;

    // -------------------------------------------------------------------------
    // Set shader params
    // -------------------------------------------------------------------------

    // set the uniforms
    renderer.customUniforms[_self.uuid] = { type: "t", value: divTexture }
    renderer.customUniforms[_self.uuid+'_alpha'] = { type: "f", value: alpha }

    // add uniform
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D '+_self.uuid+';\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_output;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha;\n/* custom_uniforms */')

    // add main
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec3 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv ).xyz * '+_self.uuid+'_alpha );\n  /* custom_main */')

    // expose video and canvas
    _self.divElement = divElement
    _self.canvas = canvasElement

    // remove the bypass
    _self.bypass = false
  }

  // this should be set externally, of course
  var text = null; $.get('/texts/fear_is_the_mind_killer.txt', function(d) { text = d })

  // textbehaviour should be loaded externally too
  var text_c = 0
  var current_text = ""
  var current_text_num = 0;
  var next_interval = 12;
  var big_text_y = 600
  var big_text_x = 300
  var title_text_font_size = 64
  var small_text_x = 512
  _self.update = function() {

    title_text_font_size *= 0.990

    if (_self.bypass = false) return
    if ( text == null ) return
    // alert('oi')
    //if ( divElement.readyState === divElement.HAVE_ENOUGH_DATA ) {
    //canvasElementContext.drawImage( divElement, 0, 0, 1024, 1024 );
    canvasElementContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //canvasElementContext.fillStyle="#FF0000";
    //canvasElementContext.fillRect(0,0,canvasElement.width, canvasElement.height);

    canvasElementContext.fillStyle="rgba(60, 60, 60, 0.4)";
    canvasElementContext.font = "604px IMPACT";
    canvasElementContext.textAlign = "center";
    canvasElementContext.fillText( current_text.split(".").join(""), (bpm.render()*10)+big_text_x, big_text_y ); //(bpm.render()*200)+300

    canvasElementContext.fillStyle= "white";
    canvasElementContext.font = title_text_font_size + "px IMPACT";
    canvasElementContext.textAlign = "center";
    canvasElementContext.fillText( current_text.split(".").join(""), small_text_x,460); //(bpm.render()*200)+300

    //console.log( text_c, next_interval, current_text, current_text_num)
    if ( text_c > next_interval ) {
      current_text = text.split(",")[current_text_num]
      next_interval = ( text.split(",")[current_text_num].length * ( bpm.bpm / 72 ) ) + 3 // * bpm.render()

      current_text_num++
      if (current_text_num == text.split(",").length) current_text_num = 0
      text_c = 0

      big_text_y = Math.floor(Math.random()*200) + 600
      big_text_x = Math.floor(Math.random()*200) + 200
      small_text_x = Math.floor(Math.random()*100) + 470
      title_text_font_size = Math.floor(Math.random()*30) + 70
    }
    text_c++

    if ( divTexture ) divTexture.needsUpdate = true;
    //}
  }

  // return the video texture, for direct customUniforms injection (or something)
  _self.render = function() {
    return divTexture
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  /*
  _self.src = function( file ) {
    divElement.src = file
    var playInterval = setInterval( function() {
      if ( divElement.readyState == 4 ) {
        divElement.play();
        console.log(_self.uuid, "First Play.")
        clearInterval(playInterval)
      }
    }, 400 )
  }

  // Or use source.video[...]
  _self.play =         function() { return divElement.play() }
  _self.pause =        function() { return divElement.pause() }
  _self.paused =       function() { return divElement.paused }
  _self.currentTime = function( _num ) {
    if ( _num === undefined ) {
      return divElement.currentTime;
    } else {
      console.log("set time", _num)
      divElement.currentTime = _num;
      return _num;
    }

  }  // seconds
  _self.duration =     function() { return divElement.duration }    // seconds
  */
  // ===========================================================================
  // For now only here, move to _source?
  // ===========================================================================

  _self.alpha = function(a) {
    if (a == undefined) {
      return renderer.customUniforms[_self.uuid+'_alpha'].value
    }else{
      renderer.customUniforms[_self.uuid+'_alpha'].value = a
    }
  }

  // ===========================================================================
  // Rerturn a reference to self
  // ===========================================================================

  // _self.init()
}

VideoSource.prototype = new Source(); // assign prototype to marqer
VideoSource.constructor = VideoSource;  // re-assign constructor

  // TODO: implement these as arrays ?
  // This is new, but better?
  // Or let file manager handle it?
  // var videos =        [];   // video1, video2, video3, ...
  // var videoTextures = [];   // videoTexture1, videoTextures,  ...
  // var bufferImages =  [];   // bufferImage1, bufferImage2, ...

/**
 * @implements Source
 * @constructor Source#VideoSource
 * @example let myVideoSource = new VideoSource( renderer, { src: 'myfile.mp4' } );
 * @param {GlRenderer} renderer - GlRenderer object
 * @param {Object} options - JSON Object
 */
function VideoSource(renderer, options) {

  // create and instance
  var _self = this;

  if ( options.uuid == undefined ) {
    _self.uuid = "VideoSource_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  _self.type = "VideoSource"

  // allow bypass
  _self.bypass = true;

  // add to renderer
  renderer.add(_self)

  // set options
  var _options;
  if ( options != undefined ) _options = options;

  // create elements (private)
  var canvasElement, videoElement, canvasElementContext, videoTexture; // wrapperElemen
  var alpha = 1;

  // initialize
  _self.init = function() {

    console.log("init video source", _self.uuid)

    // create video element
    videoElement = document.createElement('video');
    videoElement.setAttribute("crossorigin","anonymous")
    videoElement.muted= true

    // set the source
    if ( options.src == undefined ) {
      videoElement.src = "//nabu-dev.s3.amazonaws.com/uploads/video/567498216465766873000000/720p_h264.mp4";
    } else {
      videoElement.src = options.src
    }
    console.log('loaded source: ', videoElement.src )

    // set properties
    videoElement.height = 1024
    videoElement.width = 1024
    videoElement.loop = true          // must call after setting/changing source
    videoElement.load();              // must call after setting/changing source
    _self.firstplay = false

    // Here we wait for a user to click and take over
    var playInterval = setInterval( function() {
      if ( videoElement.readyState == 4 ) {
        var r = Math.random() * videoElement.duration
        videoElement.currentTime = r
        videoElement.play();
        _self.firstplay = true
        console.log(_self.uuid, "First Play; ", r)
        clearInterval(playInterval)
      }
    }, 400 )

    // firstload handler for mobile; neest at least 1 user click
    $("body").click(function() {
      videoElement.play();
      _self.firstplay = true
    });

    videoElement.volume = 0;

    // videoElement.currentTime = Math.random() * 60   // use random in point

    // FOR FIREBASE

    // listen for a timer update (as it is playing)
    // video1.addEventListener('timeupdate', function() {firebase.database().ref('/client_1/video1').child('currentTime').set( video1.currentTime );})
    // video2.currentTime = 20;

    // create canvas
    canvasElement = document.createElement('canvas');
    canvasElement.width = 1024;
    canvasElement.height = 1024;
    canvasElementContext = canvasElement.getContext( '2d' );

    // create the videoTexture
    videoTexture = new THREE.Texture( canvasElement );
    // videoTexture.minFilter = THREE.LinearFilter;

    // -------------------------------------------------------------------------
    // Set shader params
    // -------------------------------------------------------------------------

    // set the uniforms
    renderer.customUniforms[_self.uuid] = { type: "t", value: videoTexture }
    renderer.customUniforms[_self.uuid+'_alpha'] = { type: "f", value: alpha }

    // add uniform
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D '+_self.uuid+';\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_output;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha;\n/* custom_uniforms */')

    // add main
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec3 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv ).xyz * '+_self.uuid+'_alpha );\n  /* custom_main */')

    // expose video and canvas
    _self.video = videoElement
    _self.canvas = canvasElement

    // remove the bypass
    _self.bypass = false
  }

  _self.update = function() {
    if (_self.bypass = false) return
    if ( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA ) {
      canvasElementContext.drawImage( videoElement, 0, 0, 1024, 1024 );
      if ( videoTexture ) videoTexture.needsUpdate = true;
    }
  }

  // return the video texture, for direct customUniforms injection (or something)
  _self.render = function() {
    return videoTexture
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  _self.src = function( file ) {
    videoElement.src = file
    var playInterval = setInterval( function() {
      if ( videoElement.readyState == 4 ) {
        videoElement.play();
        console.log(_self.uuid, "First Play.")
        clearInterval(playInterval)
      }
    }, 400 )
  }

  // Or use source.video[...]
  _self.play =         function() { return videoElement.play() }
  _self.pause =        function() { return videoElement.pause() }
  _self.paused =       function() { return videoElement.paused }
  _self.currentTime = function( _num ) {
    if ( _num === undefined ) {
      return videoElement.currentTime;
    } else {
      console.log("set time", _num)
      videoElement.currentTime = _num;
      return _num;
    }

  }

  // seconds
  _self.duration =     function() { return videoElement.duration }    // seconds

  // ===========================================================================
  // For now only here, move to _source?
  // ===========================================================================

  _self.alpha = function(a) {
    if (a == undefined) {
      return renderer.customUniforms[_self.uuid+'_alpha'].value
    }else{
      renderer.customUniforms[_self.uuid+'_alpha'].value = a
    }
  }

  // ===========================================================================
  // Rerturn a reference to self
  // ===========================================================================

  // _self.init()
}

/**
 * @constructor Source
 */

function Source( renderer, options ) {
  var _self = this

  /*
    renderer
  */


  _self.type = "Source"

  // override these

  // program interface
  _self.init =         function() {}
  _self.update =       function() {}
  _self.render =       function() {}
  _self.start =        function() {}

  // control interface
  _self.src =          function( _file ) {} // .gif
  _self.play =         function() {}
  _self.pause =        function() {}
  _self.paused =       function() {}
  _self.currentFrame = function( _num ) {}  // seconds
  _self.duration =     function() {}        // seconds
}

// hackity, jsdocs fails on _ at the beginning
// so here is the source documentation

// program interface

/** Defines the interface for the Sources
 * @constructor Source
 */
