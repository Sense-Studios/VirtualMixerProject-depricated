// -----------------------------------------------------------------------------
// Set up socket
// -----------------------------------------------------------------------------

var socket1 = new SocketController();
var utils = new Utils()
var bpm = 128
var client_status = {}

// get welcom
socket1.addEventListener('welcome', function(e) { console.log("got welcome: ", e ) })

// get status
socket1.addEventListener('status_update', function(e) {
  client_status = e
  document.querySelectorAll('.sync > button').forEach( function(_elm) { _elm.classList.remove('red', 'gree', 'yellow'); _elm.classList.add('green') } )

  // update status!
  bpm = Math.round(e.bpm*10)/10
  orig_bpm = Math.round(e.bpm*10)/10
  document.querySelectorAll('.bpm_display .display').forEach( (elm) => elm.innerText = Math.round(bpm) )
  if (e.autofade) {
    document.querySelectorAll('.tap').forEach( ( _butt )=> _butt.classList.add('autofade') )
  }else{
    document.querySelectorAll('.tap').forEach( ( _butt )=> _butt.classList.remove('autofade') )
  }
})

// -----------------------------------------------------------------------------
// helpers

// get latest client id
var get_client_id = function() {
  return document.getElementById('client_id').value
}

// for any control button, resends the command to the client
var control_button = function( _command ) {
  socket1.send( get_client_id(), _command, {} )
}

// get element by id
function elm(_elm) {
  return document.getElementById(_elm);
}

// tap beat
function tap(_elm)  {
  _elm.longpressstart = (new Date).getTime()
  _elm.longpress = setTimeout( longpress, 400, _elm )
  _elm.onmouseup = _elm.ontouchend = function(evt) {
    evt.preventDefault()
    socket1.send( get_client_id(), "tap", [] );
    socket1.send( get_client_id(), 'get_mixer_status', { request_id: socket1.target } )
    clearTimeout(_elm.longpress )
  }

  function longpress(_elm) {
    console.log("tap longpress")
    clearTimeout(_elm.longpress )
    socket1.send( get_client_id(), "autofade", [] );
  }
}

// sets autofading on or of, and gets the status
function sync(_elm) {
  socket1.send( get_client_id(), 'get_mixer_status', { request_id: socket1.target } )

  if ( elm('client_id').value.length != 4 ) {
    document.querySelectorAll('.sync > button').forEach( function(_elm) {
      _elm.classList.remove('red', 'green', 'yellow'); _elm.classList.add('red')
    })
  }else{
    document.querySelectorAll('.sync > button').forEach( function(_elm) {
      _elm.classList.remove('red', 'green', 'yellow'); _elm.classList.add('yellow')
    })
  }
}

// -----------------------------------------------------------------------------
// set up mixer aand efects
// -----------------------------------------------------------------------------

setTimeout( function() {

  // just saying, that that array in the socket.send is not neccesary, I'm an idiot
  elm('main_pod').oninput = function() {           socket1.send( get_client_id(), "main_pod",        [elm('main_pod').value] ); }
  elm('mixmode_select').onchange = function() {    socket1.send( get_client_id(), "mixmode",         [elm('mixmode_select').value] ); }
  elm('blendmode_select').onchange = function() {  socket1.send( get_client_id(), "blendmode",       [elm('blendmode_select').value] ); }

  // deprecated
  // elm('sync').onclick = function() {            socket1.send( get_client_id(), "sync",            [] ); }
  // elm('tap').onclick = function() {             socket1.send( get_client_id(), "tap",             [] ); }

  // get out all the brackets there not needed
  elm('effects_a1').onchange = function() {        socket1.send( get_client_id(), "effecta_1",       [elm('effects_a1').value] ); }
  elm('effects_a1_extra').onchange = function() {  socket1.send( get_client_id(), "effecta_1_extra", [elm('effects_a1_extra').value] ); }
  elm('effects_a2').onchange = function() {        socket1.send( get_client_id(), "effecta_2",       [elm('effects_a2').value] ); }
  elm('effects_a2_extra').onchange = function() {  socket1.send( get_client_id(), "effecta_2_extra", [elm('effects_a2_extra').value] ); }
  elm('effects_a3').onchange = function() {        socket1.send( get_client_id(), "effecta_3",       [elm('effects_a3').value] ); }
  elm('effects_a3_extra').onchange = function() {  socket1.send( get_client_id(), "effecta_3_extra", [elm('effects_a3_extra').value] ); }
  elm('effects_a4').onchange = function() {        socket1.send( get_client_id(), "effecta_4",       [elm('effects_a4').value] ); }
  elm('effects_a4_extra').onchange = function() {  socket1.send( get_client_id(), "effecta_4_extra", [elm('effects_a4_extra').value] ); }

  elm('effects_b1').onchange = function() {        socket1.send( get_client_id(), "effectb_1",       [elm('effects_b1').value] ); }
  elm('effects_b1_extra').onchange = function() {  socket1.send( get_client_id(), "effectb_1_extra", [elm('effects_b1_extra').value] ); }
  elm('effects_b2').onchange = function() {        socket1.send( get_client_id(), "effectb_2",       [elm('effects_b2').value] ); }
  elm('effects_b2_extra').onchange = function() {  socket1.send( get_client_id(), "effectb_2_extra", [elm('effects_b2_extra').value] ); }
  elm('effects_b3').onchange = function() {        socket1.send( get_client_id(), "effectb_3",       [elm('effects_b3').value] ); }
  elm('effects_b3_extra').onchange = function() {  socket1.send( get_client_id(), "effectb_3_extra", [elm('effects_b3_extra').value] ); }
  elm('effects_b4').onchange = function() {        socket1.send( get_client_id(), "effectb_4",       [elm('effects_b4').value] ); }
  elm('effects_b4_extra').onchange = function() {  socket1.send( get_client_id(), "effectb_4_extra", [elm('effects_b4_extra').value] ); }

  elm('speed_a').onchange = function() {           socket1.send( get_client_id(), "speed_a",         [elm('speed_a').value] ); }
  elm('speed_b').onchange = function() {           socket1.send( get_client_id(), "speed_b",         [elm('speed_b').value] ); }

  // bpm adjustment knobs
  var orig_bpm = 128
  document.querySelectorAll('.bpm_adjust').forEach( function(_elm, i) {
    _elm.getElementsByClassName('knob-input__input')[0].onchange = function(evt) {
      bpm = orig_bpm * this.value
      document.querySelectorAll('.bpm_display .display').forEach( (elm) => elm.innerText = Math.round(bpm) )
    }

    _elm.getElementsByClassName('knob-input__input')[0].onmouseup = _elm.getElementsByClassName('knob-input__input')[0].ontouchend = function(evt) {
      socket1.send( get_client_id(), "bpm", bpm );
    }
  })

  /*
  elm('effectb_1').oninput = function() {  socket1.send( get_client_id(), "effectb_1", [elm('effectb_1').value] ); }
  elm('effectb_1_extra').oninput = function() {  socket1.send( get_client_id(), "effectb_1_extra", [elm('effectb_1_extra').value] ); }
  */

  function clear_state() {
    elm('movies_container').classList.remove('state_1', 'state_2', 'state_3')
    elm('mixer_container').classList.remove('state_1', 'state_2', 'state_3')
    elm('sequencer_container').classList.remove('state_1', 'state_2', 'state_3')
  }

  elm('mixer_left').onclick = function() {
    clear_state()
    elm('movies_container').classList.add('state_1')
    elm('mixer_container').classList.add('state_1')
    elm('sequencer_container').classList.add('state_1')
  }

  elm('mixer_right').onclick = function() {
    clear_state()
    elm('movies_container').classList.add('state_3')
    elm('mixer_container').classList.add('state_3')
    elm('sequencer_container').classList.add('state_3')
  }

  elm('movies_right').onclick = function() {
    clear_state()
    elm('movies_container').classList.add('state_2')
    elm('mixer_container').classList.add('state_2')
    elm('sequencer_container').classList.add('state_2')
  }

  elm('sequencer_left').onclick = function() {
    clear_state()
    elm('movies_container').classList.add('state_2')
    elm('mixer_container').classList.add('state_2')
    elm('sequencer_container').classList.add('state_2')
  }


  elm('blackout_button').onclick = function() {
    // socket1.send( get_client_id(), "blackout", [elm('effects_b41_extra').value] );
  }

  elm('whiteout_button').onclick = function() {
    // socket1.send( get_client_id(), "whiteout", [elm('effects_b41_extra').value] );
  }

}, 200)

// -----------------------------------------------------------------------------
// set up movies
// -----------------------------------------------------------------------------

// little helper for finding thumbnails
function replace_rules( _str ) {
  _str = _str.replace('480p_webM.webm', 'medium/3.png')
  _str = _str.replace('720p_webm.webm', 'medium/3.png')
  _str = _str.replace('720p_h264.mp4', 'medium/3.png')
  _str = _str.replace('.webm', '.png')
  _str = _str.replace('.mp4', '.png')
  return _str
}

// load set A
utils.get('/sets/programs_awesome.json', function(e) {
  var html = ""
  JSON.parse(e).forEach( function( value, key ) {
    console.log(" ===> ", value, replace_rules(value))
    html += '<div class="thumbnail" data-key="'+key+'"><img src="'+replace_rules(value)+'" ></div>'
  })
  elm('thumbnails_a').innerHTML = html

  document.querySelectorAll('#thumbnails_a .thumbnail').forEach( function(_elm) {
    _elm.onclick = function() {
      if ( this.className.indexOf('active') != -1 ) {
        socket1.send(get_client_id(), "jump_a", [])
      }else{
        document.querySelectorAll('#thumbnails_a .thumbnail').forEach( function(_elm2 ) { _elm2.classList.remove('active') } )
        this.classList.add('active')
        socket1.send(get_client_id(), "change_a", [this.dataset.key])
      }
    }
  })
})

// load set B
utils.get('/sets/programs_runner.json', function(e) {
  var html = ""
  JSON.parse(e).forEach( function( value, key ) {
    //console.log("repolace: ", value)
    //console.log("... ", value.replace('720p_h264.mp4', 'medium/3.png') )
    html += '<div class="thumbnail" data-key="'+key+'"><img src="'+value.replace('720p_h264.mp4', 'medium/3.png')+'" ></div>'
  })
  elm('thumbnails_b').innerHTML = html

  document.querySelectorAll('#thumbnails_b .thumbnail').forEach( function(_elm) {
    _elm.onclick = function() {
      if ( this.className.indexOf('active') != -1 ) {
      }else{
        document.querySelectorAll('#thumbnails_b .thumbnail').forEach( function(_elm2 ) { _elm2.classList.remove('active') } )
        this.classList.add('active')
        socket1.send(get_client_id(), "change_b", [this.dataset.key])
      }
    }

    /*
    _elm.ontouchstart = _elm.onmousedown = function() {
      console.log("down")
      _elm.longpressstart = (new Date).getTime()
      _elm.currentduration = 0 // -- send out how much the video should go back?
      try { clearInterval(_elm.longpress) } catch(e) {}
      _elm.longpress = setInterval( function() {

      }, 200 )
    }

    _elm.ontouchend = _elm.onmouseup = function() {
      console.log("up")
      if (false){
        _elm.longpressend = (new Date).getTime()
      }else{
        socket1.send(get_client_id(), "jump_b", [])
      }
    }
    */

  })
})

// -----------------------------------------------------------------------------
// Set Up Sequencer
// -----------------------------------------------------------------------------

var sec = 0
var mod = 1
var bpm_float = 0
var c = 0
var beat = false
var starttime = (new Date()).getTime()

var seq_c = 0
var bank_c = -1
var bank_c_a = -1
var bank_c_b = -1

// temp/ test
var test_bank = 0

// -----------------------------------------------------------------------------
// This is all for BANK A
var sequence_a = [
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ]
]

var active_bank_a = [0,0,0,0,0,0,0]

var sequencer_a_rows = sequence_a.length
var sequencer_rows = sequence_a.length // depricated

var selected_button_a = -1
var selected_bank_a = -1

// -----------------------------------------------------------------------------
// This is all for BANK B
var sequence_b = [
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ],
  ["", "", "", "", "", "", "", "", "" ]
]

var active_bank_b = [0,0,0,0,0,0,0]

var sequencer_b_rows = sequence_a.length
var sequencer_rows = sequence_a.length // depricated

var selected_button_b = -1
var selected_bank_b = -1
// -----------------------------------------------------------------------------

// play/pause
function toggleSequencer( _elm ) {
  if ( _elm.dataset.paused == "true" ) {
    _elm.dataset.paused = "false"
    _elm.classList.add('green')
  } else {
    _elm.dataset.paused = "true"
    _elm.classList.remove('green')
  }
}

function init() {
  var template = elm('seq_button_template')
  for (var i=0; i < sequencer_rows; i++) {

    var clone_a = document.importNode( template.content, true );
    // if ( i%4 == 0 ) {seq_butt}
    // clone_a.querySelectorAll('.num')[0].innerText = i + 1
    clone_a.querySelectorAll('.button')[0].id = "button_a_"  + i
    clone_a.querySelectorAll('.button')[0].dataset.sequence = "a"
    clone_a.querySelectorAll('.button')[0].dataset.sequence_id = i
    clone_a.querySelectorAll('.light')[0].classList.add('light_a_' + i)
    clone_a.querySelectorAll('.bank')[0].dataset.sequence_id = i
    elm('seq_butts_a').appendChild( clone_a )

    var clone_b = document.importNode( template.content, true );
    //clone_b.querySelectorAll('.num')[0].innerText = i + 1
    clone_b.querySelectorAll('.button')[0].id = "button_b_"  + i
    clone_b.querySelectorAll('.button')[0].dataset.sequence = "b"
    clone_b.querySelectorAll('.button')[0].dataset.sequence_id = i
    clone_b.querySelectorAll('.light')[0].classList.add('light_b_' + i)
    clone_b.querySelectorAll('.bank')[0].dataset.sequence_id = i
    elm('seq_butts_b').appendChild( clone_b )
  }
}

// start!
init()
doNextBank()
redraw_sequencer()

// listen for updates of sequence markers and
// set them in the appropriate button -- AND BANK
socket1.addEventListener('sequence_set', function(e) {
  console.log('got sequence back?', e)
  //elm(e.button_id).innerText = Math.round(e.time*1000)/1000
  //elm(e.button_id).dataset.timecode = e.time
  //elm(e.button_id).nextElementSibling.classList.add('green')
  sequence_a[ e.sequence[0] ][ e.sequence[1] ] = e.time
  console.log(sequence_a)
  redraw_sequencer()
})

// set sequence:
function sequenceButton( _elm ) {
  console.log("Sequence mouse down", _elm)

  start_time = (new Date).getTime()
  _elm.long_press = setTimeout( function() {
    clearTimeout(_elm.long_press)
    longPress(_elm)
  }, 350 )

  _elm.onmouseup = _elm.ontouchend = function(evt) {
    evt.preventDefault()
    console.log("Sequence mouse up")
    clearInterval(_elm.long_press)
    normalPress(_elm)
    _elm.onmouseup = null
  }

  function longPress(_elm) {
    console.log("Sequence long press!")
    _elm.onmouseup = null
    _elm.previousElementSibling.classList.toggle('yellow')

    // -------------------------------------------------------------------------
    // THIS NEEDS TO HOOK UP
    // when selected allow tweaking with knob
    // -------------------------------------------------------------------------
  }

  function normalPress(_elm) {
    console.log("sequence normal press")
    // reset current bank
    _elm.onmouseup = null
    var le_bank = selected_bank_a
    if ( selected_bank_a == -1 ) le_bank = bank_c
    if ( le_bank == -1 ) { console.log("could not find bank"); return }

    if ( sequence_a[ le_bank ][ _elm.dataset.sequence_id ] != "" ) {
      sequence_a[ le_bank ][ _elm.dataset.sequence_id ] = ""
    } else {
      socket1.send( get_client_id(), 'sequence_button', { button_id: _elm.id, target_id: socket1.target, timestamp: start_time - 0.2 , sequence: [ le_bank, Number(_elm.dataset.sequence_id) ]  } )
    }

    redraw_sequencer()
  }
}

// switch bank:
function bankButton( _elm ) {
  console.log(" bankButton mouse down", _elm)

  start_time = (new Date).getTime()
  _elm.long_press = setTimeout( function() {
    clearTimeout(_elm.long_press)
    longPress(_elm)
  }, 350 )

  _elm.onmouseup = _elm.ontouchend = function() {
    console.log(" bankButton mouse up")
    clearInterval(_elm.long_press)
    normalPress(_elm)
    _elm.onmouseup = null
  }

  // switch on/off active bank
  function longPress(_elm) {
    _elm.onmouseup = null
    console.log("bankButton long press!")
    if ( active_bank_a[_elm.dataset.sequence_id] == 1 ) {
      active_bank_a[_elm.dataset.sequence_id] = 0
    }else{
      active_bank_a[_elm.dataset.sequence_id] = 1
    }
    redraw_sequencer()
  }

  function normalPress(_elm) {
    _elm.onmouseup = null

    // select
    var current_sequence = "a"
    if ( _elm.id.indexOf('button_b') ) current_sequence = "b"
    document.querySelectorAll('.sequence_buttons_a .bank').forEach( (_bank, i)=> { if ( _bank != _elm ) _bank.classList.remove('yellow') } )
    _elm.classList.toggle('yellow')


    if (_elm.classList.contains('yellow')) {
      selected_bank_a = _elm.dataset.sequence_id
    } else {
      selected_bank_a = -1
    }

    // redrawwith new selected bank
    redraw_sequencer()
  }
}

// copy sequence after longpress
// TODO

// helper
// check active banks, if no bank is active, everythings off
// only walk through banks that are actve right now
function doNextBank() {
  console.log("figure out next bank")
  if ( active_bank_a.includes(1) ) {
    bank_c++
    if (bank_c >= active_bank_a.length) bank_c = 0
    while( active_bank_a[bank_c]  == 0 ) {
      bank_c++
      if (bank_c >= active_bank_a.length) bank_c = 0
    }

  }else{
    bank_c = -1
  }
}

// resets and redraws the lights based on sequence array and selection
// ignores walkers (blue) -- note, we don't actually redraw, we just change classes
function redraw_sequencer() {

  // reset
  document.querySelectorAll('.seq_butt .light').forEach( (_elm)=> _elm.classList.remove('red','green','yellow','blinking') )
  document.querySelectorAll('.seq_butt .bank').forEach( (_elm)=> _elm.classList.remove('red','green','yellow','blinking') )



  // set bank and buttons
  document.querySelectorAll('.sequence_buttons_a .seq_butt .bank').forEach( function(_elm, i) {

    if ( sequence_a[i].join('').length > 0 ) {
      // has elements
      if ( active_bank_a[i] == 1 ) {
        _elm.classList.add('green')
      } else {
        _elm.classList.add('red')
      }
    }else{
      // no elements
      if ( active_bank_a[i] ) {
        _elm.classList.add('green')
      } else {
        //
      }
    }

    if ( i == selected_bank_a ) {
      _elm.classList.add('yellow')
    }

    if ( i == selected_bank_a && i == bank_c ) {
      _elm.classList.add('blinking')
    }

    if ( selected_bank_a != -1) {
      sequence_a[selected_bank_a].forEach( function(val, i) {
        var _elm = document.querySelectorAll('.seq_butt .button')[i]
        _elm.dataset.timecode = val
        _elm.innerText = val
        if ( val != "" ) _elm.previousElementSibling.classList.add('green')
      })
    } else if( bank_c != -1) {
      // console.log("use bank", bank_c)
      sequence_a[bank_c].forEach( function(val, i) {
        var _elm = document.querySelectorAll('.seq_butt .button')[i]
        _elm.dataset.timecode = val
        _elm.innerText = val
        if ( val != "" ) _elm.previousElementSibling.classList.add('green')
      })
    }
  })
}

// runs from the upate interval
// updates on beat (every bpm tic)
// note: use for scrolling? p_elm.scrollTo( 0, current_a.offsetTop - p_elm.offsetTop );
function do_beat() {

  // bpm taps
  document.querySelectorAll('.tap > button').forEach( (_elm)=> client_status.autofade ? _elm.classList.toggle('red') : _elm.classList.remove('red') )

  // sequencer
  if ( elm('sequencer_play_pause').dataset.paused == "true" ) return

  // clear lights and bunk
  document.querySelectorAll(".seq_butt .button").forEach( (elm) => elm.previousElementSibling.classList.remove('blue') )
  document.querySelectorAll(".seq_butt .bank").forEach( (elm) => elm.classList.remove('blue') )

  if ( ( selected_bank_a == -1 || selected_bank_a == bank_c ) && bank_c != -1 ) {
    var current_a = elm("button_a_" + seq_c)
    current_a.previousElementSibling.classList.add('blue')
  }

  if ( bank_c != -1 && seq_c != -1 ) {
    var to_send = sequence_a[ bank_c ][ seq_c ]
    if ( to_send != "" ) {
      socket1.send( get_client_id(), 'sec_a', sequence_a[ bank_c ][ seq_c ] - 0.2 )
      console.log("send A: ", sequence_a[ bank_c ][ seq_c ] - 0.2 )
    }
  }

  // if ( current_b.dataset.timecode != "" ) {
  //   socket1.send( get_client_id(), 'sec_b', current_b.dataset.timecode - 0.2  )
  //   console.log("send B: ", current_b.dataset.timecode - 0.2 )
  // }

  seq_c += 1
  if ( seq_c >= sequencer_rows ) {
    seq_c = 0
    doNextBank()
  }

  if (bank_c != -1) {
    next_blue = document.querySelectorAll(".sequence_buttons_a .seq_butt .bank")[bank_c]
    next_blue.classList.add('blue')
  }

  redraw_sequencer()
}

// the update function
function update() {
  c = ((new Date()).getTime() - starttime) / 1000;
  sec = c * Math.PI * ( bpm * mod ) / 60 // * _self.mod
  bpm_float = ( Math.sin( sec ) + 1 ) / 2

  if ( bpm_float > 0.9 && !beat ) {
    do_beat()
    beat = true
  }

  if ( bpm_float < 0.1 && beat ) {
    do_beat()
    beat = false
  }

 requestAnimationFrame( update )
}
update()

// -----------------------------------------------------------------------------
// Setup Knobs
// -----------------------------------------------------------------------------

function getSupportedPropertyName(properties) {
  for (var i = 0; i < properties.length; i++)
    if (typeof document.body.style[properties[i]] !== 'undefined')
      return properties[i];
  return null;
}

function getTransformProperty() {
  return getSupportedPropertyName([
    'transform', 'msTransform', 'webkitTransform', 'mozTransform', 'oTransform'
  ]);
}

var transformProp = getTransformProperty();

var envelopeKnobs = [...document.querySelectorAll('.fl-studio-envelope__knob.envelope-knob')];
var envelopeKnobs = envelopeKnobs.map((el, idx) => new KnobInput(el, {
  visualContext: function() {
    this.indicatorRing = this.element.querySelector('.indicator-ring');
    var ringStyle = getComputedStyle(this.element.querySelector('.indicator-ring-bg'));
    this.r = parseFloat(ringStyle.r) - (parseFloat(ringStyle.strokeWidth) / 2);
    this.indicatorDot = this.element.querySelector('.indicator-dot');
    this.indicatorDot.style[`${transformProp}Origin`] = '20px 20px';
  },
  updateVisuals: function(norm) {
    var theta = Math.PI*2*norm + 0.5*Math.PI;
    var endX = this.r*Math.cos(theta) + 20;
    var endY = this.r*Math.sin(theta) + 20;
    // using 2 arcs rather than flags since one arc collapses if it gets near 360deg
    this.indicatorRing.setAttribute('d',`M20,20l0,${this.r}${norm> 0.5?`A${this.r},${this.r},0,0,1,20,${20-this.r}`:''}A-${this.r},${this.r},0,0,1,${endX},${endY}Z`);
    this.indicatorDot.style[transformProp] = `rotate(${360*norm}deg)`;
  },
  id: el.dataset.id,
  min: 0,
  max: 100,
  initial: 50
}));

var tensionKnobs = [...document.querySelectorAll('.fl-studio-envelope__knob.tension-knob')];
var tensionKnobs = tensionKnobs.map((el, idx) => new KnobInput(el, {
  visualContext: function() {
    this.indicatorRing = this.element.querySelector('.indicator-ring');
    var ringStyle = getComputedStyle(this.element.querySelector('.indicator-ring-bg'));
    this.r = parseFloat(ringStyle.r) - (parseFloat(ringStyle.strokeWidth) / 2);
  },
  updateVisuals: function(norm) {
    var theta = Math.PI*2*norm + 0.5*Math.PI;
    var endX = this.r*Math.cos(theta) + 20;
    var endY = this.r*Math.sin(theta) + 20;
    this.indicatorRing.setAttribute('d',`M20,20l0,-${this.r}A${this.r},${this.r},0,0,${norm<0.5?0:1},${endX},${endY}Z`);
  },
  id: el.dataset.id,
  min: Number(el.dataset.min),
  max: Number(el.dataset.max),
  initial: 1
}));
