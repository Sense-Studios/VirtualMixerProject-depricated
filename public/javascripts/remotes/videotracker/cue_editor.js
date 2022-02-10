

// Load up the instrument in the cue editor
function load_up_instrument(_id) {
  current_instrument_id = _id
  var v = document.getElementById('instrument_video')
  v.src = INSTRUMENTS[_id]

  var c = document.getElementById('cue_canvas')
  var width = document.querySelector('.cueeditor').offsetWidth
  c.width = width
  c.height = 250
  var cctx = c.getContext( '2d' );

  // cctx.clearRect(0, 0, 1024, 1024); // send nothing
  var cnt = 0
  var cues = saved_file.instruments[_id].cues
  var loaded_cues = 0

  document.querySelector('#cuelist .cue-containers').innerHTML = ""
  document.querySelector('.cues').innerHTML = ""

  clearInterval(instrument_preview_interval)
  instrument_preview_interval = setInterval( function() {

    //var idmgData = cctx.getImageData(0, 0, 1000, 1000);
    //cctx.rect( cnt + 150, 0, 1000, 300);
    //cctx.clip();
    //cctx.drawImage( v, cnt, 0, 360, 1280, cnt, 0, 200, 400 );

    //The source image is taken from the coordinates (33, 71),
    // with a width of 104 and a height of 124. It is drawn to the canvas
    //  at (21, 20), where it is given a width of 87 and a height of 104.
    //console.log('trr', r_h, r_w)
    var r_h = v.videoHeight
    var r_w = v.videoWidth

    if ( v.readyState === v.HAVE_ENOUGH_DATA && !v.seeking) {


      //cctx.drawImage( v, 960, 0, 960, 1080, cnt-10, 0, 150, 240 );
      cctx.drawImage( v, r_w/2, 0, r_w/2, r_h, cnt-5, 0, 150, 240 );
      //cctx.putImageData(imgData, 0, 0);

      //console.log("ding", cnt)
      //|              |
      //       900

      //----------------
      //duration / width

      v.currentTime += ( v.duration / width) * 10

      if ( v.currentTime >= v.duration ) {
        clearInterval(instrument_preview_interval)
      }
      cnt += 10

      // cues.sort() ?
      //console.log( loaded_cues, v.currentTime )
      // cues[ loaded_cues ][0] = Note
      // cues[ loaded_cues ][1] = in-point
      if ( cues.length > 0 && loaded_cues < cues.length ) {
        if ( cues[ loaded_cues ][1] < v.currentTime ) {
          console.log("found a CUE!", loaded_cues, cues[ loaded_cues ])
          createCue( cues, loaded_cues )

          /// c.width = width
          //  c.height = 250
          //  var cctx = c.getContext( '2d' );

          loaded_cues+=1
        }
      }
    }
  },10) // end interval

  // helper for the cue editor
  var scrub_interval = setInterval(function() {}, 1000000)
  c.onmousedown = function(evt) {
    console.log("mousedown, START")
    clearInterval(scrub_interval)
    //scrub_interval = setInterval( function() {
    v.currentTime = ( evt.offsetX / width ) * v.duration

    c.onmousemove = function(mm_evt) {
      console.log("tik", v.seeking, mm_evt.offsetX )
      if (!v.seeking) {
        v.currentTime = ( mm_evt.offsetX / width ) * v.duration
      }

      if (isdown) {
        console.log("do drag", isdown, mm_evt)
        isdown.style.left = mm_evt.screenX + "px"
      }
    }
  }

  //
  document.querySelector('.cueeditor').onmouseout = c.onmouseup = function(evt) {
    console.log("mouseup, stop")
    clearInterval(scrub_interval)
    c.onmousemove = null
  }

  /*
  var i = 0
  _self.update = function() {

    if (_self.bypass = false) return
    if ( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA && !videoElement.seeking) {
      canvasElementContext.drawImage( videoElement, 0, 0, texture_size, texture_size );

      if ( videoTexture ) videoTexture.needsUpdate = true;
    }else{
      canvasElementContext.drawImage( videoElement, 0, 0, texture_size, texture_size );  // send last image
      // TODO: console.log("SEND IN BLACK!") ?
      // canvasElementContext.clearRect(0, 0, 1024, 1024); // send nothing
      //_self.alpha = 0
      if ( videoTexture ) videoTexture.needsUpdate = true;
    }
  }
  */
}

// updateOrCreateCue

var isdown = null
var dragInterval = setInterval(function(){},10000)
var cue_timeout = setTimeout(function(){}, 100)

function createCue( cues, loaded_cues ) {

  console.log("create or update cues ", loaded_cues)
  // saved_file.instruments[current_instrument_id].cues
  var _loaded_cues = loaded_cues

  var html = `
      <div class='cue-container cue' id='cue-${_loaded_cues}'>
        <div class='cue-note'>
          <input
            data-cueindex="${_loaded_cues}"
            id="cue-note-${_loaded_cues}"
            value="${cues[ loaded_cues ][0]}">

          <input class="cue-in"
            type="number"
            step="0.1"
            data-inpoint="${cues[ loaded_cues ][1]}"
            data-cueindex="${_loaded_cues}"
            id="cue-inpoint-${_loaded_cues}"
            value="${cues[ loaded_cues ][1]}">

          <input class="cue-out"
            type="number"
            step="0.1"
            data-outpoint="${cues[ loaded_cues ][2]}"
            data-cueindex="${_loaded_cues}"
            id="cue-outpoint-${_loaded_cues}"
            value="${cues[ loaded_cues ][2]}">
        <br>
        <button class="btn" id="cue-duplicate-button">duplicate</button>
        <button class="btn" id="cue-delete-button">delete</button>
      </div>
    `
    // NEEDS APPEND!
  var new_html = document.createElement('div')
  new_html.innerHTML += html

  if ( document.getElementById(`cue-${_loaded_cues}`) ) {
    document.getElementById(`cue-${_loaded_cues}`).parentElement.replaceWith(new_html)
  }else{
    document.querySelector('#cuelist .cue-containers').append(new_html)
  }

  // var fillnotekeys = function( `cue-${_loaded_cues}`, document.getElementById(`cue-${_loaded_cues}`).value ) {

  // add interaction
  var note_input = document.getElementById(`cue-note-${_loaded_cues}`)
  note_input.onchange = function(evt) {
    saved_file.instruments[current_instrument_id].cues[Number(this.dataset.cueindex)][0] = this.value
    console.log("SAVED")
  }

  var cue_inpoint = document.getElementById(`cue-inpoint-${_loaded_cues}`)
  cue_inpoint.onchange = function(evt) {
    saved_file.instruments[current_instrument_id].cues[Number(this.dataset.cueindex)][1] = this.value
    // update left handle (left, inpoint)
    // cue-marker-
    var cues = saved_file.instruments[current_instrument_id].cues
    var cue_marker = document.getElementById(`cue-marker-${_loaded_cues}`)
    var in_point = cues[ loaded_cues ][1] / v.duration
    var out_point = cues[ loaded_cues ][2] / v.duration
    cue_marker.style = `left:${in_point*100}%;width:${out_point*100-in_point*100}%`
    console.log("SAVED")
  }

  var cue_outpoint = document.getElementById(`cue-outpoint-${_loaded_cues}`)
  cue_outpoint.onchange = function(evt) {
    saved_file.instruments[current_instrument_id].cues[Number(this.dataset.cueindex)][2] = this.value
    // update right handle (width, outpoint)
    // cue-marker-

    var cues = saved_file.instruments[current_instrument_id].cues
    var cue_marker = document.getElementById(`cue-marker-${_loaded_cues}`)
    var in_point = cues[ loaded_cues ][1] / v.duration
    var out_point = cues[ loaded_cues ][2] / v.duration
    cue_marker.style = `left:${in_point*100}%;width:${out_point*100-in_point*100}%`
    console.log("SAVED")
  }

  var v = document.getElementById('instrument_video')
  var r_h = v.videoHeight
  var r_w = v.videoWidth

  var _id = "cue-still-canvas-" + _loaded_cues
  console.log(_id)
  var cvs = document.createElement('canvas')
  cvs.classList.add('cue-canvas')
  var cvsctx = cvs.getContext('2d')

  // cvsctx.fillRect(0, 0, 10, 10)
  // cvsctx.drawImage( v, r_w, 0, r_w, r_h, 0, 0, 64, 64 );
  cvsctx.drawImage(v, 0, 0, 300,150)
  document.getElementById('cue-' + _loaded_cues).append(cvs)
  console.log(v, cvs)

  // ====
  var in_point = cues[ loaded_cues ][1] / v.duration
  var out_point = cues[ loaded_cues ][2] / v.duration

  // and so below
  var html = `
      <div class="cue-marker" id="cue-marker-${_loaded_cues}"
        data-index="${_loaded_cues}"
        data-inpoint="${in_point*100}%"
        data-outpoint="${in_point*100}%"
        style="left:${in_point*100}%;width:${out_point*100-in_point*100}%"
        >
        <div class="handle left_handle"></div>
        <div class="handle right_handle"></div>
      </div>
    `
  //

  var new_html = document.createElement('div')
  new_html.innerHTML += html

  // or replace
  if ( document.getElementById(`cue-marker-${_loaded_cues}`) ) {
    document.getElementById(`cue-marker-${_loaded_cues}`).parentElement.replaceWith(new_html)
  } else {
    document.querySelector('.cues').append(new_html)
  }

  setTimeout( function() {
    document.querySelectorAll('.handle').forEach((item, i) => {
      item.onmouseup = function() {
        //  console.log("mousedown, ITEM STOP", item)
        //  isdown = null

        // handled by body
      }
      item.onmousedown = function() {
        console.log("mousedown, ITEM START", item)
        isdown = item
        //clearInterval(dragInterval)
        //dragInterval = setInterval( function(_evt) {
        //  // drag(item, _evt)
        //}, 200 )
      }
    });
  }, 20)
  //document.querySelectorAll('.right_handle')
}


document.body.onmousemove = function(_evt) {
  if (isdown) {
    console.log("mousemove ", isdown, _evt.clientX)
    console.log("mousemove ", isdown.style.left)

    if (isdown.classList.contains('left_handle') ) {
      // isdown.parentElement.offsetLeft // 345 (get)
      // isdown.parentElement.style.left // 25.33
      var left = (_evt.clientX / window.innerWidth) * 100  // 345
      var v = document.getElementById('instrument_video')
      v.currentTime = (_evt.clientX / window.innerWidth) * v.duration
      isdown.parentElement.style.left = left + "%"
    }

    if (isdown.classList.contains('right_handle') ) {
      var left = ( isdown.parentElement.offsetLeft / window.innerWidth) * 100  // 345
      var widtht = (( _evt.clientX / window.innerWidth) * 100 ) - left // 345
      var v = document.getElementById('instrument_video')
      v.currentTime = (_evt.clientX / window.innerWidth) * v.duration
      console.log("right handle", widtht)
      isdown.parentElement.style.width = widtht + "%"

      // update the file
      // saved_file.instruments[_id].cues
      // isdown.parentElement

      // update cue ui
      // TODO light weight state manager?
    }
  }
}

// Body mouse move reset!
document.body.onmouseup = function(_evt) {
  if (isdown) {
    var cue_id = isdown.parentElement.dataset["index"]
    var v = document.getElementById('instrument_video')

    // in point
    inpoint = ( isdown.parentElement.offsetLeft / window.innerWidth ) * v.duration
    saved_file.instruments[current_instrument_id].cues[cue_id][1] = Math.round( inpoint * 100 ) / 100

    // out point
    outpoint = ( ( isdown.parentElement.offsetLeft + isdown.parentElement.offsetWidth ) / window.innerWidth ) * v.duration
    saved_file.instruments[current_instrument_id].cues[cue_id][2] = Math.round( outpoint * 100 ) / 100
    var cues = saved_file.instruments[current_instrument_id].cues
    createCue( cues, cue_id )
    isdown=null
  }
}

document.getElementById('add-cue-button').onclick = function() {
  saved_file.instruments[current_instrument_id].cues.push([ "C1", 2, 3 ])
  cues = saved_file.instruments[current_instrument_id].cues
  createCue( cues, cues.length - 1 )
}
