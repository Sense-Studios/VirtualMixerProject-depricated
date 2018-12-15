
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

 /*
    We might try and change THREEJS and move to regl;
    https://github.com/regl-project, http://regl.party/examples => video
    133.6 => ~26kb
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
  _self.vertexShader = `
    varying vec2 vUv;\
    void main() {\
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
      vUv = uv;\
    }
  `

  // base fragment shader
  _self.fragmentShader = `
    uniform sampler2D textureTest;
    uniform float wave;
    /* custom_uniforms */\
    /* custom_helpers */\
    varying vec2 vUv;\
    void main() {\
      /* custom_main */\
    }
  `

  // ---------------------------------------------------------------------------
  /** @function GlRenderer.init */
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
  /** @function GlRenderer.render */
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
    _self.vertexShader = `
      varying vec2 vUv;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        vUv = uv;
      }
    `

  /**
   * The fragment shader
   * @member GlRenderer#fragmentShader
   */
    // base fragment shader
    _self.fragmentShader = `
      uniform sampler2D textureTest;
      ununiform float wave;
      /* custom_uniforms */
      /* custom_helpers */
      varying vec2 vUv;
      void main() {
        /* custom_main */
      }
    `

    _self.nodes = []
  }
}

/**
 * @description
 *   AudioAnalysis returns a floating point between 1 and 0, in sync with a bpm
 *   the BPM is calculated based on an input music stream (mp3 file)
 *
 * @example
 * var mixer1 = new Mixer( renderer, { source1: mySource, source2: myOtherSource })
 * var analysis = new AudioAnalysis( renderer, { audio: 'mymusic.mp3' } );
 * analysis.add( mixer1.pod )
 * @constructor Addon#AudioAnalysis
 * @implements Addon
 * @param {GlRenderer} renderer
 * @param {Object} w. audio audio is a source, like /path/to/mymusic.mp3
 */

function AudioAnalysis( renderer, _options ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Analysis_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Addon"
  _self.audio = ""
  _self.bypass = false

  // main bpm numbers
  _self.bpm = 128
  _self.bpm_float = 128
  _self.mod = 1
  _self.bps = 1
  _self.sec = 0


  _self.options = {
    audio: '/radio/nsb'
  }

  if ( _options != undefined ) {
    _self.options = _options
  }

  // TODO: needs an option override

  // private
  var calibrating = true
  var nodes = []
  var c = 0
  var starttime = (new Date()).getTime()

  // add to renderer
  renderer.add(_self)

  // setup ---------------------------------------------------------------------
  var audio = new Audio()

  /**
   * @description Audio element
   * @member Addon#BPM#audio_src
   * @param {HTMLMediaElement} reference to the virtual media element
   *
   *  HTMLMediaElement AUDIO reference
   *
  */
  _self.audio = audio

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
  console.log("SET AUDIO SRC")
  //audio.setAttribute('crossorigin', 'anonymous');
  // audio.src =  'http://37.220.36.53:7904';
  // audio.src = '/audio/fear_is_the_mind_killer_audio.mp3'
  // audio.src = '/audio/fulke_absurd.mp3'

  audio.src = _self.options.audio  // NSB RADIO --> 'http://37.220.36.53:7904';
  _self.audio_src = _self.options.audio

  // audio.src = '/radio/dunklenacht' // dunklenacht

  // if ( _self.options.audio ) audio.src = _self.options.audio

  // audio.src = '/audio/rage_hard.mp3'
  // audio.src = '/audio/i_own_it.mp3'
  // audio.src = '/audio/100_metronome.mp3'
  // audio.src = '/audio/120_metronome.mp3'
  // audio.src = '/audio/140_metronome.mp3'

  audio.controls = true;
  audio.loop = true;
  audio.autoplay = true;

  // or as argument(settings.passFreq ? settings.passFreq : 350);
  bandpassFilter.type = "lowpass";
  bandpassFilter.frequency.value = 350
  bandpassFilter.Q.value = 1

  analyser.fftSize = 128;

  bufferLength = analyser.frequencyBinCount;

  // firstload for mobile, forces all control to the site on click
  var forceFullscreen = function() {
    console.log("AudioAnalysis is re-intialized after click initialized!", audio.src);
    audio.play();
    document.body.webkitRequestFullScreen()
    document.body.removeEventListener('click', forceFullscreen);
  }

  document.body.addEventListener('click', forceFullscreen)

  _self.disconnectOutput = function() {
    source.disconnect(context.destination);
  }

  _self.connectOutput = function() {
    source.connect(context.destination);
  }


  // main ----------------------------------------------------------------------
  _self.init = function() {
    console.log("init AudioAnalysis Addon.")
    initializeAutoBpm()
  }

  _self.update = function() {
    if ( _self.bypass ) return

    // var tempoData = getTempo(dataSet)
    // getBlackout // TODO
    // getAmbience // TODO

    // update nodes
    if ( !_self.disabled ) {
      nodes.forEach( function( node ) {
        node( _self.render() );
      });
    }

    // set new numbers
    _self.bpm = _self.tempodata_bpm
    c = ((new Date()).getTime() - starttime) / 1000;
    _self.sec = c * Math.PI * (_self.bpm * _self.mod) / 60            // * _self.mod
    _self.bpm_float = ( Math.sin( _self.sec ) + 1 ) / 2               // Math.sin( 128 / 60 )
  }

  _self.render = function() {
    // returns current bpm 'position' as a value between 0 - 1
    return _self.bpm_float
  }

  // add nodes, implicit
  _self.add = function( _func ) {
    nodes.push( _func )
  }

  // actual --------------------------------------------------------------------
  // initialize Audio, used in the first run
  var initializeAudio = new Promise( function( resolve, reject ) {
    source.connect(bandpassFilter);
    bandpassFilter.connect(analyser);

    // COMMENT THIS LINE OUT FOR NO SOUND
    source.connect(context.destination);

    resolve(audio);
    reject(err);
  })

  var initializeAutoBpm = function() {
    initializeAudio.then( function(r) {
      console.log("AudioAnalysis is initialized!", audio.src);
      audio.play();
      console.log("AudioAnalysis start sampling!")
      setInterval( sampler, 1); // as fast as we can, we need those samples !!

    }).catch( function(err){
      console.log("Error: AudioAnalysis ERROR ", err);
    });
  }

  // ANYLISIS STARTS HERE ------------------------------------------------------

  var sampler = function() {
    //if ( !_self.useAutoBpm ) return;
    if ( _self.audio.muted ) return;
    //if ( _self.audio_src != "" && !_self.useMicrophone ) return;
    if ( _self.bypass ) return;
    // if  no src && no mic -- return
    // if ... -- return

    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray)

    // precalculculations, push only the highest value of the frequency range
    var now = Date.now()
    var high = 0
    dataArray.forEach( (d) => { if ( d > high ) high = d })
    dataSet.push( [ now, high ] )

    // keep the set on sampleLength
    if (dataSet.length > sampleLength) dataSet.splice(0, dataSet.length - sampleLength)
    d++

    // SLOWPOKE
    // take a snapshot every 1/10 second and calculate beat
    if ( ( now - start) > 100 ) {

      var tempoData = getTempo(dataSet)

      // Here are some ideas for a more complete analisis range

      // var tempoCounts = tempoData.tempoCounts
      // getBlackout // TODO -- detects blackout, prolonged, relative silence in sets
      // getAmbience // TODO -- detects overal 'business' of the sound, it's ambience

      // drawData(dataSet) // DEPRICATED -- draw the wavelines (for testing)

      // depricated failsafe
      // if (tempoCounts[0] !== undefined) window.bpm = tempoCounts[0].tempo

      // depricated debug window
      // $('#info').html( dataSet.length + "\t " + c * 10 + " samples/s" + "\t peaks: "  + foundpeaks.length + "\tBPM: <strong>"+ Math.round(window.bpm) + " </strong> ("+Math.round(window.bpm2)+") \t\tconfidence: <em>" + window.confidence + " <strong>" + _self.calibrating + "</strong></em>" ) //.+ " -- " + _dataSet[ _dataSet.length - 1 ] )
      // console.log(" AudioAnalysis::AutoBPM: ",  calibrating, tempoData.bpm, d, tempoData.foundpeaks.length, treshold )

      // write the test data globally (needs uiid?)
      _self.tempodata_bpm = tempoData.bpm
      if ( _self.useAutoBPM ) _self.sec = c * Math.PI * (tempoData.bpm * _self.mod) / 60
      start = Date.now()
      d = 0
    }
  }

  // blink on the beat with element with class .blink
  var doBlink = function() {
    if ( document.getElementsByClassName('blink').length == 0 ) return
    if ( audio.paused ) {
      document.getElementsByClassName('blink')[0].style.opacity = 0
    }else{
      if (document.getElementsByClassName('blink')[0].style.opacity == 1) {
        document.getElementsByClassName('blink')[0].style.opacity = 0
      }else{
        document.getElementsByClassName('blink')[0].style.opacity = 1
      }
    }
    setTimeout( doBlink, (60/ (_self.bpm) )*1000 / _self.mod    )
  }
  doBlink()

  // get bpm tempo by analyising audio stream
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


      // DISPLAY, for debugging, requires element with an .info class
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
      if (document.getElementById('info') != null) {
        document.getElementById('info').html = html
      }

    }

    // Callibration feedback (~24 seconids)
    var confidence = "calibrating"
    calibrating = false
    if ( _data[0] === undefined ) {
      calibrating = true
      if ( document.getElementsByClassName('blink').length > 0 ) document.getElementsByClassName('blink')[0].style.backgroundColor = '#999999';
    }else{
      calibrating = false

      // race condition
      if (tempoCounts[0] === undefined  || tempoCounts[1] === undefined ) {
        console.log("holdit")
        return
      }

      var confidence_mod = tempoCounts[0].count - tempoCounts[1].count
      if ( confidence_mod <= 2 ) {
        confidence = "low"
        if ( document.getElementsByClassName('blink').length > 0 ) document.getElementsByClassName('blink')[0].style.backgroundColor = '#990000';
      }else if( confidence_mod > 2 && confidence_mod <= 7) {
        confidence = "average"
        if ( document.getElementsByClassName('blink').length > 0 ) document.getElementsByClassName('blink')[0].style.backgroundColor = '#999900';
      }else if( confidence_mod > 7 ) {
        confidence = "high"
        if ( document.getElementsByClassName('blink').length > 0 ) document.getElementsByClassName('blink')[0].style.backgroundColor = '#CCCCCC';
      }
    }

    // return an object with all the necc. data.
    var tempoData = {
      bpm: tempoCounts[0].tempo,     // suggested bpm
      confidence: confidence,        // String
      calibrating: calibrating,      // ~24 seconds
      treshold: treshold,            // current treshold
      tempoCounts: tempoCounts,      // current tempoCounts
      foundpeaks:  foundpeaks,       // current found peaks
      peaks: peaks                   // all peaks, for display only
    }

    //console.log(tempoData.bpm, tempoData.confidence)

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
}

/**
 * @description
 *   BPM returns a floating point between 1 and 0, in sync with a bpm the BPM is calculated based on a 'tap' function
 *
 * @example
 * var mixer1 = new Mixer( renderer, { source1: mySource, source2: myOtherSource })
 * var bpm = new BPM( renderer );
 * bpm.bpm = 100
 * bpm.add( mixer1.pod )
 * @constructor Addon#BPM
 * @implements Addon
 * @param {GlRenderer} renderer
 * @param {Object} options optional
 */

function BPM( renderer, options ) {

  var _self = this

  _self.function_list = [
    ["AUTO", "method", "toggleAutoBpm"],
    ["MODDOWN", "method", "modDown"],
    ["MODUP", "method", "modUp"],
    ["MOD", "method", "modNum"]
  ]

  // only return the functionlist
  if ( renderer == undefined ) return

  // exposed variables.
  _self.uuid = "BPM_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  window["bpm_" + _self.uuid]
  _self.type = "Addon"

  // set options
  _self.options = {}
  if ( options != undefined ) _self.options = options
  /**
   * @description Beats Per Minute
   * @member Addon#BPM#bpm
   * @param {number} Beats per minute
   *
   *  actual Beats Per Minute
   *
  */
  _self.bpm = 128

  /**
   * @description Tapping beat control
   * @member Addon#BPM#bps
   *
   *  beats per second
   *
  */
  _self.bps = 2.133333         //


  /**
   * @description Second counter
   * @member Addon#BPM#sec
   *
   *  second counter, from which the actual float is calculated
   *
  */
  _self.sec = 0                //

  /**
   * @description
   *  BPM Float, current *position* of the BPM
   *  If the BMP is a Sinus going up and down, the float shows up where it is on the curve
   *  'up' is 1 and down is '0', oscillating.
   * @member Addon#BPM#bpm_float
  */
  _self.bpm_float = 0.46875    // 60 / 128, current float of bpm

  /**
   * @description Tapping beat control
   * @member Addon#BPM#mod
  */
  _self.mod = 1                // 0.25, 0.5, 1, 2, 4, etc.

  /**
   * @description Audio analysis
   * @member Addon#BPM#useAutoBpm#
   * @member Addon#BPM#autoBpmData#
   * @member Addon#BPM#tempodata_bpm#
   * @member Addon#BPM#audio_src
   * @member Addon#BPM#useMicrophone
   */
  _self.useAutoBpm = false      // auto bpm
  _self.tempodata_bpm = 128     // from music
  _self.mute = false
  _self.autoBpmData = {}       // info object for the auto bpm

  _self.audio_src = ""         // audio file or stream (useMicrophone = false)

  // TODO
  _self.useMicrophone = false  // use useMicrophone for autoBPM

  // DEPRICATED
  _self.bypass = false


  // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add( _self )


  // main ----------------------------------------------------------------------
  // init with a tap contoller
  _self.init = function() {
    console.log("init BPM contoller.")

    // initialize autoBPM with an audio object
    // initializeAutoBpm()
  }

  // UPDATE
  var starttime = (new Date()).getTime()
  _self.update = function() {

    if ( _self.bypass ) return
    // rename useAnalyser?
    //if ( _self.useAutoBpm ) {
    //  _self.bpm = _self.tempodata_bpm
    //}

    if ( !_self.disabled ) {
      nodes.forEach( function( node ) {
        node( _self.render() );
      });
    }

    c = ((new Date()).getTime() - starttime) / 1000;
    _self.sec = c * Math.PI * (_self.bpm * _self.mod) / 60            // * _self.mod
    _self.bpm_float = ( Math.sin( _self.sec ) + 1 ) / 2               // Math.sin( 128 / 60 )
  }

  // add nodes, implicit
  _self.add = function( _func ) {
    nodes.push( _func )
  }

  _self.render = function() {
    // returns current bpm 'position' as a value between 0 - 1
    return _self.bpm_float
  }


  // actual --------------------------------------------------------------------
  /**
   * @description double the bpm
   * @function Addon#BPM#modUp
  */
  _self.modUp = function() { _self.mod *= 2; }
  /**
   * @description half the bpm
   * @function Addon#BPM#modDown
  */
  _self.modDown = function() { _self.mod *= .5; }


  _self.modNum = function(_num) {
    console.log("MOD ", _num)
    var oldState = _self.useAutoBpm
    _self.mod = _num;
    _self.useAutoBpm = oldState
  }

  _self.toggleAutoBpm = function( _num ) {
    _self.useAutoBpm  = !_self.useAutoBpm
    console.log("--->", _self.useAutoBpm  )
  }

  _self.turnOff = function() {
    bpm.audio.muted = false
    bpm.useAutoBpm = false
  }

  // ---------------------------------------------------------------------------
  // Tapped beat control
  var last = Number(new Date());
  var bpms = [ 128, 128 ,128 ,128 ,128 ];
  var time = 0;
  var avg = 0;

  /**
   * @description Tapping beat control
   * @function BPM#tap
   */
  _self.tap = function() {
    _self.useAutoBPM = false
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

  console.log("set keypress")
  window.addEventListener('keypress', function(ev) {
    console.log(">>> ", ev.which)
    if ( ev.which == 116 || ev.which == 32    ) {
      _self.tap()
      console.log(_self.bpm)
    }
  })

} // end BPM

/**
 * @summary
 *   Allows for fast switching between a prefefined list of files (or 'sets' )
 *
 * @description
 *   Allows for fast switching between a prefefined list of files (or 'sets' )
 *
 * @example
 * var myFilemanager = new FileManager( VideoSource )
 * myFilemanager.load_set( "myset.json")
 * myFilemanager.change()
 * @constructor Addon#FileManager
 * @implements Addon
 * @param source{Source#VideoSource} a reference to a (video) Source, or Gif source. Source needs to work with files
 */


function FileManager( _source ) {

  var _self = this

  try {
    renderer
  } catch(e) {
    _self.function_list = [ ["CHANGE", "method", "changez"], ["POD", "set","pod"] ]
    return
  }

  _self.uuid = "Filemanager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.defaultQuality = ""
  _self.source = _source
  _self.set = []
  //_self.programs = []
  _self.file
  _self.renderer = renderer // do we even need this ?!!

  _self.load_set = function( _set ) {
    var u = new Utils()
    u.get( _set, function(d) {
      console.log("-->", d)
      _self.set = JSON.parse(d)
    })
  }

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
        if ( p.tags.includes(t) && p.assets != undefined ) {
          if ( p.assets._type == "Video" ) matches.push(p)
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

  _self.load = function( _file ) {
    utils.get( _file, function(d) {
      console.log('got:', JSON.parse(d) )
      _self.set = JSON.parse(d)
    } )
  }

  // load another source from the stack
  _self.change = function( _tag ) {

    if ( _self.set.length != 0 ) {
      var r = _self.set[ Math.floor( Math.random() * _self.set.length ) ];
      console.log("from set:", r )
      _self.setSrc( r )
    }
    return

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

    //var notv = null
    //$.get('/set/notv', function(d) { notv = JSON.parse(d) })

    console.log("SOURCE")
    //var source = notv[ Math.floor( Math.random() * notv.length) ];
    //var source = occupy_chaos[ Math.floor( Math.random() * occupy_chaos.length) ];

    if (_self.set.length > 0) {
      var source = _self.set[ Math.floor( Math.random() * _self.set.length) ];

      //var source = _self.getSrcByQuality( program )
      _self.setSrc( source );
    }


    /*
    if (Math.random() > 0.5 ) {
      _self.getSrcByTags(["awesome"])
    }else{
      _self.getSrcByTags(["runner"])
    }
    */
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

/**
 * @description
 *   GiphyManager
 *
 * @example
 * var gifmanager1 = new Gyphymanager( renderer );
 * gifmanager1.search('vj');
 * gifmanager1.change();
 * @implements Addon
 * @constructor Addon#Gyphymanager
 * @param {GlRenderer} renderer
 * @param {GifSource} source
 */
function GiphyManager( _source ) {

  var _self = this
  _self.uuid = "GiphyManager_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "AddOn"
  _self.source = _source
  _self.file
  _self.programs
  _self.program
  _self.renderer = renderer // do we even need this ?!!

  // set in environment
  var key = "tIovPHdiZhUF3w0UC6ETdEzjYOaFZQFu"

  /**
   * @description same as [search]{@link Addon#Needle#Gyphymanager#search}
   * @function Addon#Gyphymanager#needle
   * @param {string} query - Search term
   */
  _self.needle = function( _needle ) {
    utils.get('http://api.giphy.com/v1/gifs/search?api_key='+key+'&q='+_needle, function(d) {
      _self.programs = d.data
      console.log(" === GIPHY (re)LOADED === ")
    })
  }

   /**
    * @description
    *  loads a set of gif files from giphy based on
    * @function Addon#Gyphymanager#search
    * @param {string} query - Search term
    */
  _self.search = function( _query ) {
    _self.needle( _query );
  }

  // alternate
  _self.setSrc = function( file ) {
    console.log("set source: ", file)
    _self.source.src(file)
  }

  // load another source from the stack
  /**
   * @description
   *  changes the gif file for another one in the collection
   *  loaded by [search()]{@link Addon#Gyphymanager#search}
   * @function Addon#Gyphymanager#change
   */
  _self.change = function() {
    if ( _self.programs.length == 0 ) return "no programs"
    _self.program = _self.programs[ Math.floor( Math.random() * _self.programs.length ) ]
    _self.setSrc( _self.program.images.original.url );
  }

  /**
   * @description
   *  same as [change()]{@link Addon#Gyphymanager#change}
   * @function Addon#Gyphymanager#changez
   */
  _self.changez = function(){
    _self.change()
  }

  // load it up with defaults
  _self.needle("vj")
}

/**
 * @constructor Addon
 * @interface
 */

/*

1 ______________________________________________________________________________
2 ______________________________________________________________________________
3 ______________________________________________________________________________
4 ______________________________________________________________________________
5 ______________________________________________________________________________
6 ______________________________________________________________________________
7 ______________________________________________________________________________
8 ______________________________________________________________________________
9 ______________________________________________________________________________
0 ______________________________________________________________________________





*/


function Behaviour( renderer, options ) {

  // create and instance
  var _self = this;

  // set or get uid
  _self.uuid = "Behaviour" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Behaviour"

  _self.beats = 0
  _self.time = (new Date()).getTime()
  _self.script = {}
  _self.sheets = []
  _self.sheet_index = 0

  // requires a bpm
  _self.bpm = options.bpm

  renderer.add(_self)

  function addTrigger( _obj ) {
    if ( _obj.mod.type == "seconds" ) {
      triggers.push( [_obj, _self.time + _obj.mod.value, null ] )
    }else if ( _obj.mod.type == "beats" ) {
      triggers.push( [_obj, _self.beats + _obj.mod.value ] )
    }else if ( _obj.mod.type == "random-seconds" ) {
      triggers.push( [_obj, _self.time + ( Math.random() * _obj.mod.value), null ] )
    }else if ( _obj.mod.type == "random-beats" ) {
      triggers.push( [_obj, _self.beats + ( Math.random() * _obj.mod.value ) ] )
    }else{

    }
  }

  //function fireTrigger( _obj ) {
  //  obj[trigger.action.method], trigger.action.args, trigger.mod
    // should repeat?
  //}

  triggers = []
  _self.tr = triggers
  old_bpm = 1

  _self.init = function (){}
  _self.update = function(){

    // updat time
    _self.time = (new Date()).getTime()
    // _self.beats = +1 if
    // bps

    // updat beats
    var bpsr = Math.round( bpm.render() * 4 )



    if ( bpsr != old_bpm ) {
      _self.beats += 1
      old_bpm = bpsr
    }
    //if ( bpsr == 0 ) old_bpm = 1

    // checkTriggers()
    //checkSheets()
  }

  // ---------------------------------------------------------------------------
  _self.load = function( _behaviour ) {
    _self.script = _behaviour
    _self.sheets = _behaviour.sheets
    console.log("loaded A BEHAVIOUR", _behaviour.title )

    _behaviour.triggers.forEach( function( trigger, i) {
      addTrigger(trigger)
    });


      //if ( trigger.action.on !== undefined) {
      //  trigger.action.on.forEach( function( obj, i ) {
      //    console.log(" ====> ", obj)
      //    addTrigger( obj )
      //    // filemanager1.changez()
      //  })
      //}

      //if ( trigger.action.with !== undefined ) {
      //  trigger.action.width.forEach( function( _src, i ) {
      //    // init.filemanager1 [trigger.action.method]()
          // mixer.pod = -1 ?

      //    _self.jump( _src )


      //  })
    //  }
    //});
  }

  _self.jump = function( _src ) {
    console.log("how high?", _src )
    _src.video.currentTime = Math.random() * _src.video.duration
  }

  // ---------------------------------------------------------------------------
  var sheet_pointer = 0
  var old_sheet_pointer = 0
  var sheet_index = 0

  _self.checkSheets = function() {
     // _self.beats%_self.sheets[0].length
     var __beats = sheet_pointer%_self.sheets[ sheet_index ].length
    // console.log("check", sheet_pointer,  sheet_pointer%_self.sheets[0].length)
    // if ( old_sheet_pointer != sheet_pointer ) {
      // console.log( "Boem:", __beats, sheet_pointer, "sheets:", _self.sheets[0][sheet_pointer%_self.sheets[0].length] )

      checkBeats(sheet_pointer%_self.sheets[ _self.sheet_index ].length)


      _self.sheets[ _self.sheet_index ][sheet_pointer%_self.sheets[ _self.sheet_index ].length].forEach( function( trigger_pointer ) {


        if ( trigger_pointer[0] != "....." ) {
          console.log(trigger_pointer)
          //console.log( _self.script.composition[ trigger_pointer[0] ] )

          var target = _self.script.composition[ trigger_pointer[0] ].target
          var _functions = _self.script.composition[ trigger_pointer[0] ].functions // BLEND

          var _function = null
          _functions.forEach( function( _func, i ) {
            // var _function = _self.script.composition[ trigger_pointer[0] ].functions // BLEND
            if ( trigger_pointer[1] == _func[0] ) {
              console.log("TRIGGERED", _function = _func[2])
              var _args = trigger_pointer[2]  // BLEND //isnan?
              if ( !isNaN(trigger_pointer[2]) ) {
                  _args = parseFloat(trigger_pointer[2])
              }else{
                  _args = trigger_pointer[2]  // BLEND //isnan?
              }

              target[ _func[2] ](_args);

              console.log(target, _function, _args)

            }
          })
        }

      })
    //}
    sheet_pointer += 1
    setTimeout( _self.checkSheets, ((60/bpm.bpm)*1000)/4 )
  }

  var fireTrigger = function(trigger) {
    if ( trigger[0].action.method !== undefined ) {
      trigger[0].action.on.forEach( function( _obj ) {
        console.log("DO", trigger[0].action.method, "on", _obj.uuid, "args",  trigger[0].action.args )
        //_obj[trigger[0].action.method]( trigger[0].action.args  )
      })
      return true
    }

    if ( trigger[0].action.set !== undefined ) {
      trigger[0].action.on.forEach( function( _obj ) {
        //console.log("SET", trigger[0].action.args, "on", trigger[0].action.set, "at", _obj.uuid )
        _obj[trigger[0].action.set] = trigger[0].action.args
      })
      return true
    }

    if ( trigger[0].action.internal !== undefined ) {
      trigger[0].action.on.forEach( function( _obj ) {
        _self[ trigger[0].action.internal ](_obj)
        //console.log("INTERNAL",  trigger[0].action.args, "on", _obj.uuid )
      })
      return true
    }
  }

  var checkTriggers = function()  {

    var kill = []

    triggers.forEach( function( trigger, i) {

      var had_update = false
      if ( trigger[0].mod.type == "seconds" || trigger[0].mod.type == "random-seconds" ) {
        if ( _self.time > trigger[1] ) {
          //console.log("TRAEDASDASASDADSDAS SECONDS", trigger[0].mod.type  )
          had_update = fireTrigger( trigger )
        }

      }else if ( trigger[0].mod.type == "beats" || trigger[0].mod.type == "random-beats" ) {
        //console.log("-->", trigger, trigger[0].mod.type, trigger[1], _self.beats, ">", trigger[1])
        if (  _self.beats > trigger[1] ) {
          had_update = fireTrigger( trigger )
        }
      }

      if (had_update) {
         if ( trigger[0].mod.repeat == true ) addTrigger( trigger[0] )
         if ( trigger[0].mod.after !== null ) addTrigger( _self.script.triggers[ trigger[0].mod.after ] )
         triggers.splice(i, 1)
      }
    })
  } //

  setTimeout( function() {
    // filemanager1.change()
    // filemanager2.change()
    // filemanager3.change()
    // filemanager4.change()

  }, 12000)


  var changez_mod = 8000
  var jump_mod = 7200
  var scratch_mod = 12000

  //setTimeout(function(){
  //  filemanager1.changez()
  //  filemanager2.changez()
  //  filemanager3.changez()
  //  filemanager4.changez()
  //}, 16000 )

  // this is a hokey pokey controller
  // call this a behaviour?

  /*
  function changez() {
    if (Math.random() > 0.25 ) {
      filemanager1.change();
    }else if (Math.random() > 0.50 ) {
      filemanager2.change();
    }else if (Math.random() > 0.75 ) {
      filemanager3.change();
    }else{
      filemanager4.change();
    }
    var r = Math.floor( Math.random() * changez_mod )
    setTimeout( function() {
      changez()
    }, r )
  };
  */
  //changez()


  /*
  function jumps() {
    var r = Math.floor( Math.random() * jump_mod )
    setTimeout( function() {
      jumps()
    }, r )

    try {
      if (Math.random() > 0.5 ) {
        testSource1.video.currentTime = Math.random() * testSource1.video.duration
        console.log("src 1 jumps")
      }else{
        testSource2.video.currentTime = Math.random() * testSource2.video.duration
        console.log("src 2 jumps")
      }
    }catch(err) {}
  };
  jumps()


  function scratch() {
    var r = Math.floor( Math.random() * scratch_mod )
    setTimeout( function() {
      scratch()
    }, r )

    try {
      var rq = ( Math.random() * 0.6 ) + 0.7
      //var rq = Math.pow( (Math.random() * 0.5), 0.3 )
      if ( Math.random() > 0.5 ) {
        testSource1.video.playbackRate = rq //+ 0.7
        console.log("src 1 scxratches", rq)
      }else{
        testSource2.video.playbackRate = rq //+ 0.7
        console.log("src 1 scxratches", rq)
      }
    }catch(err) { console.log("err:", err)}
  };
  scratch()
  */
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

    // This is just another firebase, but it should be removed from the
    // code and added in a tutorial on firebase.

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

// -------------------------------------------------------------------------- //

// refers to ...
// https://gist.github.com/xangadix/936ae1925ff690f8eb430014ba5bc65e
MidiController.prototype = new Midi();  // assign prototype to marqer
MidiController.constructor = MidiController;  // re-assign constructor

//MidiController.prototype = new Controller();  // assign prototype to marqer
//MidiController.constructor = MidiController;  // re-assign constructor

// based on https://gist.github.com/xangadix/936ae1925ff690f8eb430014ba5bc65e
// ONLY WORKS PARTIALLY WITHOUT HTTPS://
/**
* @description
*  Demo controller MidiController, implements controller and midicontroller
* @implements Controller#Midi
* @constructor Controller#Midi#MidiController
* @example var myMidicontroller = new MidiController( renderer, { sources: [ source1, source2, ... ], bpm: bpm1 } );
* @param {GlRenderer} renderer - GlRenderer object
* @param {Source} Source - a Source instance
* @param {Addon#BPM} bpm - a BPM instance
*/

function MidiController( renderer, options ) {
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

  // Check this image, with all the buttons etc.
  // https://d2r1vs3d9006ap.cloudfront.net/s3_images/1143703/apc_mini_midi.jpg

  // these are the available colors
  var OFF = 0;
  var GREEN = 1;
  var GREEN_BLINK = 2;
  var RED = 3;
  var RED_BLINK = 4;
  var YELLOW = 5;
  var YELLOW_BLINK = 6;

  // needed for the program
  var midi, input, output

  // this is the main keypad
  var midimap = [
  	[ 56, 57, 58, 59, 60, 61, 62, 63 ],
  	[ 48, 49, 50, 51, 52, 53, 54, 55 ],
  	[ 40, 41, 42, 43, 44, 45, 46, 47 ],
  	[ 32, 33, 34, 35, 36, 37, 38, 39 ],
  	[ 24, 25, 26, 27, 28, 29, 30, 31 ],
  	[ 16, 17, 18, 19, 20, 21, 22, 23 ],
  	[  8,  9, 10, 11, 12, 13, 14, 15 ],
  	[  0,  1,  2,  3,  4,  5,  6,  7 ]
  ]

  // these are the rest of the buttons
  var rest = [ 64, 65, 66, 67, 68, 69, 70, 71, 82, 83, 84, 85, 86, 87, 88, 89 ]
  var faders        = [ 0, 0, 0 ,0 , 0 , 0 , 0 , 0 ,0 ] // 0-127
  var faders_opaque = [ 0, 0, 0 ,0 , 0 , 0 , 0 , 0 ,0 ] // 0-1
  var listeners = []

  // request MIDI access
  if (navigator.requestMIDIAccess) {
  	navigator.requestMIDIAccess()
  		.then(success, failure);
  }

  // we have success!
  function success (_midi) {
    console.log("We have midi!09po ")
  	midi = _midi
  	var inputs = midi.inputs.values();
  	var outputs = midi.outputs.values();

  	for (i = inputs.next(); i && !i.done; i = inputs.next()) {
  		input = i.value;
      input.onmidimessage = onMIDIMessage;
  	}

  	for (o = outputs.next(); o && !o.done; o = outputs.next()) {
  		output = o.value;
      initMidi()
  	}
  }

  // everything went wrong.
  function failure () {
  	console.error('No access to your midi devices.');
  }

  function initMidi() {
    // make everything red!
    var commands = []
    midimap.forEach( function( row, i ) {
      row.forEach( function( value, j ) {
        commands.push( 0x90, value, RED_BLINK )
      });
    });

    // switch the rest off, if there is still some led on
    rest.forEach( function( r, i ) {
      commands.push( 0x90, r, OFF )
    });

    // send the comand
    output.send( commands );

    // start the bpm sync
    var bpmonoff = true
    _self.blinkCallBack = function(_on) {
      if (bpmonoff) {
        output.send( [ 0x90, 82, OFF ] )
        bpmonoff = false
      }else{
        output.send( [ 0x90, 82, GREEN ] )
        bpmonoff = true
      }
    }
  }

  // some examples, this is the 'onpress' (and on slider) function
  var doubleclickbuffer = [ 0, 0, 0, 0 ]
  var doubleclickPattern = [ 128, 144, 128, 144 ]
  var doubleclick = false
  function onMIDIMessage(e) {
    //console.log(e.data)

    // Uint8Array(3) [176, 48, 117]
    // [ state, key, value]
    // state
    // 144 = down
    // 112 = up
    // 176 = sliding

    var opaque = false
    if (doubleclick) return
    doubleclickbuffer.unshift([ e.data[0], e.data[1] ])
    doubleclickbuffer.pop()

    if ( doubleclickbuffer.map(function(m) { return m[0] } ).join(",") == doubleclickPattern.join(",") ) {

      console.log("blink1")
      // update event listeners
      listeners.forEach( function( val, i ) {
        // doubleclick
        if ( val.btn == e.data[1] ) {
          val.cb( e.data, true )
        }
      })

      if ( doubleclickbuffer.map( function(m) { return m[1] } ).every( (val, i, arr) => val === arr[0] ) ) {
        doubleclickbuffer = [ 0, 0, 0, 0 ]

        // DO STUFF ON DOUBLECLICK
        output.send( [ 0x90, e.data[1], GREEN_BLINK ] )
        doubleclick = true

        // chain1.setChainLink(e.data[1], faders[e.data[1]]/126)
        faders_opaque[e.data[1]] = 1
        // var source = chain1.getChainLink( e.data[1] )
        // if (source.video) source.video.currentTime = Math.random() * source.video.duration

        setTimeout(function() { doubleclickbuffer = [ 0, 0, 0, 0 ]; doubleclick = false}, 350)
        return
      }
    }

    // update event listeners
    listeners.forEach( function( val, i ) {
      // doubleclick
      if ( val.btn == e.data[1] ) {
        val.cb( e.data, false )
      }
    })

    setTimeout(function() { doubleclickbuffer = [ 0, 0, 0, 0 ]; doubleclick = false }, 350)
    //console.log( doubleclickbuffer )

    if (e.data[1] == 48) {
      //console.log( e.data[2] / 126 )
      //testSource2.video.playbackRate  = e.data[2] / 56
      //console.log(e.data[2])
      //if ( faders_opaque[0] ) chain1.setChainLink (0, e.data[2]/126 )
      faders[0] = e.data[2]
    }

    if (e.data[1] == 49) {
      //testSource3.video.playbackRate  = e.data[2] / 56
      //if ( faders_opaque[1] ) chain1.setChainLink (1, e.data[2]/126 )
      faders[1] = e.data[2]
    }

    if (e.data[1] == 50) {
      //testSource4.video.playbackRate  = e.data[2] / 56.0
      //if ( faders_opaque[2] ) chain1.setChainLink (2, e.data[2]/126 )
      faders[2] = e.data[2]
    }

    if (e.data[1] == 51) {
      //testSource4.video.playbackRate  = e.data[2] / 56.0
      //if ( faders_opaque[3] ) chain1.setChainLink (3, e.data[2]/126 )
      faders[3] = e.data[2]
    }

  	if (e.data[1] == 64) {
  		// switch everything off
  		var commands = []
  		midimap.forEach( function( row, i ) {
  			row.forEach( function( value, j ) {
  				commands.push(0x90, value, OFF)
  			})
  		})

  		rest.forEach( function( r, i ) {
  			commands.push( 0x90, r, OFF )
  		})
  		output.send(commands)

  	}else if (e.data[1] == 65) {
  		// switch the main pads yellow
  		var commands = []
  		midimap.forEach( function( row, i ) {
  			row.forEach( function( value, j ) {
  				commands.push( 0x90, value, YELLOW )
  			})
  		})
      output.send( commands )

  	}else{
  		// press a button, make it green
      if (e.data[0] == 128 ) {
        output.send( [ 0x90, e.data[1], OFF ] );
        //chain1.setChainLink(e.data[1], 0)
        //console.log("toggle chain")
        doubleclick = false
      }

      if (e.data[0] == 144  ) {
        output.send( [ 0x90, e.data[1], GREEN ] );
        //chain1.setChainLink(e.data[1], faders[e.data[1]]/126)
        //console.log("toggle chain", faders[e.data[1]], e.data[1] )
        faders_opaque[e.data[1]] = 0
        doubleclick = false
      }
  	}
  }

  // init with a tap contoller
  _self.init = function() {
    console.log("init MidiController contoller.")
    //window.addEventListener( 'keydown', keyHandler )
  }

  _self.update = function() {}

  _self.addEventListener = function( _num, _callback ) {
    listeners.push({ btn: _num, cb: _callback })
  }

  _self.scheme = function() {}
}

NumpadBpmMixerControl.prototype = new Controller(); // assign prototype to marqer
NumpadBpmMixerControl.constructor = NumpadBpmMixerControl;  // re-assign constructor

/**
* @description
*  Test en demo controller NumpadBpmMixerControl
* @implements Controller
* @constructor Controller#NumpadBpmMixerControl
* @example var numpad = new NumpadBpmMixerControl( renderer, mixer1, bpm );
* @param {GlRenderer} renderer - GlRenderer object
* @param {Module#Mixer} mixer - a Mixer instance
* @param {Addon#BPM} bpm - a BPM instance
*/

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

  //$('body').click( function() { _bpms.forEach( function( b ) { b.tap() } ) } );
  document.body.addEventListener('click', function() { _bpms.forEach( function( b ) { b.tap() } ) } );

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

/**
 * @constructor Controller
 * @interface
 */

function Controller( renderer, options ) {
  var _self = this

  // set options
  var _options;
  if ( options != undefined ) _options = options;

  _self.type = "Controller"
  _self.myLittleControllerVar = "Wakkawakka"

  // program interface
  _self.init =         function() {}
  _self.update =       function() {}
  _self.render =       function() {}
  _self.add =          function() {}
  //_self.start =        function() {}

}



Midi.prototype = new Controller();  // assign prototype to marqer
Midi.constructor = Midi;  // re-assign constructor

/**
 * @implements Controller
 * @constructor Controller#Midi
 * @interface
 */

function Midi() {
  // base

  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Midi_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "MidiControl"
  //_self.controllers = {};
  //_self.bypass = true
  _self.mylittlevar = "boejaka"
  /*

  // Check this image, with all the buttons etc.
  // https://d2r1vs3d9006ap.cloudfront.net/s3_images/1143703/apc_mini_midi.jpg

  // these are the available colors
  var OFF = 0;
  var GREEN = 1;
  var GREEN_BLINK = 2;
  var RED = 3;
  var RED_BLINK = 4;
  var YELLOW = 5;
  var YELLOW_BLINK = 6;

  // needed for the program
  var midi, input, output

  // this is the main keypad
  var midimap = [
  	[ 56, 57, 58, 59, 60, 61, 62, 63 ],
  	[ 48, 49, 50, 51, 52, 53, 54, 55 ],
  	[ 40, 41, 42, 43, 44, 45, 46, 47 ],
  	[ 32, 33, 34, 35, 36, 37, 38, 39 ],
  	[ 24, 25, 26, 27, 28, 29, 30, 31 ],
  	[ 16, 17, 18, 19, 20, 21, 22, 23 ],
  	[  8,  9, 10, 11, 12, 13, 14, 15 ],
  	[  0,  1,  2,  3,  4,  5,  6,  7 ]
  ]

  // these are the rest of the buttons
  var rest = [ 64, 65, 66, 67, 68, 69, 70, 71, 82, 83, 84, 85, 86, 87, 88, 89 ]
  var faders        = [  0, 0, 0 ,0 , 0 , 0 , 0 , 0 ,0 ] // 0-127
  var faders_opaque = [  0, 0, 0 ,0 , 0 , 0 , 0 , 0 ,0 ] // 0-1

  // request MIDI access
  if (navigator.requestMIDIAccess) {
  	navigator.requestMIDIAccess()
  		.then(success, failure);
  }

  // we have success!
  function success (_midi) {
    console.log("We have midi!09po ")
  	midi = _midi
  	var inputs = midi.inputs.values();
  	var outputs = midi.outputs.values();

  	for (i = inputs.next(); i && !i.done; i = inputs.next()) {
  		input = i.value;
      input.onmidimessage = onMIDIMessage;
  	}

  	for (o = outputs.next(); o && !o.done; o = outputs.next()) {
  		output = o.value;
      initMidi()
  	}
  }

  // everything went wrong.
  function failure () {
  	console.error('No access to your midi devices.');
  }

  function initMidi() {
    // make everything red!
    var commands = []
    midimap.forEach( function( row, i ) {
      row.forEach( function( value, j ) {
        commands.push( 0x90, value, RED_BLINK )
      });
    });
  }

  function onMIDIMessage(e) {
    commands.push( 0x90, value, YELLOW )
    output.send( commands )
  }
  */
}

Vidi.prototype = new Controller();  // assign prototype to marqer
Vidi.constructor = Vidi;  // re-assign constructor

/**
 * @implements Controller
 * @constructor Controller#Vidi
 * @interface
 *
 * @description
 *  Yes, The Visual Instrument Digital Interface is here. We're not sure what it does though.
 */

function Vidi() {
  // base

  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Vidi_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "VidiControl"
  //_self.controllers = {};
  //_self.bypass = true
  _self.mylittlevar = "boejaka"

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

/**
 * @summary
 *    A Chain is string of sources, stacked on top of each other
 *
 * @description
 *   Chains together a string of sources, gives them an alpha channel, and allows for switching them on and off with fade effects. Ideal for a piano board or a midicontroller
 *
 * @example let myChain = new Mixer( renderer, { sources: [ myVideoSource, myOtherMixer, yetAnotherSource ] );
 * @constructor Module#Chain
 * @implements Module
 * @param renderer:GlRenderer
 * @param options:Object
 */
function Chain(renderer, options) {

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
  _self.sources = _options.sources

  // add source alpha to custom uniforms
  _self.sources.forEach( function( source, index ) {
    renderer.customUniforms[_self.uuid+'_source'+index+'_'+'alpha'] = { type: "f", value: 0.5 }
  })

  // add source uniforms to fragmentshader
  _self.sources.forEach( function( source, index ) {
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_source'+index+'_'+'alpha;\n/* custom_uniforms */')
  })

  // add chain output and chain alpha to shader
  renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_'+'alpha;\n/* custom_uniforms */')
  renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_output;\n/* custom_uniforms */')

  _self.init = function() {
    // bould output module
    var generatedOutput = "vec3(0.0,0.0,0.0)"
    _self.sources.forEach( function( source, index ) {
      generatedOutput += ' + ('+source.uuid+'_'+'output * '+_self.uuid+'_source'+index+'_'+'alpha )'
    });
    generatedOutput += ";\n"

    // put it in the shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = '+generatedOutput+' \/* custom_main */')

  }

  _self.update = function() {}

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------
  _self.setChainLink = function( _num, _alpha ) {
    renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = _alpha
  }

  _self.getChainLink = function( _num ) {
    return _self.sources( _num )
  }

  _self.toggle = function( _num, _state ) {
    if ( _state !== undefined ) {
      renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = _state
      return;
    }

    if ( renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value == 1 ) {
      renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = 0
    }else{
      renderer.customUniforms[_self.uuid+'_source'+_num+'_'+'alpha'].value = 1
      current = _num
    }
  }
}

/**
 * @summary
 *    A mixer mixes two sources together.
 *
 * @description
 *   It can crossfade the sources with different _MixModes_ and _BlendModes_ requires `source1` and `source2` in `options` both with a {@link Source} (or another _Module_ like a {@link Mixer})
 *
 * @example let myMixer = new Mixer( renderer, { source1: myVideoSource, source2: myOtherMixer });
 * @constructor Module#Mixer
 * @implements Module
 * @param renderer:GlRenderer
 * @param options:Object
 * @author Sense Studios
 */

 // of 18: 1 ADD (default), 2 SUBSTRACT, 3 MULTIPLY, 4 DARKEN, 5 COLOUR BURN,
 // 6 LINEAR_BURN, 7 LIGHTEN,  8 SCREEN, 9 COLOUR_DODGE, 10 LINEAR_DODGE,
 // 11 OVERLAY, 12 SOFT_LIGHT, 13 HARD_LIGHT, 14 VIVID_LIGHT, 15 LINEAR_LIGHT,
 // 16 PIN_LIGHT, 17 DIFFERENCE, 18 EXCLUSION

 // of 8 1: NORMAL, 2: HARD, 3: NAM, 4: FAM, 5: LEFT, 6: RIGHT, 7: CENTER, 8: BOOM


function Mixer( renderer, options ) {

  // create and instance
  var _self = this;
  _self.function_list = [["BLEND", "method","blendMode"], ["MIX", "method","mixMode"], ["POD", "set", "pod"] ]
  if (renderer == undefined) return

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
  _self.type = "Module";

  // add local variables
  var alpha1 = 1;
  var alpha2 = 0;
  var pod = 0;

  var mixmode = 1;
  _self.mixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

  var blendmode = 1;
  _self.blendmodes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 ];

  var source1, source2;
  source1 = options.source1;   // Mandatory
  source2 = options.source2;   // Mandatory


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
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_helpers */',
`
vec3 blend ( vec3 src, vec3 dst, int blendmode ) {
  if ( blendmode ==  1 ) return src + dst;
  if ( blendmode ==  2 ) return src - dst;
  if ( blendmode ==  3 ) return src * dst;
  if ( blendmode ==  4 ) return min(src, dst);
  if ( blendmode ==  5)  return vec3((src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z)));
  if ( blendmode ==  6 ) return (src + dst) - 1.0;
  if ( blendmode ==  7 ) return max(src, dst);
  if ( blendmode ==  8 ) return (src + dst) - (src * dst);
  if ( blendmode ==  9 ) return vec3((src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z)));
  if ( blendmode == 10 ) return src + dst;
  if ( blendmode == 11 ) return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));
  if ( blendmode == 12 ) return vec3((src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z))));
  if ( blendmode == 13 ) return vec3((src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)), (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z)));
  if ( blendmode == 14 ) return vec3((src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z))));
  if ( blendmode == 15 ) return 2.0 * src + dst - 1.0;
  if ( blendmode == 16 ) return vec3((src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), (src.x > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z));
  if ( blendmode == 17 ) return abs(dst - src);
  if ( blendmode == 18 ) return src + dst - 2.0 * src * dst;
  return src + dst;
}
/* custom_helpers */
`
      );
    }

    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = blend( '+source1.uuid+'_output * '+_self.uuid+'_alpha1,'+source2.uuid+'_output * '+_self.uuid+'_alpha2, '+_self.uuid+'_blendmode );\n  /* custom_main */' )
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
   * @description
   *  gets or sets the _mixMode_, there are 8 MixModes available, numbered 1-9;
   *  ```
   *  1: NORMAL (default),
   *  2: HARD,
   *  3: NAM,
   *  4: FAM,
   *  5: NON-DARK,
   *  6: LEFT,
   *  7: RIGHT,
   *  8: CENTER,
   *  9: BOOM
   *  ```
   *
   * @function Module#Mixer#mixMode
   * @param {number} mixmode index of the Mixmode
   */
  _self.mixMode = function( _num ) {
    if ( _num != undefined ) { mixmode = _num }
    return mixmode
  }

  /**
   * @description
   *  gets or sets the _blendMode_, there are 18 Blendmodes available, numbered 1-18;
   *  ```
   *  1 ADD (default),
   *  2 SUBSTRACT,
   *  3 MULTIPLY,
   *  4 DARKEN,
   *  5 COLOUR BURN,
   *  6 LINEAR_BURN,
   *  7 LIGHTEN,
   *  8 SCREEN,
   *  9 COLOUR_DODGE,
   *  10 LINEAR_DODGE,
   *  11 OVERLAY,
   *  12 SOFT_LIGHT,
   *  13 HARD_LIGHT,
   *  14 VIVID_LIGHT,
   *  15 LINEAR_LIGHT,
   *  16 PIN_LIGHT,
   *  17 DIFFERENCE,
   *  18 EXCLUSION
   *  ```
   * @function Module#Mixer#blendMode
   * @param {number} blendmode index of the Blendmode
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
   * @function Module#Mixer#pod
   * @param {float} position - position of the handle
   */
  _self.pod = function( _num ) {
    //console.log("---> POD:", _num)
    if ( _num != undefined ) {

      // set pod position
      pod = _num

      // evaluate current mix style
      // 1 normal mix
      if (mixmode == 1) {
        alpha1 = pod
        alpha2 = 1 - pod
      }

      // 2 hard mix
      if (mixmode == 2) {
        alpha1 = Math.round( pod )
        alpha2 = Math.round( 1-pod )
      }

      // 3 NAM mix
      if (mixmode == 3) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
        if ( alpha1 > 1 ) alpha1 = 1;
        if ( alpha2 > 1 ) alpha2 = 1;
      }

      // 4 FAM mix
      if (mixmode == 4) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
      }

      // 5 Non Dark mix
      if (mixmode == 5) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
        if ( alpha1 > 1 ) alpha1 = 1;
        if ( alpha2 > 1 ) alpha2 = 1;
        alpha1 += 0.36;
        alpha2 += 0.36;
      }

      // 6 left
      if (mixmode == 6) {
        alpha1 = 1;
        alpha2 = 0;
      }

      // 7 right
      if (mixmode == 7) {
        alpha1 = 0;
        alpha2 = 1;
      }

      // 8 center
      if (mixmode == 8) {
        alpha1 = 0.5;
        alpha2 = 0.5;
      }

      // 9 BOOM
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

/**
 * @summary
 *   The output node is the mandatory last node of the mixer, it passes it's content directly to the @GlRenderer
 *
 * @description
 *   The output node is the mandatory last node of the mixer, it passes it's content directly to the {@link GlRenderer}
 *
 * @example
 *  let myChain = new output( renderer, source );
 *  renderer.init()
 *  renderer.render()
 * @implements Module
 * @constructor Module#Output
 * @param renderer{GlRenderer} a reference to the GLrenderer
 * @param source{Source} any valid source node
 * @author Sense Studios
 */
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

/**
 * @summary
 *   A switcher selects either one of two sources
 *
 * @description
 *   Switcher
 *
 * @example
 *  let mySwitcher = new Switcher( renderer, [ source1, source2 ]] );
 * @constructor Module#Switcher
 * @implements Module
 * @param renderer{GlRenderer}
 * @param source{Source}
 * @author Sense Studios
 */

function Switcher(renderer, options ) {

  // create and instance
  var _self = this;

  // set or get uid
  _self.uuid = "Switcher_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Module"

  // add to renderer
  renderer.add(_self)

  // add sources, only 2 allowed, build mixers or use a chain
  _self.sources = [ options.source1, options.source2 ]; // array
  _self.active_source = 0

  _self.init = function() {

    console.log("Switcher", _self.uuid, _self.sources)

    renderer.customUniforms[_self.uuid+'_active_source'] = { type: "i", value: 1 }

    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_active_source;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')

    // we actually need this for each instance itt. the Mixer
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_helpers */',`
vec3 get_source_`+_self.uuid+` ( int active_source, vec3 src1, vec3 src2 ) {
  if ( active_source ==  0 ) return src1;\
  if ( active_source ==  1 ) return src2;\
}`
    );

    // renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'final_output = '+ source.uuid +'_output;\n  /* custom_main */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec3 '+_self.uuid+'_output = get_source_'+_self.uuid+'('+_self.uuid+'_active_source, '+_self.sources[0].uuid +'_output, '+_self.sources[1].uuid +'_output );\n  /* custom_main */')
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
  }
}

/**
 * @constructor Module
 * @interface
 */

 function Module( renderer, options ) {
   var _self = this

   /*
     renderer
   */

   _self.type = "Module"

   // program interface
   _self.init =         function() {}
   _self.update =       function() {}
   _self.render =       function() {}
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

  // set the source
  if ( options.src == undefined ) {
     _self.currentSrc = '/gif/a443ae90a963a657e12737c466ddff95.gif'
  } else {
    _self.currentSrc = options.src
  }


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
    gifElement = document.createElement('img')
    gifElement.setAttribute('id', 'gif_'+_self.uuid)
    gifElement.setAttribute('rel:auto_play', '1')
    supergifelement = new SuperGif( { gif: gifElement, c_w: "1024px", c_h: "576px" } );
    supergifelement.draw_while_loading = true

    // sup1.load();
    console.log(_self.uuid, " Load", _self.currentSrc, "..." )
    //supergifelement.load_url( _self.currentSrc )
    supergifelement.load_url( _self.currentSrc, function() { console.log("play gif"); supergifelement.play(); } )
    console.log('Gifsource Loaded First source!', _self.currentSrc, "!")
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
    _self.currentSrc = _file
    supergifelement.pause()
    supergifelement.load_url( _file, function() { console.log("play gif"); supergifelement.play(); } )
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

MultiVideoSource.prototype = new Source(); // assign prototype to marqer
MultiVideoSource.constructor = MultiVideoSource;  // re-assign constructor

  // TODO: implement these as arrays !
  // This is new, but better?
  // Or let file manager handle it?
  // var videos =        [];   // video1, video2, video3, ...
  // var videoTextures = [];   // videoTexture1, videoTextures,  ...
  // var bufferImages =  [];   // bufferImage1, bufferImage2, ...

/**
 * @description
 *  The MultiVideoSource allows for playback of video files in the Mixer project.
 *  It is very similar to the regular videosource, however it used multiple references to the videofile.
 *  In doing so it allows for very fast jumping through the video even when it is loading from a remote server.
 *  The main features are random jumping and a cue list, allowing for smart referincing in video files.
 *
 * @implements Source
 * @constructor Source#MultiVideoSource
 * @example let myMultiVideoSource = new MultiVideoSource( renderer, { src: 'myfile.mp4', cues: [ 0, 10, 20, 30 ] } );
 * @param {GlRenderer} renderer - GlRenderer object
 * @param {Object} options - JSON Object, with src (file path) and cues, cuepoints in seconds
 */

function MultiVideoSource(renderer, options) {

  // create and instance
  var _self = this;

  if ( options.uuid == undefined ) {
    _self.uuid = "MultiVideoSource_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  _self.type = "MultiVideoSource"
  _self.bypass = true;
  renderer.add(_self)

  var _options;
  if ( options != undefined ) _options = options;
  var canvasElement, canvasElementContext, videoTexture;
  var videoElements = []; // maybe as array?
  var currentVideo = null // the curret video

  var alpha = 1;

  // initialize
  _self.init = function() {

    // FIXME: Can we clean this up and split into several functions

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
    // especially for mobile
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
    document.body.addEventListener('click', function() {
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
    /**
     * @description exposes the HTMLMediaElement Video for listeners and control
     * @member Source#MultiVideoSource#video
     */
    _self.video = videoElement
    _self.canvas = canvasElement

    // remove the bypass
    _self.bypass = false
  }

  _self.update = function() {
    if (_self.bypass = false) return
    if ( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA && !videoElement.seeking) {
      canvasElementContext.drawImage( videoElement, 0, 0, 1024, 1024 );
      if ( videoTexture ) videoTexture.needsUpdate = true;
    }else{
      // canvasElementContext.drawImage( videoElement, 0, 0, 1024, 1024 );
      // console.log("SEND IN BLACK!")
      canvasElementContext.clearRect(0, 0, 1024, 1024);
      _self.alpha = 0
    }
  }

  // return the video texture, for direct customUniforms injection (or something)
  _self.render = function() {
    return videoTexture
  }

  // ===========================================================================
  // Actual HELPERS
  // ===========================================================================

  /**
   * @description
   *  gets or sets source @file for the MultiVideoSource
   *  file has to be compatible with HTMLMediaElement Video ie. webm, mp4 etc.
   *  We recommend **mp4**
   *
   * @function Source#MultiVideoSource#src
   * @param {file} Videofile - full path to file
   */
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

  /**
   * @description start the current video
   * @function Source#MultiVideoSource#play
   */
  _self.play =         function() { return videoElement.play() }

  /**
   * @description pauses the video
   * @function Source#MultiVideoSource#pause
   */
  _self.pause =        function() { return videoElement.pause() }

  /**
   * @description returns true then the video is paused. False otherwise
   * @function Source#MultiVideoSource#paused
   */
  _self.paused =       function() { return videoElement.paused }

  /**
   * @description skip to _time_ (in seconds) or gets `currentTime` in seconds
   * @function Source#MultiVideoSource#currentTime
   * @param {float} time - time in seconds
   */
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
  /**
   * @description give the duration of the video in seconds (cannot be changed)
   * @function Source#MultiVideoSource#duration
   */
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

  _self.jump = function( _num) {
    if ( _num == undefined || isNaN(_num) ) {
      try {
        videoElement.currentTime = Math.floor( ( Math.random() * _self.duration() ) )
      }catch(e){
        console.log("prevented a race error")
      }
    } else {
      videoElement.currentTime = _num
    }

    return videoElement.currentTime
  }

  // ===========================================================================
  // Rerturn a reference to self
  // ===========================================================================

  // _self.init()
}


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

  _self.jump = function( _num ) {
    console.log("no")
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
  var text = null; utils.get('/texts/fear_is_the_mind_killer.txt', function(d) { text = d; console.log("get text", d) })

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

/**
 * @description
 *  The videosource allows for playback of video files in the Mixer project
 *
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

  _self.currentSrc = "//nabu-dev.s3.amazonaws.com/uploads/video/567498216465766873000000/720p_h264.mp4"

  // create elements (private)
  var canvasElement, videoElement, canvasElementContext, videoTexture; // wrapperElemen
  var alpha = 1;

  // initialize
  _self.init = function() {

    // FIXME: Can we clean this up and split into several functions

    console.log("init video source", _self.uuid)

    // create video element
    videoElement = document.createElement('video');
    videoElement.setAttribute("crossorigin","anonymous")
    videoElement.muted= true

    // set the source
    if ( options.src == undefined ) {
      videoElement.src = _self.currentSrc;
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
    document.body.addEventListener('click', function() {
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
    /**
     * @description exposes the HTMLMediaElement Video for listeners and control
     * @member Source#VideoSource#video
     */
    _self.video = videoElement
    _self.canvas = canvasElement

    // remove the bypass
    _self.bypass = false
  }

  _self.update = function() {
    if (_self.bypass = false) return
    if ( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA && !videoElement.seeking) {
      canvasElementContext.drawImage( videoElement, 0, 0, 1024, 1024 );
      if ( videoTexture ) videoTexture.needsUpdate = true;
    }else{
      // canvasElementContext.drawImage( videoElement, 0, 0, 1024, 1024 );
      // console.log("SEND IN BLACK!")
      canvasElementContext.clearRect(0, 0, 1024, 1024);
      _self.alpha = 0
    }
  }

  // return the video texture, for direct customUniforms injection (or something)
  _self.render = function() {
    return videoTexture
  }

  // ===========================================================================
  // Actual HELPERS
  // ===========================================================================

  /**
   * @description
   *  gets or sets source @file for the videosource
   *  file has to be compatible with HTMLMediaElement Video ie. webm, mp4 etc.
   *  We recommend **mp4**
   *
   * @function Source#VideoSource#src
   * @param {file} Videofile - full path to file
   */
  _self.src = function( _file ) {
    _self.currentSrc = _file
    videoElement.src = _file
    var playInterval = setInterval( function() {
      if ( videoElement.readyState == 4 ) {
        videoElement.play();
        console.log(_self.uuid, "First Play.")
        clearInterval(playInterval)
      }
    }, 400 )
  }

  /**
   * @description start the current video
   * @function Source#VideoSource#play
   */
  _self.play =         function() { return videoElement.play() }

  /**
   * @description pauses the video
   * @function Source#VideoSource#pause
   */
  _self.pause =        function() { return videoElement.pause() }

  /**
   * @description returns true then the video is paused. False otherwise
   * @function Source#VideoSource#paused
   */
  _self.paused =       function() { return videoElement.paused }

  /**
   * @description skip to _time_ (in seconds) or gets `currentTime` in seconds
   * @function Source#VideoSource#currentTime
   * @param {float} time - time in seconds
   */
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
  /**
   * @description give the duration of the video in seconds (cannot be changed)
   * @function Source#VideoSource#duration
   */
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

  _self.jump = function( _num) {
    if ( _num == undefined || isNaN(_num) ) {
      try {
        videoElement.currentTime = Math.floor( ( Math.random() * _self.duration() ) )
      }catch(e){
        console.log("prevented a race error")
      }
    } else {
      videoElement.currentTime = _num
    }

    return videoElement.currentTime
  }

  // ===========================================================================
  // Rerturn a reference to self
  // ===========================================================================

  // _self.init()
}

WebcamSource.prototype = new Source(); // assign prototype to marqer
WebcamSource.constructor = WebcamSource;  // re-assign constructor

/**
 * @description
 *  The WebcamSource allows for playback of video files in the Mixer project
 *
 * @implements Source
 * @constructor Source#WebcamSource
 * @example let myWebcamSource = new WebcamSource( renderer, { src: 'myfile.mp4' } );
 * @param {GlRenderer} renderer - GlRenderer object
 * @param {Object} options - JSON Object
 */
function WebcamSource(renderer, options) {

  // create and instance
  var _self = this;

  if ( options.uuid == undefined ) {
    _self.uuid = "WebcamSource_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = options.uuid
  }

  _self.type = "WebcamSource"

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

    // FIXME: Can we clean this up and split into several functions
    console.log("init video source", _self.uuid)

    // create video element
    videoElement = document.createElement('video');
    videoElement.setAttribute("crossorigin","anonymous")
    //videoElement.muted = true

    // set properties
    videoElement.height = 1024
    videoElement.width = 1024
    videoElement.loop = true          // must call after setting/changing source
    videoElement.load();              // must call after setting/changing source
    _self.firstplay = false

    // here is the getUserMediaMagic, note that it only works in HTTPS
    // Prefer camera resolution nearest to 1280x720.
    var constraints = { audio: false, video: { width: 1024, height: 1024 } };

    //
    // Call the webcam, NOTE: you MUST run on HTTPS for this.
    // or make an exception
    //

    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
      //var video = document.querySelector('video');
      videoElement.srcObject = mediaStream;
      videoElement.onloadedmetadata = function(e) {
        videoElement.play();
      };
    })
    .catch(function(err) { console.log(err.name + ": " + err.message); }); // always check for errors at the end.

    //ocument.body.appendChild(newChild)

    // Here we wait for a user to click and take over
    var playInterval = setInterval( function() {
      if ( videoElement.readyState == 4 ) {
        var r = Math.random() * videoElement.duration
        //videoElement.currentTime = r
        videoElement.play();
        _self.firstplay = true
        console.log(_self.uuid, "First Play; ", r)
        clearInterval(playInterval)
      }
    }, 400 )

    // firstload handler for mobile; neest at least 1 user click
    document.body.addEventListener('click', function() {
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
    /**
     * @description exposes the HTMLMediaElement Video for listeners and control
     * @member Source#WebcamSource#video
     */
    _self.video = videoElement
    _self.canvas = canvasElement

    // remove the bypass
    _self.bypass = false
  }

  _self.update = function() {
    if (_self.bypass = false) return
    if ( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA && !videoElement.seeking) {
      canvasElementContext.drawImage( videoElement, 0, 0, 1024, 1024 );
      if ( videoTexture ) videoTexture.needsUpdate = true;
    }else{
      // canvasElementContext.drawImage( videoElement, 0, 0, 1024, 1024 );
      // console.log("SEND IN BLACK!")
      canvasElementContext.clearRect(0, 0, 1024, 1024);
      _self.alpha = 0
    }
  }

  // return the video texture, for direct customUniforms injection (or something)
  _self.render = function() {
    return videoTexture
  }

  // ===========================================================================
  // Actual HELPERS
  // ===========================================================================

  /**
   * @description start the current video
   * @function Source#WebcamSource#play
   */
  _self.play =         function() { return videoElement.play() }

  /**
   * @description pauses the video
   * @function Source#WebcamSource#pause
   */
  _self.pause =        function() { return videoElement.pause() }

  /**
   * @description returns true then the video is paused. False otherwise
   * @function Source#WebcamSource#paused
   */
  _self.paused =       function() { return videoElement.paused }

  /**
   * @description skip to _time_ (in seconds) or gets `currentTime` in seconds
   * @function Source#WebcamSource#currentTime
   * @param {float} time - time in seconds
   */
   /*
  _self.currentTime = function( _num ) {
    returns false
    if ( _num === undefined ) {
      return videoElement.currentTime;
    } else {
      console.log("set time", _num)
      videoElement.currentTime = _num;
      return _num;
    }

  }
  */

  // seconds
  /**
   * @description give the duration of the video in seconds (cannot be changed)
   * @function Source#WebcamSource#duration
   */
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
 * @interface
 */

function Source( renderer, options ) {
  var _self = this

  /*
    renderer
  */


  _self.type = "Source"
  _self.function_list = [["JUMP","method","jump"]]
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

  _self.jump =         function() {}
  //_self.cue =          function() {}
}

/*
	SuperGif

	Example usage:

		<img src="./example1_preview.gif" rel:animated_src="./example1.gif" width="360" height="360" rel:auto_play="1" />

		<script type="text/javascript">
			$$('img').each(function (img_tag) {
				if (/.*\.gif/.test(img_tag.src)) {
					var rub = new SuperGif({ gif: img_tag } );
					rub.load();
				}
			});
		</script>

	Image tag attributes:

		rel:animated_src -	If this url is specified, it's loaded into the player instead of src.
							This allows a preview frame to be shown until animated gif data is streamed into the canvas

		rel:auto_play -		Defaults to 1 if not specified. If set to zero, a call to the play() method is needed

	Constructor options args

		gif 				Required. The DOM element of an img tag.
		loop_mode			Optional. Setting this to false will force disable looping of the gif.
		auto_play 			Optional. Same as the rel:auto_play attribute above, this arg overrides the img tag info.
		max_width			Optional. Scale images over max_width down to max_width. Helpful with mobile.
 		on_end				Optional. Add a callback for when the gif reaches the end of a single loop (one iteration). The first argument passed will be the gif HTMLElement.
		loop_delay			Optional. The amount of time to pause (in ms) after each single loop (iteration).
		draw_while_loading	Optional. Determines whether the gif will be drawn to the canvas whilst it is loaded.
		show_progress_bar	Optional. Only applies when draw_while_loading is set to true.

	Instance methods

		// loading
		load( callback )		Loads the gif specified by the src or rel:animated_src sttributie of the img tag into a canvas element and then calls callback if one is passed
		load_url( src, callback )	Loads the gif file specified in the src argument into a canvas element and then calls callback if one is passed

		// play controls
		play -				Start playing the gif
		pause -				Stop playing the gif
		move_to(i) -		Move to frame i of the gif
		move_relative(i) -	Move i frames ahead (or behind if i < 0)

		// getters
		get_canvas			The canvas element that the gif is playing in. Handy for assigning event handlers to.
		get_playing			Whether or not the gif is currently playing
		get_loading			Whether or not the gif has finished loading/parsing
		get_auto_play		Whether or not the gif is set to play automatically
		get_length			The number of frames in the gif
		get_current_frame	The index of the currently displayed frame of the gif

		For additional customization (viewport inside iframe) these params may be passed:
		c_w, c_h - width and height of canvas
		vp_t, vp_l, vp_ w, vp_h - top, left, width and height of the viewport

		A bonus: few articles to understand what is going on
			http://enthusiasms.org/post/16976438906
			http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp
			http://humpy77.deviantart.com/journal/Frame-Delay-Times-for-Animated-GIFs-214150546

*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.SuperGif = factory();
    }
}(this, function () {
    // Generic functions
    var bitsToNum = function (ba) {
        return ba.reduce(function (s, n) {
            return s * 2 + n;
        }, 0);
    };

    var byteToBitArr = function (bite) {
        var a = [];
        for (var i = 7; i >= 0; i--) {
            a.push( !! (bite & (1 << i)));
        }
        return a;
    };

    // Stream
    /**
     * @constructor
     */
    // Make compiler happy.
    var Stream = function (data) {
        this.data = data;
        this.len = this.data.length;
        this.pos = 0;

        this.readByte = function () {
            if (this.pos >= this.data.length) {
                throw new Error('Attempted to read past end of stream.');
            }
            if (data instanceof Uint8Array)
                return data[this.pos++];
            else
                return data.charCodeAt(this.pos++) & 0xFF;
        };

        this.readBytes = function (n) {
            var bytes = [];
            for (var i = 0; i < n; i++) {
                bytes.push(this.readByte());
            }
            return bytes;
        };

        this.read = function (n) {
            var s = '';
            for (var i = 0; i < n; i++) {
                s += String.fromCharCode(this.readByte());
            }
            return s;
        };

        this.readUnsigned = function () { // Little-endian.
            var a = this.readBytes(2);
            return (a[1] << 8) + a[0];
        };
    };

    var lzwDecode = function (minCodeSize, data) {
        // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
        var pos = 0; // Maybe this streaming thing should be merged with the Stream?
        var readCode = function (size) {
            var code = 0;
            for (var i = 0; i < size; i++) {
                if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                    code |= 1 << i;
                }
                pos++;
            }
            return code;
        };

        var output = [];

        var clearCode = 1 << minCodeSize;
        var eoiCode = clearCode + 1;

        var codeSize = minCodeSize + 1;

        var dict = [];

        var clear = function () {
            dict = [];
            codeSize = minCodeSize + 1;
            for (var i = 0; i < clearCode; i++) {
                dict[i] = [i];
            }
            dict[clearCode] = [];
            dict[eoiCode] = null;

        };

        var code;
        var last;

        while (true) {
            last = code;
            code = readCode(codeSize);

            if (code === clearCode) {
                clear();
                continue;
            }
            if (code === eoiCode) break;

            if (code < dict.length) {
                if (last !== clearCode) {
                    dict.push(dict[last].concat(dict[code][0]));
                }
            }
            else {
                if (code !== dict.length) throw new Error('Invalid LZW code.');
                dict.push(dict[last].concat(dict[last][0]));
            }
            output.push.apply(output, dict[code]);

            if (dict.length === (1 << codeSize) && codeSize < 12) {
                // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
                codeSize++;
            }
        }

        // I don't know if this is technically an error, but some GIFs do it.
        //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
        return output;
    };


    // The actual parsing; returns an object with properties.
    var parseGIF = function (st, handler) {
        handler || (handler = {});

        // LZW (GIF-specific)
        var parseCT = function (entries) { // Each entry is 3 bytes, for RGB.
            var ct = [];
            for (var i = 0; i < entries; i++) {
                ct.push(st.readBytes(3));
            }
            return ct;
        };

        var readSubBlocks = function () {
            var size, data;
            data = '';
            do {
                size = st.readByte();
                data += st.read(size);
            } while (size !== 0);
            return data;
        };

        var parseHeader = function () {
            var hdr = {};
            hdr.sig = st.read(3);
            hdr.ver = st.read(3);
            if (hdr.sig !== 'GIF') throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
            hdr.width = st.readUnsigned();
            hdr.height = st.readUnsigned();

            var bits = byteToBitArr(st.readByte());
            hdr.gctFlag = bits.shift();
            hdr.colorRes = bitsToNum(bits.splice(0, 3));
            hdr.sorted = bits.shift();
            hdr.gctSize = bitsToNum(bits.splice(0, 3));

            hdr.bgColor = st.readByte();
            hdr.pixelAspectRatio = st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
            if (hdr.gctFlag) {
                hdr.gct = parseCT(1 << (hdr.gctSize + 1));
            }
            handler.hdr && handler.hdr(hdr);
        };

        var parseExt = function (block) {
            var parseGCExt = function (block) {
                var blockSize = st.readByte(); // Always 4
                var bits = byteToBitArr(st.readByte());
                block.reserved = bits.splice(0, 3); // Reserved; should be 000.
                block.disposalMethod = bitsToNum(bits.splice(0, 3));
                block.userInput = bits.shift();
                block.transparencyGiven = bits.shift();

                block.delayTime = st.readUnsigned();

                block.transparencyIndex = st.readByte();

                block.terminator = st.readByte();

                handler.gce && handler.gce(block);
            };

            var parseComExt = function (block) {
                block.comment = readSubBlocks();
                handler.com && handler.com(block);
            };

            var parsePTExt = function (block) {
                // No one *ever* uses this. If you use it, deal with parsing it yourself.
                var blockSize = st.readByte(); // Always 12
                block.ptHeader = st.readBytes(12);
                block.ptData = readSubBlocks();
                handler.pte && handler.pte(block);
            };

            var parseAppExt = function (block) {
                var parseNetscapeExt = function (block) {
                    var blockSize = st.readByte(); // Always 3
                    block.unknown = st.readByte(); // ??? Always 1? What is this?
                    block.iterations = st.readUnsigned();
                    block.terminator = st.readByte();
                    handler.app && handler.app.NETSCAPE && handler.app.NETSCAPE(block);
                };

                var parseUnknownAppExt = function (block) {
                    block.appData = readSubBlocks();
                    // FIXME: This won't work if a handler wants to match on any identifier.
                    handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
                };

                var blockSize = st.readByte(); // Always 11
                block.identifier = st.read(8);
                block.authCode = st.read(3);
                switch (block.identifier) {
                    case 'NETSCAPE':
                        parseNetscapeExt(block);
                        break;
                    default:
                        parseUnknownAppExt(block);
                        break;
                }
            };

            var parseUnknownExt = function (block) {
                block.data = readSubBlocks();
                handler.unknown && handler.unknown(block);
            };

            block.label = st.readByte();
            switch (block.label) {
                case 0xF9:
                    block.extType = 'gce';
                    parseGCExt(block);
                    break;
                case 0xFE:
                    block.extType = 'com';
                    parseComExt(block);
                    break;
                case 0x01:
                    block.extType = 'pte';
                    parsePTExt(block);
                    break;
                case 0xFF:
                    block.extType = 'app';
                    parseAppExt(block);
                    break;
                default:
                    block.extType = 'unknown';
                    parseUnknownExt(block);
                    break;
            }
        };

        var parseImg = function (img) {
            var deinterlace = function (pixels, width) {
                // Of course this defeats the purpose of interlacing. And it's *probably*
                // the least efficient way it's ever been implemented. But nevertheless...
                var newPixels = new Array(pixels.length);
                var rows = pixels.length / width;
                var cpRow = function (toRow, fromRow) {
                    var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                    newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
                };

                // See appendix E.
                var offsets = [0, 4, 2, 1];
                var steps = [8, 8, 4, 2];

                var fromRow = 0;
                for (var pass = 0; pass < 4; pass++) {
                    for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                        cpRow(toRow, fromRow)
                        fromRow++;
                    }
                }

                return newPixels;
            };

            img.leftPos = st.readUnsigned();
            img.topPos = st.readUnsigned();
            img.width = st.readUnsigned();
            img.height = st.readUnsigned();

            var bits = byteToBitArr(st.readByte());
            img.lctFlag = bits.shift();
            img.interlaced = bits.shift();
            img.sorted = bits.shift();
            img.reserved = bits.splice(0, 2);
            img.lctSize = bitsToNum(bits.splice(0, 3));

            if (img.lctFlag) {
                img.lct = parseCT(1 << (img.lctSize + 1));
            }

            img.lzwMinCodeSize = st.readByte();

            var lzwData = readSubBlocks();

            img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);

            if (img.interlaced) { // Move
                img.pixels = deinterlace(img.pixels, img.width);
            }

            handler.img && handler.img(img);
        };

        var parseBlock = function () {
            var block = {};
            block.sentinel = st.readByte();

            switch (String.fromCharCode(block.sentinel)) { // For ease of matching
                case '!':
                    block.type = 'ext';
                    parseExt(block);
                    break;
                case ',':
                    block.type = 'img';
                    parseImg(block);
                    break;
                case ';':
                    block.type = 'eof';
                    handler.eof && handler.eof(block);
                    break;
                default:
                    throw new Error('Unknown block: 0x' + block.sentinel.toString(16)); // TODO: Pad this with a 0.
            }

            if (block.type !== 'eof') setTimeout(parseBlock, 0);
        };

        var parse = function () {
            parseHeader();
            setTimeout(parseBlock, 0);
        };

        parse();
    };

    var SuperGif = function ( opts ) {

        var options = {
            //viewport position
            vp_l: 0,
            vp_t: 0,
            vp_w: null,
            vp_h: null,
            //canvas sizes
            c_w: null,
            c_h: null
        };
        for (var i in opts ) { options[i] = opts[i] }
        if (options.vp_w && options.vp_h) options.is_vp = true;

        //console.log(">>> >> ", options)

        var stream;
        var hdr;

        var loadError = null;
        var loading = false;

        var transparency = null;
        var delay = null;
        var disposalMethod = null;
        var disposalRestoreFromIdx = null;
        var lastDisposalMethod = null;
        var frame = null;
        var lastImg = null;

        var playing = true;
        var forward = true;

        var ctx_scaled = false;

        var frames = [];
        var frameOffsets = []; // elements have .x and .y properties

        var gif = options.gif;
        if (typeof options.auto_play == 'undefined')
            options.auto_play = (!gif.getAttribute('rel:auto_play') || gif.getAttribute('rel:auto_play') == '1');

        var onEndListener = (options.hasOwnProperty('on_end') ? options.on_end : null);
        var loopDelay = (options.hasOwnProperty('loop_delay') ? options.loop_delay : 0);
        var overrideLoopMode = (options.hasOwnProperty('loop_mode') ? options.loop_mode : 'auto');
        var drawWhileLoading = (options.hasOwnProperty('draw_while_loading') ? options.draw_while_loading : false);
        var showProgressBar = drawWhileLoading ? (options.hasOwnProperty('show_progress_bar') ? options.show_progress_bar : true) : false;
        var progressBarHeight = (options.hasOwnProperty('progressbar_height') ? options.progressbar_height : 25);
        var progressBarBackgroundColor = (options.hasOwnProperty('progressbar_background_color') ? options.progressbar_background_color : 'rgba(255,255,255,0.4)');
        var progressBarForegroundColor = (options.hasOwnProperty('progressbar_foreground_color') ? options.progressbar_foreground_color : 'rgba(255,0,22,.8)');

        var clear = function () {
            transparency = null;
            delay = null;
            lastDisposalMethod = disposalMethod;
            disposalMethod = null;
            frame = null;
        };

        // XXX: There's probably a better way to handle catching exceptions when
        // callbacks are involved.
        var doParse = function () {
            try {
                parseGIF(stream, handler);
            }
            catch (err) {
                doLoadError('parse');
            }
        };

        var doText = function (text) {
            toolbar.innerHTML = text; // innerText? Escaping? Whatever.
            toolbar.style.visibility = 'visible';
        };

        var setSizes = function(w, h) {
            canvas.width = w * get_canvas_scale();
            canvas.height = h * get_canvas_scale();
            toolbar.style.minWidth = ( w * get_canvas_scale() ) + 'px';

            tmpCanvas.width = w;
            tmpCanvas.height = h;
            tmpCanvas.style.width = w + 'px';
            tmpCanvas.style.height = h + 'px';
            tmpCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
        };

        var setFrameOffset = function(frame, offset) {
            if (!frameOffsets[frame]) {
                frameOffsets[frame] = offset;
                return;
            }
            if (typeof offset.x !== 'undefined') {
                frameOffsets[frame].x = offset.x;
            }
            if (typeof offset.y !== 'undefined') {
                frameOffsets[frame].y = offset.y;
            }
        };

        var doShowProgress = function (pos, length, draw) {
            if (draw && showProgressBar) {
                var height = progressBarHeight;
                var left, mid, top, width;
                if (options.is_vp) {
                    if (!ctx_scaled) {
                        top = (options.vp_t + options.vp_h - height);
                        height = height;
                        left = options.vp_l;
                        mid = left + (pos / length) * options.vp_w;
                        width = canvas.width;
                    } else {
                        top = (options.vp_t + options.vp_h - height) / get_canvas_scale();
                        height = height / get_canvas_scale();
                        left = (options.vp_l / get_canvas_scale() );
                        mid = left + (pos / length) * (options.vp_w / get_canvas_scale());
                        width = canvas.width / get_canvas_scale();
                    }
                    //some debugging, draw rect around viewport
                    if (false) {
                        if (!ctx_scaled) {
                            var l = options.vp_l, t = options.vp_t;
                            var w = options.vp_w, h = options.vp_h;
                        } else {
                            var l = options.vp_l/get_canvas_scale(), t = options.vp_t/get_canvas_scale();
                            var w = options.vp_w/get_canvas_scale(), h = options.vp_h/get_canvas_scale();
                        }
                        ctx.rect(l,t,w,h);
                        ctx.stroke();
                    }
                }
                else {
                    top = (canvas.height - height) / (ctx_scaled ? get_canvas_scale() : 1);
                    mid = ((pos / length) * canvas.width) / (ctx_scaled ? get_canvas_scale() : 1);
                    width = canvas.width / (ctx_scaled ? get_canvas_scale() : 1 );
                    height /= ctx_scaled ? get_canvas_scale() : 1;
                }

                ctx.fillStyle = progressBarBackgroundColor;
                ctx.fillRect(mid, top, width - mid, height);

                ctx.fillStyle = progressBarForegroundColor;
                ctx.fillRect(0, top, mid, height);
            }
        };

        var doLoadError = function (originOfError) {
            var drawError = function () {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, options.c_w ? options.c_w : hdr.width, options.c_h ? options.c_h : hdr.height);
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 3;
                ctx.moveTo(0, 0);
                ctx.lineTo(options.c_w ? options.c_w : hdr.width, options.c_h ? options.c_h : hdr.height);
                ctx.moveTo(0, options.c_h ? options.c_h : hdr.height);
                ctx.lineTo(options.c_w ? options.c_w : hdr.width, 0);
                ctx.stroke();
            };

            loadError = originOfError;
            hdr = {
                width: gif.width,
                height: gif.height
            }; // Fake header.
            frames = [];
            drawError();
        };

        var doHdr = function (_hdr) {
            hdr = _hdr;
            setSizes(hdr.width, hdr.height)
        };

        var doGCE = function (gce) {
            pushFrame();
            clear();
            transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
            delay = gce.delayTime;
            disposalMethod = gce.disposalMethod;
            // We don't have much to do with the rest of GCE.
        };

        var pushFrame = function () {
            if (!frame) return;
            frames.push({
                            data: frame.getImageData(0, 0, hdr.width, hdr.height),
                            delay: delay
                        });
            frameOffsets.push({ x: 0, y: 0 });
        };

        var doImg = function (img) {
            if (!frame) frame = tmpCanvas.getContext('2d');

            var currIdx = frames.length;

            //ct = color table, gct = global color table
            var ct = img.lctFlag ? img.lct : hdr.gct; // TODO: What if neither exists?

            /*
            Disposal method indicates the way in which the graphic is to
            be treated after being displayed.

            Values :    0 - No disposal specified. The decoder is
                            not required to take any action.
                        1 - Do not dispose. The graphic is to be left
                            in place.
                        2 - Restore to background color. The area used by the
                            graphic must be restored to the background color.
                        3 - Restore to previous. The decoder is required to
                            restore the area overwritten by the graphic with
                            what was there prior to rendering the graphic.

                            Importantly, "previous" means the frame state
                            after the last disposal of method 0, 1, or 2.
            */
            if (currIdx > 0) {
                if (lastDisposalMethod === 3) {
                    // Restore to previous
                    // If we disposed every frame including first frame up to this point, then we have
                    // no composited frame to restore to. In this case, restore to background instead.
                    if (disposalRestoreFromIdx !== null) {
                    	frame.putImageData(frames[disposalRestoreFromIdx].data, 0, 0);
                    } else {
                    	frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
                    }
                } else {
                    disposalRestoreFromIdx = currIdx - 1;
                }

                if (lastDisposalMethod === 2) {
                    // Restore to background color
                    // Browser implementations historically restore to transparent; we do the same.
                    // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
                    frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
                }
            }
            // else, Undefined/Do not dispose.
            // frame contains final pixel data from the last frame; do nothing

            //Get existing pixels for img region after applying disposal method
            var imgData = frame.getImageData(img.leftPos, img.topPos, img.width, img.height);

            //apply color table colors
            img.pixels.forEach(function (pixel, i) {
                // imgData.data === [R,G,B,A,R,G,B,A,...]
                if (pixel !== transparency) {
                    imgData.data[i * 4 + 0] = ct[pixel][0];
                    imgData.data[i * 4 + 1] = ct[pixel][1];
                    imgData.data[i * 4 + 2] = ct[pixel][2];
                    imgData.data[i * 4 + 3] = 255; // Opaque.
                }
            });

            frame.putImageData(imgData, img.leftPos, img.topPos);

            if (!ctx_scaled) {
                ctx.scale(get_canvas_scale(),get_canvas_scale());
                ctx_scaled = true;
            }

            // We could use the on-page canvas directly, except that we draw a progress
            // bar for each image chunk (not just the final image).
            if (drawWhileLoading) {
                ctx.drawImage(tmpCanvas, 0, 0);
                drawWhileLoading = options.auto_play;
            }

            lastImg = img;
        };

        var player = (function () {
            var i = -1;
            var iterationCount = 0;

            var showingInfo = false;
            var pinned = false;

            /**
             * Gets the index of the frame "up next".
             * @returns {number}
             */
            var getNextFrameNo = function () {
                var delta = (forward ? 1 : -1);
                return (i + delta + frames.length) % frames.length;
            };

            var stepFrame = function (amount) { // XXX: Name is confusing.
                i = i + amount;

                putFrame();
            };

            var step = (function () {
                var stepping = false;

                var completeLoop = function () {
                    if (onEndListener !== null)
                        onEndListener(gif);
                    iterationCount++;

                    if (overrideLoopMode !== false || iterationCount < 0) {
                        doStep();
                    } else {
                        stepping = false;
                        playing = false;
                    }
                };

                var doStep = function () {
                    stepping = playing;
                    if (!stepping) return;

                    stepFrame(1);
                    var delay = frames[i].delay * 10;
                    if (!delay) delay = 100; // FIXME: Should this even default at all? What should it be?

                    var nextFrameNo = getNextFrameNo();
                    if (nextFrameNo === 0) {
                        delay += loopDelay;
                        setTimeout(completeLoop, delay);
                    } else {
                        setTimeout(doStep, delay);
                    }
                };

                return function () {
                    if (!stepping) setTimeout(doStep, 0);
                };
            }());

            var putFrame = function () {
                var offset;
                i = parseInt(i, 10);

                if (i > frames.length - 1){
                    i = 0;
                }

                if (i < 0){
                    i = 0;
                }

                offset = frameOffsets[i];

                tmpCanvas.getContext("2d").putImageData(frames[i].data, offset.x, offset.y);
                ctx.globalCompositeOperation = "copy";
                ctx.drawImage(tmpCanvas, 0, 0);
            };

            var play = function () {
                playing = true;
                step();
            };

            var pause = function () {
                playing = false;
            };


            return {
                init: function () {
                    if (loadError) return;

                    if ( ! (options.c_w && options.c_h) ) {
                        ctx.scale(get_canvas_scale(),get_canvas_scale());
                    }

                    if (options.auto_play) {
                        step();
                    }
                    else {
                        i = 0;
                        putFrame();
                    }
                },
                step: step,
                play: play,
                pause: pause,
                playing: playing,
                move_relative: stepFrame,
                current_frame: function() { return i; },
                length: function() { return frames.length },
                move_to: function ( frame_idx ) {
                    i = frame_idx;
                    putFrame();
                }
            }
        }());

        var doDecodeProgress = function (draw) {
            doShowProgress(stream.pos, stream.data.length, draw);
        };

        var doNothing = function () {};
        /**
         * @param{boolean=} draw Whether to draw progress bar or not; this is not idempotent because of translucency.
         *                       Note that this means that the text will be unsynchronized with the progress bar on non-frames;
         *                       but those are typically so small (GCE etc.) that it doesn't really matter. TODO: Do this properly.
         */
        var withProgress = function (fn, draw) {
            return function (block) {
                fn(block);
                doDecodeProgress(draw);
            };
        };


        var handler = {
            hdr: withProgress(doHdr),
            gce: withProgress(doGCE),
            com: withProgress(doNothing),
            // I guess that's all for now.
            app: {
                // TODO: Is there much point in actually supporting iterations?
                NETSCAPE: withProgress(doNothing)
            },
            img: withProgress(doImg, true),
            eof: function (block) {
                //toolbar.style.display = '';
                pushFrame();
                doDecodeProgress(false);
                if ( ! (options.c_w && options.c_h) ) {
                    canvas.width = hdr.width * get_canvas_scale();
                    canvas.height = hdr.height * get_canvas_scale();
                }
                player.init();
                loading = false;
                if (load_callback) {
                    load_callback(gif);
                }

            }
        };

        var init = function () {
            var parent = gif.parentNode;

            var div = document.createElement('div');
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            toolbar = document.createElement('div');

            tmpCanvas = document.createElement('canvas');

            div.width = canvas.width = gif.width;
            div.height = canvas.height = gif.height;
            toolbar.style.minWidth = gif.width + 'px';

            div.className = 'jsgif';
            toolbar.className = 'jsgif_toolbar';
            div.appendChild(canvas);
            div.appendChild(toolbar);

            //parent.insertBefore(div, gif);
            //parent.removeChild(gif);

            if (options.c_w && options.c_h) setSizes(options.c_w, options.c_h);
            initialized=true;
        };

        var get_canvas_scale = function() {
            var scale;
            if (options.max_width && hdr && hdr.width > options.max_width) {
                scale = options.max_width / hdr.width;
            }
            else {
                scale = 1;
            }
            return scale;
        }

        var canvas, ctx, toolbar, tmpCanvas;
        var initialized = false;
        var load_callback = false;

        var load_setup = function(callback) {
            if (loading) return false;
            if (callback) load_callback = callback;
            else load_callback = false;

            loading = true;
            frames = [];
            clear();
            disposalRestoreFromIdx = null;
            lastDisposalMethod = null;
            frame = null;
            lastImg = null;

            return true;
        }

        return {
            // play controls
            play: player.play,
            pause: player.pause,
            move_relative: player.move_relative,
            move_to: player.move_to,

            // getters for instance vars
            get_playing      : function() { return playing },
            get_canvas       : function() { return canvas },
            get_canvas_scale : function() { return get_canvas_scale() },
            get_loading      : function() { return loading },
            get_auto_play    : function() { return options.auto_play },
            get_length       : function() { return player.length() },
            get_current_frame: function() { return player.current_frame() },
            load_url: function(src,callback){
                if (!load_setup(callback)) return;

                var h = new XMLHttpRequest();
                // new browsers (XMLHttpRequest2-compliant)
                h.open('GET', src, true);

                if ('overrideMimeType' in h) {
                    h.overrideMimeType('text/plain; charset=x-user-defined');
                }

                // old browsers (XMLHttpRequest-compliant)
                else if ('responseType' in h) {
                    h.responseType = 'arraybuffer';
                }

                // IE9 (Microsoft.XMLHTTP-compliant)
                else {
                    h.setRequestHeader('Accept-Charset', 'x-user-defined');
                }

                h.onloadstart = function() {
                    // Wait until connection is opened to replace the gif element with a canvas to avoid a blank img
                    if (!initialized) init();
                };
                h.onload = function(e) {
                    if (this.status != 200) {
                        doLoadError('xhr - response');
                    }
                    // emulating response field for IE9
                    if (!('response' in this)) {
                        this.response = new VBArray(this.responseText).toArray().map(String.fromCharCode).join('');
                    }
                    var data = this.response;
                    if (data.toString().indexOf("ArrayBuffer") > 0) {
                        data = new Uint8Array(data);
                    }

                    stream = new Stream(data);
                    setTimeout(doParse, 0);
                };
                h.onprogress = function (e) {
                    if (e.lengthComputable) doShowProgress(e.loaded, e.total, true);
                };
                h.onerror = function() { doLoadError('xhr'); };
                h.send();
            },
            load: function (callback) {
                this.load_url(gif.getAttribute('rel:animated_src') || gif.src,callback);
            },
            load_raw: function(arr, callback) {
                if (!load_setup(callback)) return;
                if (!initialized) init();
                stream = new Stream(arr);
                setTimeout(doParse, 0);
            },
            set_frame_offset: setFrameOffset
        };
    };

    return SuperGif;
}));

/*
	RubbableGif

	Example usage:

		<img src="./example1_preview.gif" rel:animated_src="./example1.gif" width="360" height="360" rel:auto_play="1" />

		<script type="text/javascript">
			$$('img').each(function (img_tag) {
				if (/.*\.gif/.test(img_tag.src)) {
					var rub = new RubbableGif({ gif: img_tag } );
					rub.load();
				}
			});
		</script>

	Image tag attributes:

		rel:animated_src -	If this url is specified, it's loaded into the player instead of src.
							This allows a preview frame to be shown until animated gif data is streamed into the canvas

		rel:auto_play -		Defaults to 1 if not specified. If set to zero, the gif will be rubbable but will not
							animate unless the user is rubbing it.

	Constructor options args

		gif 				Required. The DOM element of an img tag.
		auto_play 			Optional. Same as the rel:auto_play attribute above, this arg overrides the img tag info.
		max_width			Optional. Scale images over max_width down to max_width. Helpful with mobile.

	Instance methods

		// loading
		load( callback )	Loads the gif into a canvas element and then calls callback if one is passed

		// play controls
		play -				Start playing the gif
		pause -				Stop playing the gif
		move_to(i) -		Move to frame i of the gif
		move_relative(i) -	Move i frames ahead (or behind if i < 0)

		// getters
		get_canvas			The canvas element that the gif is playing in.
		get_playing			Whether or not the gif is currently playing
		get_loading			Whether or not the gif has finished loading/parsing
		get_auto_play		Whether or not the gif is set to play automatically
		get_length			The number of frames in the gif
		get_current_frame	The index of the currently displayed frame of the gif

		For additional customization (viewport inside iframe) these params may be passed:
		c_w, c_h - width and height of canvas
		vp_t, vp_l, vp_ w, vp_h - top, left, width and height of the viewport

*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./libgif'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('./libgif'));
    } else {
        root.RubbableGif = factory(root.SuperGif);
    }
}(this, function (SuperGif) {
    var RubbableGif = function( options ) {
        var sup = new SuperGif( options );

        var register_canvas_handers = function () {

            var isvp = function(x) {
                return (options.vp_l ? ( x - options.vp_l ) : x );
            }

            var canvas = sup.get_canvas();
            var maxTime = 1000,
            // allow movement if < 1000 ms (1 sec)
                w = ( options.vp_w ? options.vp_w : canvas.width ),
                maxDistance = Math.floor(w / (sup.get_length() * 2)),
            // swipe movement of 50 pixels triggers the swipe
                startX = 0,
                startTime = 0;

            var cantouch = "ontouchend" in document;

            var aj = 0;
            var last_played = 0;

            canvas.addEventListener((cantouch) ? 'touchstart' : 'mousedown', function (e) {
                // prevent image drag (Firefox)
                e.preventDefault();
                if (sup.get_auto_play()) sup.pause();

                var pos = (e.touches && e.touches.length > 0) ? e.touches[0] : e;

                var x = (pos.layerX > 0) ? isvp(pos.layerX) : w / 2;
                var progress = x / w;

                sup.move_to( Math.floor(progress * (sup.get_length() - 1)) );

                startTime = e.timeStamp;
                startX = isvp(pos.pageX);
            });

            canvas.addEventListener((cantouch) ? 'touchend' : 'mouseup', function (e) {
                startTime = 0;
                startX = 0;
                if (sup.get_auto_play()) sup.play();
            });

            canvas.addEventListener((cantouch) ? 'touchmove' : 'mousemove', function (e) {
                e.preventDefault();
                var pos = (e.touches && e.touches.length > 0) ? e.touches[0] : e;

                var currentX = isvp(pos.pageX);
                currentDistance = (startX === 0) ? 0 : Math.abs(currentX - startX);
                // allow if movement < 1 sec
                currentTime = e.timeStamp;
                if (startTime !== 0 && currentDistance > maxDistance) {
                    if (currentX < startX && sup.get_current_frame() > 0) {
                        sup.move_relative(-1);
                    }
                    if (currentX > startX && sup.get_current_frame() < sup.get_length() - 1) {
                        sup.move_relative(1);
                    }
                    startTime = e.timeStamp;
                    startX = isvp(pos.pageX);
                }

                var time_since_last_play = e.timeStamp - last_played;
                {
                    aj++;
                    if (document.getElementById('tickles' + ((aj % 5) + 1))) document.getElementById('tickles' + ((aj % 5) + 1)).play();
                    last_played = e.timeStamp;
                }


            });
        };

        sup.orig_load = sup.load;
        sup.load = function(callback) {
            sup.orig_load( function() {
                if (callback) callback();
                register_canvas_handers( sup );
            } );
        }

        return sup;
    }

    return RubbableGif;
}));
