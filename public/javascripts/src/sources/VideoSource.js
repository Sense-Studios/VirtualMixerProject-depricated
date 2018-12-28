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
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec3 '+_self.uuid+'_output;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec2 '+_self.uuid+'_uvmap;\n/* custom_uniforms */')
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_uniforms */', 'uniform vec2 '+_self.uuid+'_uvmap_mod;\n/* custom_uniforms */')


    // add main
    renderer.fragmentShader = renderer.fragmentShader.replace('/* custom_main */', 'vec3 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv + '+_self.uuid+'_uvmap * vUv + '+_self.uuid+'_uvmap_mod ).xyz * '+_self.uuid+'_alpha );\n  /* custom_main */')


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
