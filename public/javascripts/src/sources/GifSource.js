

GifSource.prototype = new Source(); // assign prototype to marqer
GifSource.constructor = GifSource;  // re-assign constructor


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


  // control interface

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
