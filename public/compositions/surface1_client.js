/*
* Example: Mixing a Gampad with four video sources
* https://virtualmixproject.com/docs/reference/index.html
* https://virtualmixproject.com/docs/reference/Controller_MidiController.html
* https://virtualmixproject.com/docs/reference/Module_Chain.html
*
* If all went well, you should be able to fade four videos together with your faders
*/

var renderer = new GlRenderer();

var video1 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/302/302-720.mp4'} )
var video2 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/348/348-720.mp4'} )

var filemanager1 = new FileManager(video1)
var filemanager2 = new FileManager(video2)

filemanager1.load_set( "/sets/programs_awesome.json")
filemanager2.load_set( "/sets/programs_runner.json")
// randomly choose one from the set.
// filemanager1.change()
// changeToNum

// var video3 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/344/344-720.mp4'} ) // nu
// var video4 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/351/351-720.mp4'} ) // nu
// var chain1 = new Chain( renderer, { sources: [ video1, video2, video3, video4 ] } );

var effect_a_1 = new ColorEffect( renderer, { source: video1, effect: 1 });
var effect_a_2 = new ColorEffect( renderer, { source: effect_a_1, effect: 1 });
var effect_a_3 = new ColorEffect( renderer, { source: effect_a_2, effect: 1 });
var effect_a_4 = new ColorEffect( renderer, { source: effect_a_3, effect: 1 });

var effect_b_1 = new ColorEffect( renderer, { source: video2, effect: 1 });
var effect_b_2 = new ColorEffect( renderer, { source: effect_b_1, effect: 1 });
var effect_b_3 = new ColorEffect( renderer, { source: effect_b_2, effect: 1 });
var effect_b_4 = new ColorEffect( renderer, { source: effect_b_3, effect: 1 });

var mixer1 = new Mixer( renderer, { source1: effect_b_4, source2: effect_a_4 } );

var bpm = new BPM( renderer );
bpm.bpm = 128
//bpm.add( mixer1.pod )

// midie
var midi1 = new MidiController( renderer )
midi1.debug = true

var output = new Output( renderer, mixer1 )

// here comes the code
var socket1 = new SocketController();

var uuid = null
socket1.addEventListener('welcome', function(e) {
  console.log("got welcome: ", e )

  if ( uuid != null && uuid != e ) {
    console.log("request old uid" )
    socket1.io.emit('request_uuid', e, uuid )
  }else{
    console.log("set client" )
    if ( uuid == null ) {
      console.log(" DIPS! ")
      uuid = e
    }
    document.getElementById('client_id').innerHTML = e
  }
} )

socket1.addEventListener('reset_uuid',function(e) {
    console.log("got reset_uuid: ", e )
    document.getElementById('client_id').innerHTML = e //+ " *"
})

socket1.addEventListener('main_pod',        function(e) { mixer1.pod(e[0]/100) } )
socket1.addEventListener('autofade',        function(e) { mixer1.autoFade = !mixer1.autoFade  } )
socket1.addEventListener('tap',             function(e) { bpm.tap(); mixer1.bpm(bpm.bpm) } );
socket1.addEventListener('bpm',             function(e) { bpm.bpm = e; mixer1.bpm(bpm.bpm) } );
socket1.addEventListener('mixmode',         function(e) { mixer1.mixMode(e[0]); console.log(e[0])    } )
socket1.addEventListener('blendmode',       function(e) { mixer1.blendMode(e[0]); console.log(e[0])   } )

socket1.addEventListener('effecta_1',       function(e) { effect_a_1.effect(e[0])      } )
socket1.addEventListener('effecta_1_extra', function(e) { effect_a_1.extra(e[0]/ 100) } )
socket1.addEventListener('effecta_2',       function(e) { effect_a_2.effect(e[0])      } )
socket1.addEventListener('effecta_2_extra', function(e) { effect_a_2.extra(e[0]/ 100)  } )
socket1.addEventListener('effecta_3',       function(e) { effect_a_3.effect(e[0])      } )
socket1.addEventListener('effecta_3_extra', function(e) { effect_a_3.extra(e[0]/ 100)  } )
socket1.addEventListener('effecta_4',       function(e) { effect_a_4.effect(e[0])      } )
socket1.addEventListener('effecta_4_extra', function(e) { effect_a_4.extra(e[0]/ 100)  } )

socket1.addEventListener('effectb_1',       function(e) { effect_b_1.effect(e[0])      } )
socket1.addEventListener('effectb_1_extra', function(e) { effect_b_1.extra(e[0]/ 100)  } )
socket1.addEventListener('effectb_2',       function(e) { effect_b_2.effect(e[0])      } )
socket1.addEventListener('effectb_2_extra', function(e) { effect_b_2.extra(e[0]/ 100)  } )
socket1.addEventListener('effectb_3',       function(e) { effect_b_3.effect(e[0])      } )
socket1.addEventListener('effectb_3_extra', function(e) { effect_b_3.extra(e[0]/ 100)  } )
socket1.addEventListener('effectb_4',       function(e) { effect_b_4.effect(e[0])      } )
socket1.addEventListener('effectb_4_extra', function(e) { effect_b_4.extra(e[0]/ 10)   } )

socket1.addEventListener('blackout',        function(e) { console.log("blackout") } )
socket1.addEventListener('whiteout',        function(e) { console.log("whiteout") } )

socket1.addEventListener('change_a',        function(e) { console.log("change 1");  filemanager1.changeToNum(e[0]) } )
socket1.addEventListener('change_b',        function(e) { console.log("change 2");  filemanager2.changeToNum(e[0]) } )
socket1.addEventListener('jump_a',          function(e) { console.log("jump 1");  video1.jump() } )
socket1.addEventListener('jump_b',          function(e) { console.log("jump 2");  video2.jump() } )
socket1.addEventListener('speed_a',         function(e) { console.log("speed 1");  video1.video.playbackRate = e[0] } )
socket1.addEventListener('speed_b',         function(e) { console.log("speed 2");  video2.video.playbackRate = e[0] } )

socket1.addEventListener('fbwd_a',          function(e) { video1.video.currentTime = video1.video.currentTime - 10 } )
socket1.addEventListener('bwd_a',           function(e) { video1.video.currentTime = video1.video.currentTime - 1 } )
socket1.addEventListener('ffwd_a',          function(e) { video1.video.currentTime = video1.video.currentTime + 1 } )
socket1.addEventListener('fwd_a',           function(e) { video1.video.currentTime = video1.video.currentTime + 10 } )
socket1.addEventListener('play_pause_a',    function(e) { video1.paused() ? video1.play() : video1.pause() } )

socket1.addEventListener('fbwd_b',          function(e) { video2.video.currentTime = video2.video.currentTime - 10 } )
socket1.addEventListener('bwd_b',           function(e) { video2.video.currentTime = video2.video.currentTime - 1 } )
socket1.addEventListener('ffwd_b',          function(e) { video2.video.currentTime = video2.video.currentTime + 1 } )
socket1.addEventListener('fwd_b',           function(e) { video2.video.currentTime = video2.video.currentTime + 10 } )
socket1.addEventListener('play_pause_b',    function(e) { video2.paused() ? video2.play() : video2.pause() } )

socket1.addEventListener('seq_butts_a',           function(e) { console.log('sequence A', e); try { video1.video.currentTime = e } catch(err) { console.warn(e, err ) } } )
socket1.addEventListener('seq_butts_b',           function(e) { console.log('sequence B', e); try { video2.video.currentTime = e } catch(err) { console.warn(e, err ) } } )

socket1.addEventListener('get_mixer_status',        function(e) {
  console.log("get status:", e.request_id )
  socket1.send( e.request_id, 'status_update', current_status )
})

socket1.addEventListener('sequence_button', function(e) {
  //{ button_id: _id, target_id: socket1.target, timestamp: (new Date).getTime() }
  console.log("sequence button ... ", e)
  var video_target = video1
  var target_time = (new Date()) - e.timestamp
  var set_time = video_target.video.currentTime - (target_time/1000)

  // assign sequences to target videosources
  if ( e.sequence_id == "seq_butts_a") video_target = video1
  if ( e.sequence_id == "seq_butts_b") video_target = video2

  video_target.video.currentTime = set_time
  socket1.send( e.target_id, "sequence_set", {
    time: set_time,
    button_id: e.button_id,
    sequence_id: e.sequence_id,
    sequence: e.sequence
  })
})
// source1.video.playbackRate
// filemanager1.change()
// changeToNum

// get status
var current_status = {}
setInterval( function() {

  current_status.video_b = {}
  current_status.video_a = {}
  current_status.effects = {}
  current_status.bpm = bpm.bpm
  current_status.pod = mixer1.pod
  current_status.autofade = mixer1.autoFade

  current_status.effects.effect_a_1 = effect_a_1.effect()
  current_status.effects.effect_a_1_extra = effect_a_1.extra()
  current_status.effects.effect_a_2 = effect_a_1.effect()
  current_status.effects.effect_a_2_extra = effect_a_1.extra()
  current_status.effects.effect_a_3 = effect_a_1.effect()
  current_status.effects.effect_a_3_extra = effect_a_1.extra()
  current_status.effects.effect_a_4 = effect_a_1.effect()
  current_status.effects.effect_a_4_extra = effect_a_1.extra()
  current_status.effects.effect_b_1 = effect_a_1.effect()
  current_status.effects.effect_b_1_extra = effect_a_1.extra()
  current_status.effects.effect_b_2 = effect_a_1.effect()
  current_status.effects.effect_b_2_extra = effect_a_1.extra()
  current_status.effects.effect_c_3 = effect_a_1.effect()
  current_status.effects.effect_c_3_extra = effect_a_1.extra()
  current_status.effects.effect_d_4 = effect_a_1.effect()
  current_status.effects.effect_d_4_extra = effect_a_1.extra()

  current_status.video_a.url = video1.video.currentSrc
  current_status.video_a.duration = video1.video.duration
  current_status.video_a.currenttime = video1.video.currentTime
  current_status.video_a.playbackrate = video1.video.playbackRate
  current_status.video_b.url = video2.video.currentSrc
  current_status.video_b.duration = video2.video.duration
  current_status.video_b.currenttime = video2.video.currentTime
  current_status.video_b.playbackrate = video2.video.playbackRate

} )

renderer.init();
renderer.render();

// ------------------------------------------------------------

// change this to select gamepad, if multiple devices can identify as gamepad
// 0, 1, 2 etc.
// look for the index in the console log; like this:
// Gamepad connected at index 2: Xbox 360 Controller (XInput STANDARD GAMEPAD). 17 buttons, 4 axes.
// VM743 console_runner-1df7d3399bdc1f40995a35209755dcfd8c7547da127f6469fd81e5fba982f6af.js:1 init GamePadController
// the gamepad_index is then 2

// first button
midi1.addEventListener( 0, ( arr )=> console.log( arr ) )

// first four faders on a AKAI APCmini
midi1.addEventListener( 48, ( arr )=> chain1.setChainLink( 0, arr[2] / 128 ) )
midi1.addEventListener( 49, ( arr )=> chain1.setChainLink( 1, arr[2] / 128 ) )
midi1.addEventListener( 50, ( arr )=> chain1.setChainLink( 2, arr[2] / 128 ) )
midi1.addEventListener( 51, ( arr )=> chain1.setChainLink( 3, arr[2] / 128 ) )
