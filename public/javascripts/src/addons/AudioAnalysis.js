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

function AudioAnalysis( renderer ) {
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

  var context = new(window.AudioContext || window.webkitAudioContext);; // AudioContext object instance
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
  // audio.src = '/audio/fear_is_the_mind_killer_audio.mp3'
  // audio.src = '/audio/fulke_absurd.mp3'

  audio.src = '/proxy/nsb' // NSB RADIO --> 'http://37.220.36.53:7904';
  _self.audio_src = '/proxy/nsb'
  // audio.src = '/proxy/dunklenacht' // dunklenacht

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
    context.resume().then(() => {
      audio.play();
      console.log('Playback resumed successfully');
    });
    document.body.webkitRequestFullScreen()
    document.body.removeEventListener('click', forceFullscreen);
  }

  document.body.addEventListener('click', forceFullscreen)
  document.body.addEventListener('touchstart', forceFullscreen)

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
    audioanalysis1

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
