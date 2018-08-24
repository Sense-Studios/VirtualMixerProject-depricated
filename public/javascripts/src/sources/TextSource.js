
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
    divElement.innerHTML = "<h1>IF I FELL IN EFFECT</h1>"
    //divElement.setAttribute("crossorigin","anonymous")
    //divElement.muted= true

    // set the source
    //if ( options.src == undefined ) {
    //  divElement.src = "//nabu-dev.s3.amazonaws.com/uploads/video/567498216465766873000000/720p_h264.mp4";
    //} else {
    //  divElement.src = options.src
    //}
    console.log('created div element: ', divElement )

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


  // var text = "the Duke, ..., will die, before these eyes..., and he'll know, ......, he'll know..........., ..., that it is I, ....., Baron Vladimir Harkonnen, ......, who, encompasses, his, doom!..............................., ..............,"
  var text = "BACK...., WITH THE, HEAVY WEIGHTS, ..., BACK...., WITH THE, HEAVY WEIGHTS, ..., JAMMS........,"
  //var text = "2 A BEGINNING, IS A VARY\n DELICATE TIME., KNOW THEN, THAT THE YEAR IS, TEN THOUSAND, ONE NINETY NINE., THE KNOWN UNIVERSE, IS RULED, BY THE PADASISHA EMPEROR, SHADDAMM VI........., MY FATHER."

  /*
  var text = "A beginning is, a very delicate time.,\
    Know then, that is, is the year, 10191.,\
    The known universe, is ruled, by the Padishah Emperor, Shaddam the Fourth,\
    my father., In this time, the most precious substance, in the universe, is the spice Melange.,\
    The spice, extends life., The spice, expands consciousness.,\
    A product of the Spice, the red Sapho juice, stains the lips, of the Mentats, but\
    allows them, to be, human computers, as thinking machines, have been outlawed.\
    The spice is vital, to space travel., The Spacing Guild, and its navigators,\
    who the spice, has mutated, over 4000 years, use the, orange spice gas,\
    which gives them, the ability, to fold space.,"
  */

/*
  That is, travel, to any part, of the universe, without moving.,
  Because the Guild controls all interplanetary travel,\
  they are the highest power in the Universe.\
  The Spice also plays a very secret role in the Bene Gesserit sisterhood,\
  of which I am a part. The sisterhood has been interfering with the marriages,\
  and the children thereof, of the great Houses of the Universe,\
  cleverly intermixing one bloodline with another to form the Kwisatz Haderach,\
  a super being. They plan to control this super being and use his powers for their own selfish purposes.\
  The breeding plan has been carried out in a strict manner for 90 generations.\
  The goal of the super being is in sight.\
  But now, so close to the prize, a Bene Gesserit woman, Jessica,\
  the bound concubine of Duke Leto Atreides,\
  who has been ordered to bear only daughters,\
  has given birth to a son. Oh, yes. I forgot to tell you.\
  The spice exists on only one planet in the entire universe.\
  A desolate, dry planet with vast deserts.\
  Hidden away within the rocks of these deserts are a people known as the Fremen,\
  who have long held a prophecy that a man would come,\
  a messiah, who would lead them to true freedom.\
  The planet is Arrakis, also known as Dune."
  */


  var text ="Fear...,\
    Is the, mind, killer,\
    ..................................,\
    In, the, space, of, the, heart..., is, a, place, of, no, FEAR...!,\
    ..................................................................,\
    A feeling, without limits, that you cannot, ENGINEER!,\
    ..................................................................,\
    Fear is, the mind, killer.......,\
    ..................................................................,\
    Whoever said, we're not, supposed to get, ECSTATIC?,\
    ..................................................................,\
    Fear is, the mind, killer.......,\
    ..................................,\
    ..................................,\
    NO........, FEAR.......,\
    ..................................,\
    ..................................,\
    NO........, FEAR.......,\
    ..................................,\
    Fear is, the mind, killer.......,\
    .............................................,\
    It's a, media-induced, comatose, ANAESTHETIC!,\
    .............................................,\
    Fear is, the, MIND, KILLER\
    ...........................................................................,\
    It's a, media-induced, comatose, ANAESTHETIC!,\
    .............................................,\
    Fear is, the mind, killer.......,\
    .............................................,\
    In, the, space, of, the, heart..., is, a, place, of, no, FEAR...!,\
    .............................................,\
    Fear is, the mind, killer.......,\
    .............................................,"  

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
