// -----------------------------------------------------------------------------
// Set up socket
// -----------------------------------------------------------------------------

var socket1 = new SocketController();
var utils = new Utils()
var bpm = 128
var orig_bpm = 128
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
  console.log("tap")
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
  document.querySelectorAll('.bpm_adjust').forEach( function(_elm) {
    _elm.getElementsByClassName('knob-input__input')[0].onchange = function() {
      bpm = orig_bpm * this.value
      document.querySelectorAll('.bpm_display .display').forEach( function(_display) { _display.innerText = Math.round(bpm) } )
    }

    _elm.getElementsByClassName('knob-input__input')[0].onmouseup = _elm.getElementsByClassName('knob-input__input')[0].ontouchend = function() {
      socket1.send( get_client_id(), "bpm", bpm );
    }
  })

  /*
  elm('effectb_1').oninput = function() {  socket1.send( get_client_id(), "effectb_1", [elm('effectb_1').value] ); }
  elm('effectb_1_extra').oninput = function() {  socket1.send( get_client_id(), "effectb_1_extra", [elm('effectb_1_extra').value] ); }
  */

  // ---------------------------------------------------------------------------
  // Main Navigation
  // ---------------------------------------------------------------------------
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

  // TODO
  elm('blackout_button').onmousedown = elm('blackout_button').ontouchstart = function() {
    // socket1.send( get_client_id(), "blackout", [elm('effects_b41_extra').value] );
    socket1.send( get_client_id(), "blackout", [] );
  }

  elm('whiteout_button').onmousedown = elm('whiteout_button').ontouchstart = function() {
    // socket1.send( get_client_id(), "whiteout", [elm('effects_b41_extra').value] );
    socket1.send( get_client_id(), "whiteout", [] );
  }

  elm('blackout_button').onmouseup = elm('blackout_button').ontouchend = elm('whiteout_button').onmouseup = elm('whiteout_button').ontouchend = function() {
    // transout
    socket1.send( get_client_id(), "transout", [] );
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

function loadSetOntoElement( _set, _elm, _command1, _command2 ) {
  utils.get( _set , function(e) {
    var html = ""
    JSON.parse(e).forEach( function( value, key ) {
      console.log(" ===> ", value, replace_rules(value))
      html += '<div class="thumbnail" data-key="'+key+'"><img src="'+replace_rules(value)+'" ></div>'
    })
    _elm.innerHTML = html

    _elm.querySelectorAll('.thumbnail').forEach( function(_thumb) {
      _thumb.onclick = function() {
        if ( this.className.indexOf('active') != -1 ) {
          socket1.send(get_client_id(), _command1, [])
        }else{
          _elm.querySelectorAll('.thumbnail').forEach( function( _thumb2 ) { _thumb2.classList.remove('active') } )
          this.classList.add('active')
          socket1.send(get_client_id(), _command2, [this.dataset.key])
        }
      }
    })
  })
}

function loadExpandedSetOntoElement( _set, _elm, _command1, _command2 ) {
  var html = ""
  JSON.parse(_set).forEach( function( value, key ) {
    console.log(" ===> ", value, replace_rules(value))
    html += '<div class="thumbnail" data-key="'+key+'"><img src="'+replace_rules(value)+'" ></div>'
  })
  _elm.innerHTML = html

  _elm.querySelectorAll('.thumbnail').forEach( function(_thumb) {
    _thumb.onclick = function() {
      if ( this.className.indexOf('active') != -1 ) {
        socket1.send( get_client_id(), _command1, [] )
      }else{
        _elm.querySelectorAll('.thumbnail').forEach( function( _thumb2 ) { _thumb2.classList.remove('active') } )
        this.classList.add('active')
        socket1.send( get_client_id(), _command2, [this.dataset.key] )
      }
    }
  })
}

elm('change_set').onclick = function(_evt)  {
  document.querySelector('.modal').classList.remove('hidden')
}

elm('close_button').onclick = function(_evt)  {
  document.querySelector('.modal').classList.add('hidden')
}

elm('select_set').onchange = function(_evt) {
  utils.get( this.value , function(e) {
    elm('set_input').innerText = e
  })
}

elm('load_into_a').onclick = function(_evt)  {
  document.querySelector('.modal').classList.add('hidden')
  loadExpandedSetOntoElement( elm('set_input').innerText, elm('thumbnails_a'), 'jump_a', "change_a" )
  console.log("send to a1")
  socket1.send( get_client_id(), 'update_set_a', elm('set_input').innerText )
}

elm('load_into_b').onclick = function(_evt)  {
  document.querySelector('.modal').classList.add('hidden')
  loadExpandedSetOntoElement( elm('set_input').innerText, elm('thumbnails_b'), 'jump_b', "change_b" )
  console.log("send to b2")
  socket1.send( get_client_id(), 'update_set_b', elm('set_input').innerText )
}

function loadCustomData( _target ) {
    _elm(custom)
}

loadSetOntoElement( '/sets/programs_awesome.json', elm('thumbnails_a'), 'jump_a', "change_a" )
loadSetOntoElement( '/sets/programs_runner.json', elm('thumbnails_b'), 'jump_b', "change_b" )

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
var bank_c = -1 // depricated

var sequencer_rows = 8

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

// ---

var adjust_time = 0
function create_sequence( _elm ) {

  // for lutsers
  // id element  == string, document.getElementById( _elm )

  // attach date
  _elm.sequence = [
    ["", "", "", "", "", "", "", "" ],
    ["", "", "", "", "", "", "", "" ],
    ["", "", "", "", "", "", "", "" ],
    ["", "", "", "", "", "", "", "" ],
    ["", "", "", "", "", "", "", "" ],
    ["", "", "", "", "", "", "", "" ],
    ["", "", "", "", "", "", "", "" ],
    ["", "", "", "", "", "", "", "" ]
  ]

  _elm.active_bank = [ 1, 0, 0, 0, 0, 0, 0, 0 ]

  _elm.bank_c = -1            // current bank
  _elm.seq_c = -1             // current sequence
  _elm.selected_button = -1   // current selection, if any
  _elm.selected_sequence = -1 // current selection, if any
  _elm.selected_bank = -1     // current bank selected, if any
  _elm.debug = false

  // init
  var template = elm('seq_button_template') // might be an options, non?

  for (var i=0; i < _elm.sequence.length; i++) {
    _elm.appendChild( document.importNode( template.content, true ) )

    var button = _elm.children[i].querySelectorAll('.button')[0]
    var bank = _elm.children[i].querySelectorAll('.bank')[0]
    button.dataset.id = i
    bank.dataset.id = i

    // -------------------------------------------------------------------------
    // BUTTON
    // -------------------------------------------------------------------------

    // interface
    button.onmousedown = button.ontouchstart = function( _evt ) {
      this.start_time = (new Date).getTime()
      this.long_press = setTimeout( this.button_longpress, 400, this )
      this.onmouseup = this.ontouchend = function( _evt ) {
        _evt.preventDefault()
        this.button_normalpress(this)
        clearTimeout(this.long_press)
      }
    }

    // normalpress
    button.button_normalpress = function( _button ) {
      console.log("button_normalpress", _button )
      var le_bank = null
      if ( _elm.selected_bank == -1 && elm.bank_c == -1 ) {
        console.warn("no bank could be determind")
        return
      } else if ( _elm.selected_bank != -1 ) {
        le_bank = _elm.selected_bank
      } else{
        le_bank = _elm.bank_c
      }

      if ( _button.innerText != "" ) {
        _elm.sequence[le_bank][_button.dataset.id] = ""
        if ( _elm.selected_button == _button.dataset.id ) document.querySelector('.adjust_display .display').innerText = ""
        _elm.redraw()
      }else{
        socket1.send( get_client_id(), 'sequence_button', {
          sequence_id: _elm.id,
          button_id: _button.dataset.id,
          target_id: socket1.target,
          timestamp: _button.start_time - 0.2,
          sequence: [ le_bank, Number( _button.dataset.id ) ]
        } )
      }
    }

    // longpress
    button.button_longpress = function( _button ) {
      _button.onmouseup = _button.ontouchend = null
      if ( _elm.selected_button == _button.dataset.id ) {
        _elm.selected_button = -1
        document.querySelector('.adjust_display .display').innerText = ""
      } else if ( _elm.selected_button == -1 ) {
        elm('seq_butts_a').selected_button = -1 // hackity, set other off as well
        elm('seq_butts_b').selected_button = -1 // hackity, set other off as well
        _elm.selected_button = _button.dataset.id
        document.querySelector('.adjust_display .display').innerText = Math.round( _button.dataset.timecode * 100 ) / 100
        elm('timecode_adjust_knob').value = 0
        adjust_time = _button.dataset.timecode
        current_adjust_time = adjust_time
      } else {
        elm('seq_butts_a').selected_button = -1 // hackity, set other off as well
        elm('seq_butts_b').selected_button = -1 // hackity, set other off as well
        _elm.selected_button = _button.dataset.id
        document.querySelector('.adjust_display .display').innerText = Math.round( _button.dataset.timecode * 100 ) / 100
        elm('timecode_adjust_knob').value = 0
        adjust_time = _button.dataset.timecode
        current_adjust_time = adjust_time
      }
    }

    // -------------------------------------------------------------------------
    // BANK
    // -------------------------------------------------------------------------

    // interface
    bank.onmousedown = bank.ontouchstart = function( _evt ) {
      this.long_press = setTimeout( this.bank_longpress, 400, this )
      this.onmouseup = this.ontouchend = function( _evt ) {
        _evt.preventDefault()
        this.bank_normalpress(this)
        clearTimeout(this.long_press)
      }
    }

    // normalpress
    bank.bank_normalpress = function( _bank ) {
      console.log("bank_normalpress", _bank, _elm.querySelector('.bank').dataset.id)
      // turn bank on and of
      _elm.active_bank[ _bank.dataset.id ] == 1 ? _elm.active_bank[ _bank.dataset.id ] = 0 : _elm.active_bank[ _bank.dataset.id ] = 1
      _elm.redraw()
    }

    // longpress
    bank.bank_longpress = function( _bank ) {
      console.log("bank_longpress", _bank, _bank.dataset.id, _elm.selected_bank, _bank.selected_bank == _bank.dataset.id )
      _bank.onmouseup = _bank.ontouchend = null
      if ( _elm.selected_bank == _bank.dataset.id ) {
        _elm.selected_bank = -1
      }else{
        _elm.selected_bank = _bank.dataset.id
      }

      _elm.redraw()
    }
  }

  // redraw the state
  _elm.redraw = function() {

    if ( _elm.debug == true ) {
      console.log("redraw: ", _elm )
      console.table(_elm.sequence)
      console.table(_elm.active_bank.join(','))
      console.log("bank_c", _elm.bank_c )
      console.log("seq_c",_elm.seq_c )
      console.log("selected_button",_elm.selected_button )
      console.log("selected_bank",_elm.selected_bank )
    }

    // clear all, I'm pretending its a canvas
    _elm.querySelectorAll('.light').forEach( ( _light)=> _light.classList.remove('yellow','red','blue','green') )
    _elm.querySelectorAll('.bank').forEach( ( _bank )=> _bank.classList.remove('yellow','red','blue','green') )
    _elm.querySelectorAll('.button').forEach( ( _button )=> _button.dataset.timecode = '' )
    _elm.querySelectorAll('.button').forEach( ( _button )=> _button.innerText = '' )

    // check active banks
    _elm.active_bank.forEach( function( _bank, l ) {

      if ( _bank == 1 ) {
        _elm.querySelectorAll('.bank')[l].classList.add('green')
      } else if ( _elm.sequence[l].join('').length > 0 ) {
        // checks if this inactive bank contains anything
        // make it red
        _elm.querySelectorAll('.bank')[l].classList.add('red')
      } else{
        // nothing to do, grey
      }
    })

    // check selected bank
    if ( _elm.selected_bank != -1 ) {
      _elm.querySelectorAll('.bank')[ _elm.selected_bank ].classList.add('yellow') // highlight bank
      _elm.render_buttons( _elm.selected_bank ) // render current bank

    } else if ( _elm.bank_c != -1 ) {
      _elm.querySelectorAll('.bank')[_elm.bank_c].classList.add('blue')
      _elm.render_buttons( _elm.bank_c )

    } else {
      // nohing to do
    }

    // check current sequence counter
    if ( _elm.seq_c != -1 ) {
      var light = _elm.querySelectorAll('.light')[ _elm.seq_c ]
      light.classList.add('blue')
      var button = _elm.querySelectorAll('.button')[ _elm.seq_c ]

      if ( button.dataset.timecode ) {
        console.log("send: ", get_client_id(), _elm.id, button.dataset.timecode)
        socket1.send( get_client_id(), _elm.id, button.dataset.timecode  ) // -0.2
      }
    }
  }

  // helper
  _elm.render_buttons = function( _bank ) {
    _elm.sequence[ _bank ].forEach( function( val, j ) {
      var seq_button = _elm.querySelectorAll('.button')[j]
      if ( val != "" ) {
        if ( _elm.selected_button == j ) {
          seq_button.previousElementSibling.classList.add('yellow')
          seq_button.innerText = Math.round( current_adjust_time * 100 ) / 100
          seq_button.dataset.timecode = current_adjust_time
        }else{
          seq_button.previousElementSibling.classList.add('green')
          seq_button.innerText = Math.round( val * 100 ) / 100
          seq_button.dataset.timecode = val
        }

      }else{
        seq_button.innerText = ""
        seq_button.dataset.timecode = ""
      }
    })
  }

  // helper, figures out next available bank, if any
  _elm.do_next_bank = function() {
    if ( _elm.active_bank.includes(1) ) {
      _elm.bank_c++
      if (_elm.bank_c >= _elm.active_bank.length) _elm.bank_c = 0
      while( _elm.active_bank[_elm.bank_c]  == 0 ) {
        _elm.bank_c++
        if (_elm.bank_c >= _elm.active_bank.length) _elm.bank_c = 0
      }

    }else{
      _elm.bank_c = -1
    }
  }

  // on every beat!
  _elm.update = function() {
    _elm.seq_c = (_elm.seq_c + 1 )%_elm.sequence[0].length
    if ( _elm.seq_c == 0 ) _elm.do_next_bank()
    _elm.redraw()
    //requestAnimationFrame(_elm.update)
  }

  // when all is set and done
  _elm.redraw()
  // _elm.update()

}

create_sequence( elm('seq_butts_a') )
create_sequence( elm('seq_butts_b') )

// should go in the element, but not now
var current_adjust_time = 0
setTimeout( function() {
  elm('timecode_adjust_knob').oninput = elm('timecode_adjust_knob').onchange = function(_evt) {

    current_adjust_time = Number(adjust_time) + Number(this.value)

    document.querySelector('.adjust_display .display').innerText = Math.round( current_adjust_time * 100 ) / 100
    if ( elm('seq_butts_a').selected_button != -1 ) {
      elm('seq_butts_a').querySelectorAll('.button')[elm('seq_butts_a').selected_button].dataset.timecode = current_adjust_time
      elm('seq_butts_a').querySelectorAll('.button')[elm('seq_butts_a').selected_button].innerText = Math.round( current_adjust_time * 100 ) / 100
    }

    if ( elm('seq_butts_b').selected_button != -1 ) {
      elm('seq_butts_b').querySelectorAll('.button')[elm('seq_butts_b').selected_button].dataset.timecode = current_adjust_time
      elm('seq_butts_b').querySelectorAll('.button')[elm('seq_butts_b').selected_button].innerText = Math.round( current_adjust_time * 100 ) / 100
    }

  }
}, 500)

// listen for updates of sequence markers and
// set them in the appropriate button -- AND BANK
socket1.addEventListener('sequence_set', function( e ) {
  console.log('got sequence back?', e)
  var sequence_elm = elm(e.sequence_id)
  console.log( ">> ", sequence_elm.sequence[ e.sequence[0] ][ e.sequence[1] ] )
  sequence_elm.sequence[ e.sequence[0] ][ e.sequence[1] ] = e.time
  sequence_elm.redraw()
})

// runs from the upate interval
// updates on beat (every bpm tic)
// note: use for scrolling? p_elm.scrollTo( 0, current_a.offsetTop - p_elm.offsetTop );
function do_beat() {

  // bpm taps
  document.querySelectorAll('.tap > button').forEach( (_elm)=> client_status.autofade ? _elm.classList.toggle('red') : _elm.classList.remove('red') )

  // sequencer
  if ( elm('sequencer_play_pause').dataset.paused == "true" ) return

  // assuming they all have a sequence class
  document.querySelectorAll('.sequencer').forEach( function( _elm, i ) {
    _elm.update()
  })
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
    if ( isNaN(this.r) ) this.r = 18  // quickhack for firefox
    this.indicatorRing.setAttribute('d',`M20,20l0,-${this.r}A${this.r},${this.r},0,0,${norm<0.5?0:1},${endX},${endY}Z`);
  },
  id: el.dataset.id,
  min: Number(el.dataset.min),
  max: Number(el.dataset.max),
  initial: 1
}));
