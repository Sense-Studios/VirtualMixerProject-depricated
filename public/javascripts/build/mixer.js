
/**
 * @summery
 *  Wraps around a Three.js GLRenderer and sets up the scene and shaders.
 *
 * @description
 *  Wraps around a Three.js GLRenderer and sets up the scene and shaders.
 *
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

var GlRenderer = function( _options ) {

  var _self = this

  /** Set uop options */
  _self.options = { element: 'glcanvas' }
  if ( _options != undefined ) {
    _self.options = _options
  }

  /** This is a description of the foo function. */
  // set up threejs scene
  _self.element = _self.options.element
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

AudioAnalysis.prototype = new Addon(); // assign prototype to marqer
AudioAnalysis.constructor = AudioAnalysis;  // re-assign constructor

/**
* @summary
*   AudioAnalysis returns a BPM based on music analisis. Either mp3 or microphone
*
* @description
*   see more at [Joe Sullivan]{@link http://joesul.li/van/beat-detection-using-web-audio/}
*   AudioAnalysis returns a floating point between 1 and 0, in sync with a bpm
*   the BPM is calculated based on an input music stream (mp3 file)
*
*   ```
*     options.audio (String) is a source, like /path/to/mymusic.mp3
*     options.microphone (Boolean) use microphone (true) or audiosource (false)
*   ```
*
*
* @example
* var mixer1 = new Mixer( _renderer, { source1: mySource, source2: myOtherSource })
* var analysis = new AudioAnalysis( renderer, { audio: 'mymusic.mp3' } );
* analysis.add( mixer1.pod )
* @constructor Addon#AudioAnalysis
* @implements Addon
* @param {GlRenderer} renderer - current {@link GlRenderer}
* @param {Object} options - object with several settings
*/

// returns a floating point between 1 and 0, in sync with a bpm
// it also returns actual BPM numbers and a set of options
function AudioAnalysis( _renderer, _options ) {
  var _self = this

  // exposed variables.
  _self.uuid = "Analysis_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Addon"

  // NOTE: that externally "audio" refers to the audiofile
  // internally it refers to the Audio HTMLMediaElement
  _self.audio = ""
  _self.bypass = false

  /**
   * @description (calculated)bpm
   * @member Addon#AudioAnalysis#bpm
  */
  _self.bpm = 128
  _self.bpm_float = 128

  /**
   * @description bpm mod, multiplyer for bpm output, usuall 0.125, 0.25, 0.5, 2, 4 etc.
   * @member Addon#AudioAnalysis#mod
  */
  _self.mod = 1
  _self.bps = 1
  _self.sec = 0

  // default options
  _self.options = {
    //audio: '/radio/nsb',
    audio: '/audio/fear_is_the_mind_killer_audio.mp3',
    microphone: false
  }

  if ( _options != undefined ) {
    _self.options = _options;
  }

  // somewhat private private
  var calibrating = true
  var nodes = []
  var c = 0
  var starttime = (new Date()).getTime()

  // add to renderer
  _renderer.add(_self)

  // setup ---------------------------------------------------------------------

  // create all necc. contexts
  var audio = new Audio()
  var context = new AudioContext(); // AudioContext object instance
  var source
  var bandpassFilter = context.createBiquadFilter();
  var analyser = context.createAnalyser();
  var start = Date.now();
  var d = 0; // counter for non-rendered bpm

  /**
   * @description Audio element
   * @member Addon#AudioAnalysis#audio
   * @param {HTMLMediaElement} - reference to the virtual media element
   *
   *  HTMLMediaElement AUDIO reference
   *
  */
  _self.audio = audio

  // config --------------------------------------------------------------------
  // with ~ 200 samples/s it takes ~ 20 seconds to adjust at 4000 sampleLength
  var sampleLength = 4000;
  var dataSet = new Array(sampleLength);
  var peaks = new Array(sampleLength);
  var bufferLength
  var foundpeaks = [];
  var peak_max = 60;
  var peak_min = 15;
  var treshold = 1;
  var intervalCounts = [];

  audio.controls = true;
  audio.loop = true;
  audio.autoplay = true;

  // or as argument(settings.passFreq ? settings.passFreq : 350);
  bandpassFilter.type = "lowpass";
  bandpassFilter.frequency.value = 350
  bandpassFilter.Q.value = 1
  analyser.fftSize = 128;
  bufferLength = analyser.frequencyBinCount;

  /**
   * @description
   *  firstload for mobile, forces all control to the site on click
   * @member Addon#AudioAnalysis~disconnectOutput
   *
  */
  var forceFullscreen = function() {
    console.log("AudioAnalysis is re-intialized after click initialized!", audio.src);
    audio.play();
    document.body.webkitRequestFullScreen()
    document.body.removeEventListener('click', forceFullscreen);
  }
  document.body.addEventListener('click', forceFullscreen)

  /**
   * @description
   *  disconnects audio to output, this will mute the analalyser, but won't stop analysing
   * @member Addon#AudioAnalysis#disconnectOutput
   *
  */
  _self.disconnectOutput = function() {
    source.disconnect(context.destination);
  }

  /**
   * @description
   *   connects the audio source to output, making it audible
   * @member Addon#AudioAnalysis#connectOutput
   *
  */
  _self.connectOutput = function() {
    source.connect(context.destination);
  }

  _self.getBpm = function() {
    return _self.bpm
  }

  // main ----------------------------------------------------------------------
  _self.init = function() {
    console.log("init AudioAnalysis Addon.")

    /**
     * @description Audio element
     * @member Addon#AudioAnalysis#audio_src
     * @param {string} - reference to audiofile
    */
    // set audio src to optioned value
    if ( !_self.options.microphone ) {
      source = context.createMediaElementSource(audio);
      audio.src = _self.options.audio  // NSB RADIO --> 'http://37.220.36.53:7904';
      _self.audio_src = _self.options.audio
      initializeAutoBpm()

    } else {

      navigator.mediaDevices.getUserMedia({ audio })
      .then(function(mediaStream) {
        source = context.createMediaStreamSource(mediaStream);
        initializeAutoBpm()

      }).catch(function(err) {
        console.log(err.name + ": " + err.message);
      }); // always check for errors at the end.
    }
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

  /**
   * @description
   *  initialize autobpm, after {@link Addon#AudioAnalysis.initializeAudio}
   *  start the {@link Addon#AudioAnalysis~sampler}
   *
   * @member Addon#AudioAnalysis.initializeAutoBpm
   *
  */
  var initializeAutoBpm = function() {
    // tries and play the audio
    audio.play();

    // connect the analysier and the filter
    source.connect(bandpassFilter);
    bandpassFilter.connect(analyser);

    // send it to the speakers (or not)
    source.connect(context.destination);

    // start the sampler
    setInterval( sampler, 1);
  }

  // ANYLISIS STARTS HERE ------------------------------------------------------
  /**
   * @description
   *   gets the analyser.getByteTimeDomainData
   *   calculates the tempodata every 'slowpoke' (now set at samples 10/s)
   *   returns the most occuring bpm
   *
   *
   * @member Addon#AudioAnalysis~sampler
   *
  */
  _self.dataSet
  _self.tempoData
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
      _self.tempoData = tempoData
      // Here are some ideas for a more complete analisis range

      // var tempoCounts = tempoData.tempoCounts
      // getBlackout // TODO -- detects blackout, prolonged, relative silence in sets
      // getAmbience // TODO -- detects overal 'business' of the sound, it's ambience

      if (tempoData == undefined) {
        console.log("sampler is active, but no beat was found")
      }else{
        _self.tempodata_bpm = tempoData.bpm
      }

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

  /**
   * @description
   *  returns 'tempodata', a list of found BPMs sorted on occurrence
   *  object includes: bpm (ie. 128), confidence (0-1), calibrating (true/false),
   *  treshold, tempocounts, foundpeaks and peaks
   * @member Addon#AudioAnalysis~getTempo
   *
  */
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
    tempoCounts.sort( sortHelper );                             // sort tempo's by 'score', or most neighbours
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
      foundpeaks: foundpeaks,        // current found peaks
      peaks: peaks                   // all peaks, for display only
    }

    //console.log(tempoData.bpm, tempoData.confidence)

    return tempoData;
  }

  // HELPERS
  // sort helper
  var sortHelper = function ( a,b ) {
    return parseInt( a.count, 10 ) - parseInt( b.count, 10 );
  }

  /**
   * @description Finds peaks in the audiodata and groups them together
   * @member Addon#AudioAnalysis~countIntervalsBetweenNearbyPeaks
   *
  */
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
  /**
   * @description
   *  map found intervals together and returns 'tempocounts', a list of found
   *  tempos and their occurences
   * @member Addon#AudioAnalysis~groupNeighborsByTempo
   *
  */
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

BPM.prototype = new Addon(); // assign prototype to marqer
BPM.constructor = BPM;  // re-assign constructor

/**
 * @summary
 *   BPM calculates beat per minutes based on a 'tap' function
 *
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

  _self.getBpm = function() {
    return _self.bpm
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

FileManager.prototype = new Addon(); // assign prototype to marqer
FileManager.constructor = FileManager;  // re-assign constructor

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

  // to be honest, this is kind of stupid; shouldnt it check for source 
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

GiphyManager.prototype = new Addon(); // assign prototype to marqer
GiphyManager.constructor = GiphyManager;  // re-assign constructor

/**
 * @summary
 *   Allows for realtime downloading of Gifs from 'Giphy', based on tags
 *
 * @description
 *   Allows for realtime downloading of Gifs from 'Giphy', based on tags
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
  // this key is for demo purposes only
  var key = "tIovPHdiZhUF3w0UC6ETdEzjYOaFZQFu"

  /**
   * @description same as [search]{@link Addon#Needle#Gyphymanager#search}
   * @function Addon#Gyphymanager#needle
   * @param {string} query - Search term
   */
  _self.needle = function( _needle ) {
    utils.get('//api.giphy.com/v1/gifs/search?api_key='+key+'&q='+_needle, function(d) {
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
* @summary
*   Helper classes that add on other classes in the mixer.
*
* @description
*   Helper classes that add on other classes in the mixer.
*   ```
*
* @constructor Addon
* @interface
* @author Sense Studios
*/

function Addon() {}

ComputerKeyboard.prototype = new Controller();  // assign prototype to marqer
ComputerKeyboard.constructor = ComputerKeyboard;  // re-assign constructor

/**
 * @implements Controller
 * @constructor Controller#ComputerKeyboard
 * @interface
 */

function ComputerKeyboard() {
}

Gamepad.prototype = new Controller();  // assign prototype to marqer
Gamepad.constructor = Gamepad;  // re-assign constructor

/**
 * @implements Controller
 * @constructor Controller#Gamepad
 * @interface
 */

function Gamepad() {
}

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


THIS IS UNDER HEAVY CONSTRUCTION!

The idea of a 'behaviour' is to trigger certain functions on a set interval.
For instance; a behaviour could be to trigger 10s, 20s and 40s, every 2, 4 and
8 beats. of the song.

This is not to be confused with 'trackdata', which does pretty much the same
thing. trackdata should move over to "sheets", which in itself would qualitfy
as a behaviour in it's own right

So alternatively, behaviour could siply be random triggers, much like
autonomous controllers, setting changes, scratch and what not, every so
often.

*/


function Behaviour( _renderer, options ) {

  // create and instance
  var _self = this;

  // set or get uid
  _self.uuid = "Behaviour" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Behaviour"

  // add to renderer
  _renderer.add(_self)

  _self.beats = 0
  _self.time = (new Date()).getTime()
  _self.script = {}
  _self.sheets = []
  _self.sheet_index = 0

  // requires a bpm
  _self.bpm = options.bpm

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
    // checkSheets()
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

GamePadController.prototype = new Controller();  // assign prototype to marqer
GamePadController.constructor = GamePadController;  // re-assign constructor

/**
 * @summary
 *  ---
 *
 * @description
 *  ---
 *
 * @example
 *  ---
 *
 * @implements Controller
 * @constructor Controller#GamePadController
 * @param options:Object
 * @author Sense Studios
 */

function GamePadController( renderer, _mixer1, _mixer2, _mixer3 ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "GamePadController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
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
    console.log("init GamePadController.")
    //window.addEventListener( 'keydown', keyHandler )

    window.addEventListener("GamePadController connected", connecthandler )


  }

  var to1, to2, to3, to4, to5, to6, to7, to8
  var lock
  _self.update = function() {
    // console.log(_self.controllers[0].axes)
    // console.log( navigator.getGamePadControllers()[0].axes )
    // console.log( navigator.getGamePadControllers()[0].axes
    // [0.003921627998352051, 0.003921627998352051, 0, 0, 0, 0.003921627998352051, 0.003921627998352051, 0, 0, 3.2857141494750977]
    // [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 ]
    //   LP                RP         W
    if ( _self.bypass ) return;

    var buttons = navigator.getGamePadControllers()[0].buttons
    //console.log(navigator.getGamePadControllers()[0].buttons)
    navigator.getGamePadControllers()[0].buttons.forEach(function(b, i){
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

    var axes = navigator.getGamePadControllers()[0].axes
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

  var addGamePadController = function( GamePadController ) {
    _self.controllers[GamePadController.index] = GamePadController
    console.log(GamePadController.id, GamePadController.index )
  }

  var connecthandler = function( e ) {
    console.log("GamePadController connected at index %d: %s. %d buttons, %d axes.", e.GamePadController.index, e.GamePadController.id);
    addGamePadController(e.GamePadController)
    _self.bypass = false
  }

  var keyHandler = function( _event ) {
    // should be some way to check focus of this BPM instance
    // if _self.hasFocus
    //}
  }
}


/*
window.addEventListener("GamePadControllerconnected", function(e) {
  console.log("GamePadController connected at index %d: %s. %d buttons, %d axes.",
    e.GamePadController.index, e.GamePadController.id,
    e.GamePadController.buttons.length, e.GamePadController.axes.length);
    var gp = navigator.getGamePadControllers()[e.GamePadController.index];
    console.log("GamePadController connected at index %d: %s. %d buttons, %d axes.",
      gp.index, gp.id,
      gp.buttons.length, gp.axes.length);
});
*/


MidiController.prototype = new Controller();  // assign prototype to marqer
MidiController.constructor = MidiController;  // re-assign constructor

/**
 * @summary
 *  ---
 *
 * @description
 *  ---
 *
 * @example
 *  ---
 *
 * @implements Controller
 * @constructor Controller#MidiController
 * @param options:Object
 * @author Sense Studios
 */

function MidiController( _options ) {
  // base

  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "MidiController_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "MidiController"
  _self.bypass = true
  _self.verbose = false
  _self.ready = false
  _self.controllers = {};

  // source.renderer ?
  var nodes = []
  var binds = []

  // counter
  var c = 0

  // add to renderer
  //_renderer.add(_self)

  // needed for the program
  var midi, input, output

  // we have success!
  var success = function(_midi) {
  	midi = _midi
  	var inputs = midi.inputs.values();
  	var outputs = midi.outputs.values();

  	for (i = inputs.next(); i && !i.done; i = inputs.next()) {
  		input = i.value;
      input.onmidimessage = _self.onMIDIMessage;
  	}

  	for (o = outputs.next(); o && !o.done; o = outputs.next()) {
  		output = o.value;
      initMidi()
  	}

    console.log("Midi READY")
    if ( output != undefined ) _self.ready = true
  }

  // everything went wrong.
  var failure = function () {
  	console.error('No access to your midi devices.');
  }

  // request MIDI access
  console.log("Midi check... ")
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
      .then( success, failure );
  }

  function initMidi() {
    if ( _self.verbose ) console.log(" MIDI READY", "ready")
    dispatchMidiEvent("ready")
  }

  // some examples, this is the 'onpress' (and on slider) function
  var doubleclickbuffer = [ 0, 0, 0, 0 ]
  var doubleclickPattern = [ 128, 144, 128, 144 ]
  var doubleclick = false

  _self.onMIDIMessage = function(e) {
    if (_self.verbose) console.log(" MIDIMESSAGE >>", e.data)
    checkBindings(e.data)
    dispatchMidiEvent(e)

    // hello from midi
    // console.log(e.data)

    // Uint8Array(3) [176, 48, 117]
    // [ state, key, velocity ]
    // state
    // 144 = down
    // 112 = up
    // 176 = sliding ( fader )
    //

    // This is mainly experimental code for doubleclicking
    // we could return this as 256, 257 or higher state values (?)

    /*
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
        _self.output.send( [ 0x90, e.data[1], GREEN_BLINK ] )
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
  		_self.output.send(commands)

  	}else if (e.data[1] == 65) {
  		// switch the main pads yellow
  		var commands = []
  		midimap.forEach( function( row, i ) {
  			row.forEach( function( value, j ) {
  				commands.push( 0x90, value, YELLOW )
  			})
  		})
      _self.output.send( commands )

  	}else{
  		// press a button, make it green
      if (e.data[0] == 128 ) {
        _self.output.send( [ 0x90, e.data[1], OFF ] );
        //chain1.setChainLink(e.data[1], 0)
        //console.log("toggle chain")
        doubleclick = false
      }

      if (e.data[0] == 144  ) {
        _self.output.send( [ 0x90, e.data[1], GREEN ] );
        //chain1.setChainLink(e.data[1], faders[e.data[1]]/126)
        //console.log("toggle chain", faders[e.data[1]], e.data[1] )
        faders_opaque[e.data[1]] = 0
        doubleclick = false
      }
  	}
    */
  }

  // ---------------------------------------------------------------------------
  _self.init = function() {}
  _self.update = function() {}

  // ---------------------------------------------------------------------------
  _self.bind = function( _key, _callback ) {
    binds.push( { key: _key, callback: _callback } )
    // check for double binds ?
  }

  _self.removeBind = function( _key, _num ) {
    // always remove first ?
  }

  // [ state, key, velocity ]
  var checkBindings = function(e) {
    binds.forEach( function( _obj ) {
      if ( e[1] == _obj.key ) _obj.callback(e)
    });
  }

  _self.send = function( commands ) {
    if (_self.ready) {
      console.log("Midi send ", commands, "to", output)
      output.send( commands )
    }else{
      console.log("Midi is not ready yet")
    }
  }

  _self.addEventListener = function( _callbackName, _target ) {
    console.log("midi add listener: " , _callbackName)
    //listeners.push( _target )
    nodes.push({callbackName: _callbackName, target: _target})
    console.log("midi list: ", nodes)
  }

  var dispatchMidiEvent = function(e) {
    nodes.forEach(function( _obj ){
      _obj.target[_obj.callbackName](e)
    });
  }
}

function SourceControl( renderer, source ) {
  // source.renderer ?

}

/**
 * @constructor Controller
 * @interface
 */

function Controller( options ) {
  var _self = this

  // set options
  var _options;
  if ( options != undefined ) _options = options;

  _self.type = "Controller"
  _self.testControllerVar = "test"

  // program interface
  _self.init =         function() {}
  _self.update =       function() {}
  _self.render =       function() {}
  _self.add =          function() {}
  //_self.start =        function() {}

}

ColorEffect.prototype = new Effect(); // assign prototype to marqer
ColorEffect.constructor = ColorEffect;  // re-assign constructor

/**
 * @summary
 *   The color effect has a series of simple color effects
 *
 * @description
 *   Color effect allows for a series of color effect, mostly
 *   mimicing classic mixers like MX50 and V4
 *   ```
 *    1. black and white, 2. negative 1, 3. negative 2, 4. negative 3
 *    5. monocolor red, 6. monocolor blue 7. monocolor green, 8. monocolor yellow,
 *    9. monocolor turqoise, 10. monocolor purple, 11. sepia
 *   ```
 *
 * @example
 *   let myEffect = new ColorEffect( renderer, { source1: myVideoSource, effect: 1 });
 *
 * @constructor Effect#ColorEffect
 * @implements Effect
 * @param renderer:GlRenderer
 * @param options:Object
 * @author Sense Studios
 */

// fragment
// vec3 b_w = ( source.x + source.y + source.z) / 3
// vec3 amount = source.xyz + ( b_w.xyx * _alpha )
// col = vec3(col.r+col.g+col.b)/3.0;
// col = vec4( vec3(col.r+col.g+col.b)/3.0, _alpha );

function ColorEffect( _renderer, _options ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( _options.uuid == undefined ) {
    _self.uuid = "ColorEffect_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = _options.uuid
  }

  // add to renderer
  _renderer.add(_self)

  _self.type = "Effect"

  var source = _options.source
  var currentEffect = _options.effect
  var currentEffect = 1
  var currentExtra = 0.8

  var dpr = window.devicePixelRatio;
  var textureSize = 128 * dpr;
  var data = new Uint8Array( textureSize * textureSize * 3 );
  //var dataTexture = new THREE.DataTexture( canvasElement );
  //var dataTexture = new THREE.DataTexture( data, textureSize, textureSize, THREE.RGBFormat );
  //dataTexture.minFilter = THREE.NearestFilter;
	//dataTexture.magFilter = THREE.NearestFilter;
	//dataTexture.needsUpdate = true;

  var canvasElement, canvasContext, tempTexture


  _self.init = function() {

    // create canvas
    canvasElement = document.createElement('canvas');
    canvasElement.width = 1024;
    canvasElement.height = 1024;
    canvasElementContext = canvasElement.getContext( '2d' );
    canvasElementContext.fillStyle = "#FF0000";
    canvasElementContext.fillRect( 0, 0, 500,500)

    console.log("ColorEffect inits, with", _renderer)
    // add uniforms to renderer
    _renderer.customUniforms[_self.uuid+'_currentcoloreffect'] = { type: "i", value: 1 }
    _renderer.customUniforms[_self.uuid+'_extra'] = { type: "f", value: 2.0 }
    //_renderer.customUniforms[_self.uuid+'_currentcoloreffect'] = { type: "t", value: null }
    // _renderer.customUniforms[_self.uuid+'_effectsampler'] = { type: "t", value: tempTexture }
    //_renderer.customUniforms[_self.uuid+'_sampler'] = { type: "t", value: null }

    // add uniforms to fragmentshader
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_currentcoloreffect;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_extra;\n/* custom_uniforms */')

    // _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_currentcoloreffect;\n/* custom_uniforms */')
    // _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D  '+_self.uuid+'_effectsampler;\n/* custom_uniforms */')
    // _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D  '+_self.uuid+'_noisesampler;\n/* custom_uniforms */')

    // uniform float noiseScale;
    // uniform float time;
    // uniform float baseSpeed;


    //_renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int '+_self.uuid+'_output;\n/* custom_uniforms */')

    // _output * uuid_alpha_1
    // uuid_alpha_1 * -pod
    // uuid_alpha_2 * +pod
    if ( renderer.fragmentShader.indexOf('vec4 coloreffect ( vec4 src, int currentcoloreffect, float extra, vec2 vUv )') == -1 ) {
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_helpers */',
`
vec4 coloreffect ( vec4 src, int currentcoloreffect, float extra, vec2 vUv ) {
  if ( currentcoloreffect == 1 ) return vec4( src.rgba );                                                                               // normal

  // negative
  if ( currentcoloreffect == 2  ) return vec4( 1.-src.r, 1.-src.g, 1.-src.b, src.a );                                                   // negtive 1
  if ( currentcoloreffect == 3  ) return vec4( 1./src.r-1.0, 1./src.g-1.0, 1./src.b-1.0, src.a );                                       // negtive 2
  if ( currentcoloreffect == 4  ) return vec4( 1./src.r-2.0, 1./src.g-2.0, 1./src.b-2.0, src.a );                                       // negtive 3

  // monocolor
  if ( currentcoloreffect == 5  ) return vec4( vec3( src.r + src.g + src.b ) / 3., src.a );                                             // black and white
  if ( currentcoloreffect == 6  ) return vec4( vec3( (src.r+src.g+src.b) *3.  , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) /1.7 ) / 3., src.a );  // mopnocolor red
  if ( currentcoloreffect == 7  ) return vec4( vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  *3.  , (src.r+src.g+src.b) /1.7 ) / 3., src.a );  // mopnocolor blue
  if ( currentcoloreffect == 8  ) return vec4( vec3( (src.r+src.g+src.b) /1.7 , (src.r+src.g+src.b)  /1.7 , (src.r+src.g+src.b) *3.  ) / 3., src.a );  // mopnocolor green
  if ( currentcoloreffect == 9  ) return vec4( vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) /1.2 ) / 3., src.a );  // mopnocolor yellow
  if ( currentcoloreffect == 10 ) return vec4( vec3( (src.r+src.g+src.b) *1.2 , (src.r+src.g+src.b)  *2.  , (src.r+src.g+src.b) *2.  ) / 3., src.a );  // mopnocolor turqoise
  if ( currentcoloreffect == 11 ) return vec4( vec3( (src.r+src.g+src.b) *2.  , (src.r+src.g+src.b)  /1.2 , (src.r+src.g+src.b) *2.  ) / 3., src.a );  // mopnocolor purple
  if ( currentcoloreffect == 12 ) return vec4( vec3( src.r + src.g + src.b ) / 3. * vec3( 1.2, 1.0, 0.8 ), src.a);                                   // sepia

  // color swapping
  if ( currentcoloreffect == 13 ) return vec4( src.rrra );
  if ( currentcoloreffect == 14 ) return vec4( src.rrga );
  if ( currentcoloreffect == 15 ) return vec4( src.rrba );
  if ( currentcoloreffect == 16 ) return vec4( src.rgra );
  if ( currentcoloreffect == 17 ) return vec4( src.rgga );
  if ( currentcoloreffect == 18 ) return vec4( src.rbra );
  if ( currentcoloreffect == 19 ) return vec4( src.rbga );
  if ( currentcoloreffect == 20 ) return vec4( src.rbba );
  if ( currentcoloreffect == 21 ) return vec4( src.grra );
  if ( currentcoloreffect == 22 ) return vec4( src.grga );
  if ( currentcoloreffect == 23 ) return vec4( src.grba );
  if ( currentcoloreffect == 24 ) return vec4( src.ggra );
  if ( currentcoloreffect == 25 ) return vec4( src.ggga );
  if ( currentcoloreffect == 26 ) return vec4( src.ggba );
  if ( currentcoloreffect == 27 ) return vec4( src.gbra );
  if ( currentcoloreffect == 28 ) return vec4( src.gbga );
  if ( currentcoloreffect == 29 ) return vec4( src.gbba );
  if ( currentcoloreffect == 30 ) return vec4( src.brra );
  if ( currentcoloreffect == 31 ) return vec4( src.brga );
  if ( currentcoloreffect == 32 ) return vec4( src.brba );
  if ( currentcoloreffect == 33 ) return vec4( src.bgra );
  if ( currentcoloreffect == 34 ) return vec4( src.bgga );
  if ( currentcoloreffect == 35 ) return vec4( src.bgba );
  if ( currentcoloreffect == 36 ) return vec4( src.bbra );
  if ( currentcoloreffect == 37 ) return vec4( src.bbga );
  if ( currentcoloreffect == 38 ) return vec4( src.bbba );

  // lum key
  if ( currentcoloreffect == 39 ) {
    float red = clamp( src.r, extra, 1.) == extra ? .0 : src.r;
    float green = clamp( src.r, extra, 1.) == extra ? .0 : src.g;
    float blue = clamp( src.r, extra, 1.) == extra ? .0 : src.b;
    float alpha = red + green + blue == .0 ? .0 : src.a;
    return vec4( red, green, blue, alpha );
  }

  // color key; Greenkey
  if ( currentcoloreffect == 40 ) {
    return vec4( src.r, clamp( src.r, extra, 1.) == extra ? .0 : src.g, src.b, clamp( src.r, extra, 1.) == extra ? .0 : src.a );
  }

  // paint
  if ( currentcoloreffect == 41 ) {
    return vec4( floor( src.r * extra ) / extra, floor( src.g * extra ) / extra, floor( src.b * extra ) / extra, src.a  );
  }

  // colorise
  if ( currentcoloreffect == 42 ) {
  }

  // wipes (move these to mixer?)
  if ( gl_FragCoord.x > 200.0 ) {
    return vec4(0.0,0.0,0.0,0.0);
  }else {
    return src;
  }
}

/* custom_helpers */
`
    );
  }

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_main */', '\
vec4 '+_self.uuid+'_output = coloreffect( '+source.uuid+'_output, ' + _self.uuid+'_currentcoloreffect' + ', '+ _self.uuid+'_extra' +', vUv );\n  /* custom_main */');
  } // init


  var vector = new THREE.Vector2();
  //var glcanvas = document.getElementById('glcanvas');
  //var glcanvas = _renderer.glrenderer.context.canvas
  var i = 0
  _self.update = function() {
    i++
    // mixmode
    // blendmode
    // pod
    //console.log( "--", glcanvas.width, glcanvas.height )

    //glcanvas = _renderer.glrenderer.context.canvas
    //canvasElementContext.drawImage( glcanvas, Math.sin(i/20)*20-10, 1, glcanvas.width*1.0000000001, glcanvas.height*1.0000000001 );

    //vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
  	//vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );

    //_renderer.copyFramebufferToTexture( vector, dataTexture );

    glcanvas = document.getElementById('glcanvas');
    canvasElementContext.drawImage( glcanvas, 0,0, glcanvas.width, glcanvas.height );
    if ( tempTexture ) tempTexture.needsUpdate = true;
  }

  /* ------------------------------------------------------------------------ */

  /**
   * @description
   *  gets or sets the _effect_, there are 11 color EFFECTS available, numbered 1-11;
   *  ```
   *  1. BlackAndWhite (default),
   *  2. Negative 1,
   *  3. Negative 2,
   *  4. Negative 3,
   *  5. Monocolor red,
   *  6. Monocolor blue,
   *  7. Monocolor green,
   *  8. Monocolor yellow,
   *  9. Monocolor turqoise,
   *  10. Monocolor purple,
   *  11. Sepia,
   *  ```
   * @function Effect#ColorEffect#effect
   * @param {number} effect index of the effect
   */

  _self.effect = function( _num ){
    if ( _num != undefined ) {
      currentEffect = _num
      renderer.customUniforms[_self.uuid+'_currentcoloreffect'].value = currentEffect
      // update uniform ?
    }

    console.log("effect set to: ", currentEffect)
    return currentEffect
  }

  _self.extra = function( _num ){
    if ( _num != undefined ) {
      currentExtra = _num
      renderer.customUniforms[_self.uuid+'_extra'].value = currentExtra
      // update uniform ?
    }

    console.log("extra set to: ", currentExtra)
    return currentExtra
  }
}

DistortionEffect.prototype = new Effect(); // assign prototype to marqer
DistortionEffect.constructor = DistortionEffect;  // re-assign constructor

/**
 * @summary
 *   The color effect has a series of simple color effects
 *
 * @description
 *   Color effect allows for a series of color effect, mostly
 *   mimicing classic mixers like MX50 and V4
 *   ```
 *    1. black and white, 2. negative 1, 3. negative 2, 4. negative 3
 *    5. monocolor red, 6. monocolor blue 7. monocolor green, 8. monocolor yellow,
 *    9. monocolor turqoise, 10. monocolor purple, 11. sepia
 *   ```
 *
 * @example
 *   let myEffect = new DistortionEffect( renderer, { source1: myVideoSource, effect: 1 });
 *
 * @constructor Effect#DistortionEffect
 * @implements Effect
 * @param renderer:GlRenderer
 * @param options:Object
 * @author Sense Studios
 */

// fragment
// vec3 b_w = ( source.x + source.y + source.z) / 3
// vec3 amount = source.xyz + ( b_w.xyx * _alpha )
// col = vec3(col.r+col.g+col.b)/3.0;
// col = vec4( vec3(col.r+col.g+col.b)/3.0, _alpha );

// TO THINK ON: Seems we need to connect this to SOURCES somehow

function DistortionEffect( _renderer, _options ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( _options.uuid == undefined ) {
    _self.uuid = "DistortionEffect_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = _options.uuid
  }

  // add to renderer
  _renderer.add(_self)
  _self.type = "Effect"

  var source = _options.source
  var currentEffect = _options.effect
  var currentEffect = 12

  _self.update = function() {
    i += 0.001
    //renderer.customUniforms[_self.uuid+'_uvmap'] = { type: "v2", value: new THREE.Vector2( 1 - Math.random() * .5, 1 - Math.random() * .5 ) }

    // ONLY WORKS ON VIDEO SOURCE, IF IT WORKS
    renderer.customUniforms[source.uuid+'_uvmap_mod'] = { type: "v2", value: new THREE.Vector2( i, Math.cos(i) ) }
    renderer.customUniforms[source.uuid+'_uvmap'] = { type: "v2", value: new THREE.Vector2( 1 - Math.random() * .82, 1 - Math.random() * .82 ) }
  }

  _self.effect = function( _num ){
    if ( _num != undefined ) {
      currentEffect = _num
      renderer.customUniforms[_self.uuid+'_currentdistortioneffect'].value = currentEffect
      // update uniform ?
    }

    return currentEffect
  }
}

FeedbackEffect.prototype = new Effect(); // assign prototype to marqer
FeedbackEffect.constructor = FeedbackEffect;  // re-assign constructor

/**
 * @summary
 *   The color effect has a series of simple color effects
 *
 * @description
 *   Color effect allows for a series of color effect, mostly
 *   mimicing classic mixers like MX50 and V4
 *   ```
 *    1. black and white, 2. negative 1, 3. negative 2, 4. negative 3
 *    5. monocolor red, 6. monocolor blue 7. monocolor green, 8. monocolor yellow,
 *    9. monocolor turqoise, 10. monocolor purple, 11. sepia
 *   ```
 *
 * @example
 *   let myEffect = new FeedbackEffect( renderer, { source1: myVideoSource, effect: 1 });
 *
 * @constructor Effect#FeedbackEffect
 * @implements Effect
 * @param renderer:GlRenderer
 * @param options:Object
 * @author Sense Studios
 */

// fragment
// vec3 b_w = ( source.x + source.y + source.z) / 3
// vec3 amount = source.xyz + ( b_w.xyx * _alpha )
// col = vec3(col.r+col.g+col.b)/3.0;
// col = vec4( vec3(col.r+col.g+col.b)/3.0, _alpha );

function FeedbackEffect( _renderer, _options ) {

  // create and instance
  var _self = this;

  // set or get uid
  if ( _options.uuid == undefined ) {
    _self.uuid = "FeedbackEffect_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  } else {
    _self.uuid = _options.uuid
  }

  // add to renderer
  _renderer.add(_self)

  _self.type = "Effect"

  var source = _options.source
  var currentEffect = _options.effect
  var currentEffect = 12

  var dpr = window.devicePixelRatio;
  var textureSize = 128 * dpr;
  var data = new Uint8Array( textureSize * textureSize * 3 );
  //var dataTexture = new THREE.DataTexture( canvasElement );
  //var dataTexture = new THREE.DataTexture( data, textureSize, textureSize, THREE.RGBFormat );
  //dataTexture.minFilter = THREE.NearestFilter;
	//dataTexture.magFilter = THREE.NearestFilter;
	//dataTexture.needsUpdate = true;

  var canvasElement, canvasContext, effectsTexture


  _self.init = function() {

    // create canvas
    canvasElement = document.createElement('canvas');
    canvasElement.width = 1024;
    canvasElement.height = 1024;
    canvasElementContext = canvasElement.getContext( '2d' );
    canvasElementContext.fillStyle = "#FF0000";
    canvasElementContext.fillRect( 0, 0, 500,500)

    console.log("FeedbackEffect inits, with", _renderer)

    effectsTexture = new THREE.Texture( canvasElement );
    effectsTexture.wrapS = THREE.RepeatWrapping;
    effectsTexture.wrapT = THREE.RepeatWrapping;
    effectsTexture.repeat.set( 4, 4 );

    _renderer.customUniforms[_self.uuid+'_effectsampler'] = { type: "t", value: effectsTexture }
    _renderer.customUniforms[_self.uuid+'_currentfeedbackeffect'] = { type: "i", value: 100 }

    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D  '+_self.uuid+'_effectsampler;\n/* custom_uniforms */')
    _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform int  '+_self.uuid+'_currentfeedbackeffect;\n/* custom_uniforms */')


    if ( renderer.fragmentShader.indexOf('vec4 feedbackeffect ( vec4 src, int currentfeedbackeffect, vec2 vUv )') == -1 ) {

      _renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_helpers */',
`
  vec4 feedbackeffect ( vec4 src, int currentfeedbackeffect, vec2 vUv ) {
    if ( currentfeedbackeffect == 100 ) {
      //vec4 inbetween = vec4( src.r, src.g, src.b, vUv * 0.9. );
      //gl_Position = vec4( vec2(0.,0.), 0., 0.);
      //return inbetween.rrr;
      // return src;
      return ( texture2D( `+_self.uuid+`_effectsampler, vUv + vec2( 1., 0.99999999) ).rgb ) + src * 0.3;
      // return ( texture2D( `+_self.uuid+`_effectsampler, vUv  ).rgb * 1.4 + src * .8) * 0.5; //* vec3(.5, .5, .5
      // return ( texture2D( src, vUv ).rgb );
      // return ( texture2D( `+_self.uuid+`_effectsampler, vUv  ).rgb ) * src + src;

      vec4 tex = texture2D( `+_self.uuid+`_effectsampler, vUv * 2. ); //+ vec4( src.r, src.g, src.b, vUv * 2. );

      // return src.rrr;
      // tex.rgb = vec3(src.r, src.g, src.b);
      // tex.xy = vec2(1.0,1.0);
      // tex = tex + vec4( src.r, src.g, src.b, vUv * 2. );


      // * 0.52 + vec4( src * 0.52, vUv ) *
      // vec4 tex = vec4( src, vUv * .5 );
      // return mix( tex, `+_self.uuid+`_effectsampler, 0.).rgb;
      //return mix(tex.rgb, src.rgb, 1.);
    }

    // uniform float noiseScale;
    // uniform float time;
    // uniform float baseSpeed;
    // uniform sampler2D noiseTexture;

    if ( currentfeedbackeffect == 101 ) {
      // vec2 uvTimeShift = vUv + vec2( -0.7, 1.5 ) * time * baseSpeed;
      // vec4 noiseGeneratorTimeShift = texture2D( noiseTexture, uvTimeShift );
      // vec2 uvNoiseTimeShift = vUv + noiseScale * vec2( noiseGeneratorTimeShift.r, noiseGeneratorTimeShift.a );

      // _effectsampler
      // return  vec4 texture2D( baseTexture1, uvNoiseTimeShift )

      // https://stackoverflow.com/questions/19872524/threejs-fragment-shader-using-recycled-frame-buffers
      // http://labs.sense-studios.com/webgl/index4.html?r=sdad

      // return _effectsampler.rgb
      return src;
    }

    return src;
  }
`
  );
}

_renderer.fragmentShader = _renderer.fragmentShader.replace('/* custom_main */', '\
vec4 '+_self.uuid+'_output = feedbackeffect( '+source.uuid+'_output, ' + _self.uuid+'_currentfeedbackeffect' + ', vUv );\n  /* custom_main */')
} // init


var vector = new THREE.Vector2();
//var glcanvas = document.getElementById('glcanvas');
//var glcanvas = _renderer.glrenderer.context.canvas
var i = 0
_self.update = function() {
  i++
  // mixmode
  // blendmode
  // pod
  //console.log( "--", glcanvas.width, glcanvas.height )

  //glcanvas = _renderer.glrenderer.context.canvas
  //canvasElementContext.drawImage( glcanvas, Math.sin(i/20)*20-10, 1, glcanvas.width*1.0000000001, glcanvas.height*1.0000000001 );

  //vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
  //vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );

  //_renderer.copyFramebufferToTexture( vector, dataTexture );

  glcanvas = document.getElementById('glcanvas');
  canvasElementContext.drawImage( glcanvas, 0,0, glcanvas.width, glcanvas.height );
  if ( effectsTexture ) effectsTexture.needsUpdate = true;
}

/* ------------------------------------------------------------------------ */

/**
* @description
*  gets or sets the _effect_, there are 11 color EFFECTS available, numbered 1-11;
*  ```
*  1. BlackAndWhite (default),
*  2. Negative 1,
*  3. Negative 2,
*  4. Negative 3,
*  5. Monocolor red,
*  6. Monocolor blue,
*  7. Monocolor green,
*  8. Monocolor yellow,
*  9. Monocolor turqoise,
*  10. Monocolor purple,
*  11. Sepia,
*  ```
* @function Effect#FeedbackEffect#effect
* @param {number} effect index of the effect
*/


_self.effect = function( _num ){
  if ( _num != undefined ) {
    currentEffect = _num
    renderer.customUniforms[_self.uuid+'_currentfeedbackeffect'].value = currentEffect
    // update uniform ?
  }
  return currentEffect
  }
}

/**
 * @constructor Effect
 * @interface
 */

 function Effect( renderer, options ) {
   var _self = this

   /*
     renderer
   */

   _self.type = "Effect"

   // program interface
   _self.init =         function() {}
   _self.update =       function() {}
   _self.render =       function() {}
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
    var generatedOutput = "vec4(0.0,0.0,0.0,0.0)"
    _self.sources.forEach( function( source, index ) {
      generatedOutput += ' + ('+source.uuid+'_'+'output * '+_self.uuid+'_source'+index+'_'+'alpha )'
    });
    //generatedOutput += ";\n"

    // put it in the shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec4 '+_self.uuid+'_output = vec4( '+generatedOutput+'); \/* custom_main */')

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

  _self.setAll = function( _alpha = 0 ) {
    _self.sources.forEach( function( _num,i ) {
      renderer.customUniforms[_self.uuid+'_source'+i+'_'+'alpha'].value = _alpha
    })
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

  // hoist an own bpm here
  var currentBPM = 128
  var currentMOD = 1
  var currentBpmFunc = function() { return currentBPM; }
  _self.autoFade = false


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
    if ( renderer.fragmentShader.indexOf('vec4 blend ( vec4 src, vec4 dst, int blendmode )') == -1 ) {
      renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_helpers */',
`
vec4 blend ( vec4 src, vec4 dst, int blendmode ) {
  if ( blendmode ==  1 ) return src + dst;
  if ( blendmode ==  2 ) return src - dst;
  if ( blendmode ==  3 ) return src * dst;
  if ( blendmode ==  4 ) return min(src, dst);
  if ( blendmode ==  5)  return vec4((src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z)),1.0);
  if ( blendmode ==  6 ) return (src + dst) - 1.0;
  if ( blendmode ==  7 ) return max(src, dst);
  if ( blendmode ==  8 ) return (src + dst) - (src * dst);
  if ( blendmode ==  9 ) return vec4((src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z)), 1.0);
  if ( blendmode == 10 ) return src + dst;
  if ( blendmode == 11 ) return vec4((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)), 1.0);
  if ( blendmode == 12 ) return vec4((src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z))), 1.0);
  if ( blendmode == 13 ) return vec4((src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)), (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z)), 1.0);
  if ( blendmode == 14 ) return vec4((src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z))),1.0);
  if ( blendmode == 15 ) return 2.0 * src + dst - 1.0;
  if ( blendmode == 16 ) return vec4((src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), (src.x > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z),1.0);
  if ( blendmode == 17 ) return abs(dst - src);
  if ( blendmode == 18 ) return src + dst - 2.0 * src * dst;
  return src + dst;
}
/* custom_helpers */
`
      );
    }

//    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', `
//vec4 '+_self.uuid+'_output = vec4( blend( '+source1.uuid+'_output * '+_self.uuid+'_alpha1, '+source2.uuid+'_output * '+_self.uuid+'_alpha2, '+_self.uuid+'_blendmode ) );\n  /* custom_main */` )
//    }


    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', `
  vec4 `+_self.uuid+`_output = vec4( blend( vec4(`+ source1.uuid+`_output.r, ` + source1.uuid+`_output.g, ` + source1.uuid+`_output.b, ` + source1.uuid+`_output.a * `+ _self.uuid+`_alpha1 ), vec4(`+ source2.uuid+`_output.r, ` + source2.uuid+`_output.g, ` + source2.uuid+`_output.b, ` + source2.uuid+`_output.a * `+ _self.uuid+`_alpha2 ), `+_self.uuid+`_blendmode ) );\n  /* custom_main */`
)
//`vec4 `+_self.uuid+`_output = vec4( blend( `+source1.uuid+`_output * `+_self.uuid+`_alpha1, `+source2.uuid+`_output * `+_self.uuid+`_alpha2, `+_self.uuid+`_blendmode )

    }


  var starttime = (new Date()).getTime()
  var c = 0
  _self.update = function() {
    if ( _self.autoFade ) {
        // pod = currentBPM
        currentBPM = currentBpmFunc()
        c = ((new Date()).getTime() - starttime) / 1000;
        _self.pod( ( Math.sin( c * Math.PI * ( currentBPM * currentMOD ) / 120 ) + 1 ) )
    }
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
      // MIXMODE 1 normal mix
      if (mixmode == 1) {
        alpha1 = pod
        alpha2 = 1 - pod
      }

      // MIXMODE 2 hard mix
      if (mixmode == 2) {
        alpha1 = Math.round( pod )
        alpha2 = Math.round( 1-pod )
      }

      // MIXMODE 3 NAM mix
      if (mixmode == 3) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
        if ( alpha1 > 1 ) alpha1 = 1;
        if ( alpha2 > 1 ) alpha2 = 1;
      }

      // MIXMODE 4 FAM mix
      if (mixmode == 4) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
      }

      // MIXMODE 5 Non Dark mix
      if (mixmode == 5) {
        alpha1 = ( pod * 2 );
        alpha2 = 2 - ( pod * 2 );
        if ( alpha1 > 1 ) alpha1 = 1;
        if ( alpha2 > 1 ) alpha2 = 1;
        alpha1 += 0.36;
        alpha2 += 0.36;
      }

      // MIXMODE 6 left
      if (mixmode == 6) {
        alpha1 = 1;
        alpha2 = 0;
      }

      // MIXMODE 7 right
      if (mixmode == 7) {
        alpha1 = 0;
        alpha2 = 1;
      }

      // MIXMODE 8 center
      if (mixmode == 8) {
        alpha1 = 0.5;
        alpha2 = 0.5;
      }

      // MIXMODE 9 BOOM
      if (mixmode == 9) {
        alpha1 = 1;
        alpha2 = 1;
      }

      // MIXMODE X ADDITIVE MIX LEFT (use with lumkey en chromkey)
      if (mixmode == 10 ) {
        alpha1 = pod
        alpha2 = 1;
      }

      // MIXMODE X ADDITIVE MIX RIGHT (use with lumkey en chromkey)
      if (mixmode == 11 ) {
        alpha1 = 1;
        alpha2 = pod
      }

      // send alphas to the shader
      renderer.customUniforms[_self.uuid+'_alpha1'].value = alpha1;
      renderer.customUniforms[_self.uuid+'_alpha2'].value = alpha2;
    }
    return pod;
  }


  _self.bpm = function(_num) {
      if ( _num  != undefined ) currentBPM = _num
      return currentBPM
  }

  _self.bpmMod = function( _num ) {
    if ( _num  != undefined ) currentMOD = _num
    return currentMOD
  }

  _self.bindBpm = function( _func ) {
      currentBpmFunc = _func
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

 // TODO: maybe remove this node, and change it for something on the renderer?
 // like:
 //
 // renderer.output( node )
 // renderer.init()
 // renderer.render()

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
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\n  gl_FragColor = vec4( '+ source.uuid +'_output );\n')
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
vec4 get_source_`+_self.uuid+` ( int active_source, vec4 src1, vec4 src2 ) {
  if ( active_source ==  0 ) return src1;\
  if ( active_source ==  1 ) return src2;\
}
/* custom_helpers */
`
    );

    // renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'final_output = '+ source.uuid +'_output;\n  /* custom_main */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', '\
vec4 '+_self.uuid+'_output = get_source_'+_self.uuid+'('+_self.uuid+'_active_source, '+_self.sources[0].uuid +'_output, '+_self.sources[1].uuid +'_output );\n  /* custom_main */')
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
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha;\n/* custom_uniforms */')

    // add output to main function
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec4 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv ).rgba * '+_self.uuid+'_alpha );\n  /* custom_main */')

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
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha;\n/* custom_uniforms */')

    // add main
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec4 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv ).rgba * '+_self.uuid+'_alpha );\n  /* custom_main */')

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
  var color = { r:0.0, g:0.0, b:0.0, a: 1.0 }

  if ( options != undefined ) _options = options;

  _self.init = function() {
    console.log("init solid", _options)
    if (_options.color != undefined) color = _options.color

    // add uniforms
    renderer.customUniforms[_self.uuid + "_color"] = { type: "v4", value: new THREE.Vector4( color.r, color.g, color.b, color.a ) }

    // ad variables to shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_color;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')

    // add output to shader
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec4 '+_self.uuid+'_output = '+_self.uuid+'_color;\n  /* custom_main */')
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
  * @param {float} a - alpha value (optional)
  * @returns color
  */
  _self.color = function( c ) {
    if ( c != undefined ) {
      color = c
      if (color.a == undefined ) color.a = 1.0 // just to be sore
      renderer.customUniforms[_self.uuid + "_color"] = { type: "v4", value: new THREE.Vector3( color.r, color.g, color.b, color.a ) }
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
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha;\n/* custom_uniforms */')

    // add main
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec4 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv ).rgba * '+_self.uuid+'_alpha );\n  /* custom_main */')

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
*
* @summary
*  The videosource allows for playback of video files in the Mixer project
*
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

  // set options
  var _options = {};
  if ( options != undefined ) _options = options;

  _self.currentSrc = "/video/placeholder.mp4"
  _self.type = "VideoSource"
  _self.bypass = true;

  // create elements (private)
  var canvasElement, videoElement, canvasElementContext, videoTexture; // wrapperElemen
  var alpha = 1;

  // add to renderer
  renderer.add(_self)

  // initialize
  _self.init = function() {

    // FIXME: Can we clean this up and split into several functions

    console.log("init video source", _self.uuid)

    // create video element
    videoElement = document.createElement('video');
    videoElement.setAttribute("crossorigin", "anonymous")
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
    videoTexture.wrapS = THREE.RepeatWrapping;
    videoTexture.wrapT = THREE.RepeatWrapping;


    // videoTexture.minFilter = THREE.LinearFilter;

    // -------------------------------------------------------------------------
    // Set shader params
    // -------------------------------------------------------------------------

    // set the uniforms
    renderer.customUniforms[_self.uuid] = { type: "t", value: videoTexture }
    renderer.customUniforms[_self.uuid+'_alpha'] = { type: "f", value: alpha }
    renderer.customUniforms[_self.uuid+'_uvmap'] = { type: "v2", value: new THREE.Vector2( 0., 0. ) }
    renderer.customUniforms[_self.uuid+'_uvmap_mod'] = { type: "v2", value: new THREE.Vector2( 1., 1. ) }

    // add uniform
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform sampler2D '+_self.uuid+';\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec2 '+_self.uuid+'_uvmap;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec2 '+_self.uuid+'_uvmap_mod;\n/* custom_uniforms */')


    // add main
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec4 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv + '+_self.uuid+'_uvmap * vUv + '+_self.uuid+'_uvmap_mod ).rgba * '+_self.uuid+'_alpha );\n  /* custom_main */')


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

  var i = 0
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
    try {
      _self.currentSrc = _file
    }catch(e){
      console.log("VideoSource returned empty promise, retrying ...")
      return;
    }
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
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec4 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv ).rgba * '+_self.uuid+'_alpha );\n  /* custom_main */')

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
  //_self.cue =          function() {}      // still no solid solution
}
