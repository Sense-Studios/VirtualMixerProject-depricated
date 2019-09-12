GifSource.prototype = new Source(); // assign prototype to marqer
GifSource.constructor = GifSource;  // re-assign constructor

/**
 * @summary
 *  Allows for an (animated) GIF file to use as input for the mixer
 *  Giphy Example on codepen:
 *  <a href="https://codepen.io/xangadix/pen/vqmWzN" target="_blank">codepen</a>
 *
 * @description
 *  Allows for an (animated) GIF file to use as input for the mixer
 *
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

  // set type
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
     _self.currentSrc = 'https://virtualmixerproject.com/gif/a443ae90a963a657e12737c466ddff95.gif'
  } else {
    _self.currentSrc = options.src
  }

  // create elements (private)
  var canvasElement, gifElement, canvasElementContext, gifTexture, supergifelement; // wrapperElemen
  var alpha = 1;

  _self.init = function() {

    // create canvas
    canvasElement = document.createElement('canvas');
    canvasElement.width = 1024;
    canvasElement.height = 1024;
    canvasElementContext = canvasElement.getContext( '2d' );

    // create the texture
    gifTexture = new THREE.Texture( canvasElement );

    // set the uniforms on the renderer
    renderer.customUniforms[_self.uuid] = { type: "t", value: gifTexture }
    renderer.customUniforms[_self.uuid+'_alpha'] = { type: "f", value: alpha }

    // add uniforms to shader
    renderer.fragmentShader = renderer.fragmentShader.replace( '/* custom_uniforms */', 'uniform sampler2D '+_self.uuid+';\n/* custom_uniforms */' )
    renderer.fragmentShader = renderer.fragmentShader.replace( '/* custom_uniforms */', 'uniform vec4 '+_self.uuid+'_output;\n/* custom_uniforms */' )
    renderer.fragmentShader = renderer.fragmentShader.replace( '/* custom_uniforms */', 'uniform float '+_self.uuid+'_alpha;\n/* custom_uniforms */' )

    // add output to main function
    renderer.fragmentShader = renderer.fragmentShader.replace( '/* custom_main */', 'vec4 '+_self.uuid+'_output = ( texture2D( '+_self.uuid+', vUv ).rgba * '+_self.uuid+'_alpha );\n  /* custom_main */' )

    // expose gif and canvas
    _self.gif = supergifelement
    _self.canvas = canvasElement

    // actual gif stuff
    window.image_source = new Image()

    // $('body').append("<div id='gif_"+_self.uuid+"' rel:auto_play='1'></div>");
    gifElement = document.createElement('img')
    gifElement.setAttribute('id', 'gif_'+_self.uuid)
    gifElement.setAttribute('rel:auto_play', '1')
    supergifelement = new SuperGif( { gif: gifElement, c_w: "1024px", c_h: "576px" } );
    supergifelement.draw_while_loading = true

    // sup1.load();
    console.log(_self.uuid, " Load", _self.currentSrc, "..." )
    //supergifelement.load_url( _self.currentSrc )
    supergifelement.load_url( _self.currentSrc, function() {
      console.log("play initial source");
      supergifelement.play();
    } )

    console.log('Gifsource Loaded First source!', _self.currentSrc, "!")
     _self.bypass = false
  }

  var c = 0;
  _self.update = function() {

    // FIXME: something evil happened here.
    // if (_self.bypass == false) return
    try {
      // modulo is here because gif encoding is insanley expensive
      // TODO: MAKE THE MODULE SETTABLE.
      if (c%6 == 0) {
        canvasElementContext.clearRect(0, 0, 1024, 1024);
        canvasElementContext.drawImage( supergifelement.get_canvas(), 0, 0, 1024, 1024  );
        if ( gifTexture ) gifTexture.needsUpdate = true;
      }
      c++;
    }catch(e){
      // not yet
    }
  }

  _self.render = function() {
    return gifTexture
  }

  // Interface helpers ---------------------------------------------------------
  _self.src = function( _file ) {
    if ( _file == undefined ) return _self.currentSrc

    console.log("load new src: ", _file)
    _self.currentSrc = _file
    supergifelement.pause()
    supergifelement.load_url( _file, function() {
      console.log("play gif", _file);
      supergifelement.play();
    } )
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

  }
  // seconds
  _self.duration =     function() { return supergifelement.get_length() }
};
