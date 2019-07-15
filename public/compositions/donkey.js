// de sets
// "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/00_intro_formatievlog_houseofcards_edit.mp4",
var fvd_set = [
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_bedankt_voor_stem.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_collage_1.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_hiddema.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_infographic.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_uil_van_minerva.mp4"
]

var loony_set = [
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/2_Looney Tunes - The Ducktators 1942 High Quality HD.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/2_zombie_nazis2.mp4" ]

var nazi_first = [
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/3_a_night_at_the_garden.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/3_german_youth_display.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/3_marchi_into_austria.mp4"
]

var nazi_second = [
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/4_goebbels_speech.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/4_nazi_rally.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/4_speech_by_goebbels.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/5_bergen_belsen.mp4"
]

var clutter = [
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/98_clutter_dust.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/98_clutter_filmburn.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/98_clutter_lines.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/98_clutter_sound.mp4"
]

var fire = [
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/99_clutter_firewall.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/99_clutter_groundblast_2.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/99_clutter_groundfire1_brush.mp4",
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/99_clutter_steekflamBIG_promo2.mp4",
]

var vhs = [
  "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/97_clutrter_vhs_actual_vhs_noice.mp4"
]


// create a renderer
var renderer = new GlRenderer();

// create some solids
var source1 = new VideoSource(renderer, { src: "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/00_intro_formatievlog_houseofcards_edit.mp4" })
var source2 = new VideoSource(renderer, { src: "https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/black.mp4" })

var source3 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/clutter/vhs_noise3.mp4" } );
//var source3 = new VideoSource(renderer, { src: "http://nabu-dev.s3.amazonaws.com/uploads/video/53e2a3ad6465761455190000/720p_5000kbps_h264.mp4?r=737324588185" } );

// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
var audio = new Audio()
audio.src = '/audio/BLABLABLA_original.mp3'

var filemanager1 = new FileManager( source1 )
filemanager1.load_set("/sets/donkey.json")

var filemanager2 = new FileManager( source2 )
filemanager2.load_set("/sets/donkey.json")

// add noise
var mixer2 = new Mixer( renderer, { source1: source3, source2: mixer1 });

// add effect
var contrast = new ColorEffect( renderer, { source: mixer2 } )
var c_effect = new ColorEffect( renderer, { source: contrast } )

var bpm = new BPM( renderer )
bpm.bpm = 132

// finally asign that mixer to the output
var output = new Output( renderer, c_effect )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

/* ----------------------------------------------------------------------------
   And we are away
   ---------------------------------------------------------------------------- */

filemanager1.debug = true

// set noise
//mixer2.mixMode(5)
//mixer2.blendMode(1)
// mixer2.pod(1)

contrast.effect(61)
contrast.extra(0.4)
//mixer2.bindBpm( function() { return audioanalysis1.getBpm()/4 } );
//mixer2.audoFade = true

// bpm.add( mixer1.pod )
// bpm.mod = 1

/*
var tc_start = function() {
  var c = 1;
  var fadein = setInterval( function() {
    c -= 0.0001
    //console.log(c)
    mixer2.pod(c)
    if (audio.currentTime > 24) clearInterval(fadein)
  })
}

var thumb_1 = function() {

  c_effect.effect(2)
  setTimeout( c_effect.effect, 454, 2 )
  setTimeout( c_effect.effect, 909, 3 )
  setTimeout( c_effect.effect, 1363, 4 )
  setTimeout( c_effect.effect, 1818, 2 )
  setTimeout( c_effect.effect, 2271, 2 )
  setTimeout( c_effect.effect, 2600, 1 )

  setTimeout( c_effect.effect, 3454, 2 )
  setTimeout( c_effect.effect, 3909, 3 )
  setTimeout( c_effect.effect, 4363, 4 )
  setTimeout( c_effect.effect, 4818, 2 )
  setTimeout( c_effect.effect, 4271, 2 )
  setTimeout( c_effect.effect, 5600, 1 )

  setTimeout( c_effect.effect, 8454, 2 )
  setTimeout( c_effect.effect, 8909, 3 )
  setTimeout( c_effect.effect, 8363, 4 )
  setTimeout( c_effect.effect, 8818, 2 )
  setTimeout( c_effect.effect, 8271, 2 )
  setTimeout( c_effect.effect, 8600, 1 )

  source1.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_bedankt_voor_stem.mp4")
}

var thumb_2 = function() {
  //c_effect.effect(2)


  setTimeout( c_effect.effect, 454, 1 )
  setTimeout( c_effect.effect, 909, 2 )
  setTimeout( c_effect.effect, 1363, 3 )
  setTimeout( c_effect.effect, 1818, 2 )
  setTimeout( c_effect.effect, 2271, 5 )
  setTimeout( c_effect.effect, 2600, 1 )

  setTimeout( c_effect.effect, 2454, 2 )
  setTimeout( c_effect.effect, 2909, 3 )
  setTimeout( c_effect.effect, 3363, 4 )
  setTimeout( c_effect.effect, 3818, 2 )
  setTimeout( c_effect.effect, 3271, 2 )
  setTimeout( c_effect.effect, 4600, 1 )

}

var tc_intro = function() {
  mixer2.autoFade = true
  mixer2.bpm(132)
}

var tc_versnelling = function() {
  console.log("versnelling?")
  mixer2.autoFade = true
  mixer2.bpm(132)
  mixer2.mixMode(2)
  setTimeout( mixer2.bpm, 454, 132 )
  setTimeout( mixer2.bpm, 909, 200 )
  setTimeout( mixer2.bpm, 1363, 300 )
  setTimeout( mixer2.bpm, 1818, 400 )
  setTimeout( mixer2.bpm, 2271, 500 )
  setTimeout( mixer2.bpm, 2600, 600 )
}

var tc_drop = function() {
  mixer2.autoFade = true
  mixer2.mixMode(1)
  mixer2.bpm(132)
  //mixer2.pod(1) // black
  source2.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_bedankt_voor_stem.mp4")
}

var tc_melody1 = function() {
  mixer2.autoFade = true
  mixer2.bpm(66)
  //mixer2.pod(1) // black
}

var tc_melody2 = function() {}
var tc_blackout = function() {}
var tc_piano1 = function() {}
var tc_piano2 = function() {}
var tc_xing1 = function() {}
var tc_xing2 = function() {}
var tc_last_beat1 = function() {}
var tc_last_beat2 = function() {}
var tc_last_chorus = function() {}
var tc_exit = function() {}
var tc_reset = function() {}

// click track
var timecodes = [
  [ 0, "start", tc_start  ],
  [ 24.3, "thumb_1", thumb_1  ],
  [ 30.76, "thumb_2", thumb_2  ],
  [ 38.26, "end intro", tc_intro ],
  [ 46.46, "versnelling", tc_versnelling ],
  [ 55.63, "drop", tc_drop ],
  [ 81.73, "break melody 1", tc_melody1 ],
  [ 95.6, "break melody 2", tc_melody2 ],
  [ 109.5, "blackout", tc_blackout ],
  [ 113.2, "piano", tc_piano1 ],
  [ 133.93, "piano 2", tc_piano2 ],
  [ 147.76, "x'ing 1", tc_xing1 ],
  [ 154.7, "x'ing 2", tc_xing2 ],
  [ 161.6, "last beat set 1", tc_last_beat1 ],
  [ 168.6, "last beat set 2", tc_last_beat2 ],
  [ 175.6, "last chorus", tc_last_chorus ],
  [ 189.6, "exit", tc_exit ],
  [ 193.43, "reset", tc_reset ]
]

var timecodes2 = [
*/

mixer1.pod(0); // black
mixer2.pod(0);
mixer2.mixMode(9);
mixer2.blendMode(1);
c_effect.effect(0);

var timecodes2 = [
  [    1, "Start",  function() {
    source1.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/00_intro_formatievlog_houseofcards_edit.mp4")
    source2.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/black.mp4");
    mixer1.fade(10000)
  }],
  [  309, "Fire",  function() {
    source2.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/99_clutter_firewall.mp4");
    filemanager2.set = fire
    mixer1.pod(0);
    mixer1.fade(2400);
  }],
  [  729, "name 3",  function() { c_effect.effect(2); filemanager2.change() } ],
  [  809, "name 4",  function() { c_effect.effect(1) } ],
  [  813, "name 5",  function() { c_effect.effect(2) } ],
  [  817, "name 6",  function() { c_effect.effect(1) } ],
  [  821, "name 7",  function() { c_effect.effect(2) } ],
  [  835, "name 8",  function() {
    c_effect.effect(1);
    mixer1.pod(0);
    mixer1.fade(600);
    source1.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_infographic.mp4")
    source1.jump()
  }],

  [  913, "name 9",  function() { c_effect.effect(2); filemanager2.change() } ],
  [  917, "name 10", function() { c_effect.effect(1) } ],
  [  922, "name 11", function() { c_effect.effect(2) } ],
  [  927, "name 12", function() { c_effect.effect(1) } ],
  [  931, "name 13", function() { c_effect.effect(2) } ],
  [  939, "name 14", function() {
    c_effect.effect(1);
    mixer1.pod(0);
    mixer1.fade(600);
    source1.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/00_intro_formatievlog_houseofcards_edit.mp4")
  }],

  [ 1017, "name 15", function() { c_effect.effect(2); filemanager2.change() } ],
  [ 1020, "name 16", function() { c_effect.effect(1) } ],
  [ 1022, "name 17", function() { c_effect.effect(2) } ],
  [ 1024, "name 18", function() { c_effect.effect(1) } ],
  [ 1026, "name 19", function() { c_effect.effect(2) } ],
  [ 1031, "name 20", function() { c_effect.effect(1) } ],
  [ 1043, "name 21", function() {
    mixer1.pod(0);
    mixer1.fade(600); }
  ],

  [ 1122, "name 22", function() { c_effect.effect(2); filemanager2.change() } ],
  [ 1125, "name 23", function() { c_effect.effect(1) } ],
  [ 1129, "name 24", function() { c_effect.effect(2) } ],
  [ 1135, "name 25", function() { c_effect.effect(1) } ],
  [ 1138, "name 26", function() { c_effect.effect(2) } ],
  [ 1147, "name 27", function() {
    c_effect.effect(1)
    mixer1.autoFade = true
    mixer1.bpm(66)
  } ],

  [ 1302, "name 28", function() {
    filemanager2.change()
    mixer1.mixMode(2)
  } ],

  [ 1385, "hasten beat", function() {
    mixer1.autoFade = true
    var c = 66
    var cc = 0
    var bpm_interval = setInterval( function() {
      c += 40
      cc += 1
      mixer1.bpm(c)
      if ( cc > 20 ) clearInterval(bpm_interval)
    }, 200 )
  } ],

  [ 1494, "prrrrrllll", function() {
    c_effect.effect(2)
  } ],

  [ 1555, "blackout", function() {
    mixer1.autoFade = false
    c_effect.effect(1)
    mixer1.pod(0);
    mixer1.bpm(132)
    source1.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_bedankt_voor_stem.mp4",);
    source2.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/black.mp4");
  } ],

  [ 1622, "chorus", function() {
    mixer1.pod(1);
  } ],

  [ 1669, "drop", function() {
    mixer1.autoFade = true
    mixer1.bpm(132)
    mixer1.mixMode(1)
    filemanager1.set = fvd_set
    filemanager2.set = loony_set
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],

  [ 1771, "name 34", function() {
    source1.jump()
    source2.jump()
  } ],

  [ 1874, "name 35", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],

  [ 1978, "name 36", function() {
    source1.jump()
    source2.jump()
  } ],

  [ 2031, "name 37", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
    mixer1.mixMode(5)
    mixer1.blendMode(4)
  } ],
  [ 2123, "name 38", function() {
    source1.jump()
    source2.jump()
  } ],
  [ 2189, "name 39", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
    mixer1.mixMode(1)
    mixer1.blendMode(1)
  } ],
  [ 2345, "name 40", function() {
    source1.jump()
    source2.jump()
  } ],

  [ 2450, "name 41", function() {
    filemanager1.set = fvd_set
    filemanager2.set = nazi_first
    c_effect.effect(10)
    mixer1.mixMode(2)
    mixer1.blendMode(1)
    mixer1.bpm(66)
  } ],

  [ 2396, "name 42", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],
  [ 2502, "name 43", function() {
    source1.jump()
    source2.jump()
  } ],
  [ 2606, "name 44", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],
  [ 2555, "name 45", function() {
    source1.jump()
    source2.jump()
    mixer1.blendMode(1)
    mixer1.mixMode(1)
  } ],
  [ 2656, "name 46", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],
  [ 2762, "name 47", function() {
    source1.jump()
    source2.jump()
  } ],
  [ 2710, "name 48", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],
  [ 2815, "name 49", function() {
    source1.jump()
    source2.jump()
  } ],
  [ 2866, "name 50", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],
  [ 2920, "name 51", function() {} ],
  [ 2971, "name 52", function() {} ],
  [ 3023, "name 53", function() {} ],
  [ 3074, "name 54", function() {} ],
  [ 3127, "name 55", function() {} ],
  [ 3179, "name 56", function() {} ],
  [ 3232, "name 57", function() {} ],
  [ 3283, "blackout", function() {
    filemanager1.set = nazi_second
    filemanager2.set = fire
    mixer1.autoFade = false
    mixer1.pod(0);
    source1.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_bedankt_voor_stem.mp4",);
    source2.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/black.mp4");
  } ],

  [ 3395, "greyplay", function() {
    c_effect.effect(0)
    source2.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/4_nazi_rally.mp4");
    mixer1.bpm(66)
    mixer1.blendMode(1)
    mixer1.mixMode(2)
    mixer1.autoFade = true
  } ],

  [ 3595, "name 60", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],
  [ 3790, "name 61", function() {
    mixer1.bpm(66)
    mixer1.mixMode(1)
    mixer1.autoFade = true
  } ],
  [ 4014, "name 62", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
    mixer1.bpm(132)
  } ],
  [ 4209, "name 63", function() {
    filemanager1.set = nazi_second
    filemanager2.set = fvd_set
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],

  [ 4429, "name 64", function() {
    mixer1.mixMode(5)
    mixer1.blendMode(4)
  } ],
  [ 4532, "name 65", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],
  [ 4638, "name 66", function() {
    mixer1.mixMode(2)
    mixer1.blendMode(1)
  } ],
  [ 4743, "name 67", function() {
    mixer1.mixMode(1)
  } ],

  [ 4847, "name 68", function() {
    filemanager1.change()
    filemanager2.change()
    setTimeout(source1.jump, 200 )
    setTimeout(source2.jump, 200 )
  } ],
  [ 5056, "name 69", function() {
    mixer1.mixMode(2)
  } ],

  [ 5264, "last_chorus", function() {
    mixer1.bpm(66)  
  } ],

  [ 5681, "blackout", function() {
    mixer1.autoFade = false
    source1.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/1_bedankt_voor_stem.mp4",);
    source2.src("https://nabu.s3-eu-west-1.amazonaws.com/veejay/donkey/black.mp4");
    mixer1.pod(0);
    mixer1.mixMode(1)
  } ],
  [ 5700, "end", function() {} ]
]

var last = 0
setInterval( function() {
  if ( last >= timecodes2.length  ) return
  console.log(last)
  if ( audio.currentTime > timecodes2[last][0]/30 ) {
    console.log("new timecode: ", last, timecodes2[last][0]/30, timecodes2[last][1] )
    timecodes2[last][2]()
    last += 1
  }
})

audio.onended = function() {
  console.log("reset audio")
  last = 0
  audio.play(0)
}

var wasSet = false
var beats = 0
var useBlendmodes = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
var useMixmodes = [ 1, 2, 3, 4, 5, 6, 9 ] //  6, 7, 8
var dice = 0
/*
setInterval(function() {
  return
  if ( bpm.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    dice = Math.random()
    console.log("beat!", beats, dice)
    if (beats == 2) filemanager.changez()
    if (beats == 6) filemanager2.changez()
    if (beats%6 == 0 && dice < 0.9 ) source1.jump()
    if (beats%4 == 0 && dice < 0.9 ) source2.jump()
    if (beats%16 == 0 && dice < 0.9 ) filemanager.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%12 == 0 && dice < 0.9 ) filemanager2.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    if (beats%18 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    //if (beats%32 == 0 && dice < 0.4 ) audioanalysis1.mod = 0.5
    // if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 1
    //if (beats%32 == 0 && dice < 0.1 ) mixer2.pod(0.2)
    //if (beats%32 == 0 && dice > 0.5 ) mixer2.pod(0.4)
    //if (beats%16 == 0 && dice > 0.8  )mixer2.pod(0.6)
  }

  if ( bpm.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )
*/

/*

// create a renderer
var renderer = new GlRenderer();

// create some solids
var source1 = new VideoSource(renderer, {})
var source2 = new VideoSource(renderer, {})
var source3 = new VideoSource(renderer, { src: "https://s3-eu-west-1.amazonaws.com/nabu/veejay/clutter/vhs_noise3.mp4" } );
//var source3 = new VideoSource(renderer, { src: "http://nabu-dev.s3.amazonaws.com/uploads/video/53e2a3ad6465761455190000/720p_5000kbps_h264.mp4?r=737324588185" } );


// create a mixer, mix red and green
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });

// var analisi
// var bpm = new BPM( renderer ) tapped beat control
var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/nsb' } )

var filemanager = new FileManager( source1 )
filemanager.load_set("/sets/programs_awesome.json")

var filemanager2 = new FileManager( source2 )
filemanager2.load_set("/sets/programs_clutter.json")


// add noise
var mixer2 = new Mixer( renderer, { source1: source3, source2: mixer1 });

// add effect
var contrast = new ColorEffect( renderer, { source: mixer2 } )

// finally asign that mixer to the output
var output = new Output( renderer, contrast )

// initialize the renderer and start the renderer
renderer.init();         // init
renderer.render();       // start update & animation

/* ----------------------------------------------------------------------------
   And we are away
   ---------------------------------------------------------------------------- */

/*
// set noise
mixer2.mixMode(5)
mixer2.blendMode(1)
mixer2.pod(0.6)

contrast.effect(61)
contrast.extra(0.4)
//mixer2.bindBpm( function() { return audioanalysis1.getBpm()/4 } );
//mixer2.audoFade = true

audioanalysis1.add( mixer1.pod )
audioanalysis1.mod = 1

var wasSet = false
var beats = 0
var useBlendmodes = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
var useMixmodes = [ 1, 2, 3, 4, 5, 6, 9 ] //  6, 7, 8
var dice = 0
setInterval(function() {
  if ( audioanalysis1.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    dice = Math.random()
    console.log("beat!", beats, dice)
    if (beats == 2) filemanager.changez()
    if (beats == 6) filemanager2.changez()
    if (beats%6 == 0 && dice < 0.2 ) source1.jump()
    if (beats%4 == 0 && dice < 0.2 ) source2.jump()
    if (beats%16 == 0 && dice < 0.64 ) filemanager.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%12 == 0 && dice < 0.64 ) filemanager2.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    if (beats%18 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    if (beats%32 == 0 && dice < 0.1 ) audioanalysis1.mod = 0.5
    if (beats%32 == 0 && dice > 0.5 ) audioanalysis1.mod = 1
    if (beats%32 == 0 && dice < 0.1 ) mixer2.pod(0.2)
    if (beats%32 == 0 && dice > 0.5 ) mixer2.pod(0.4)
    if (beats%16 == 0 && dice > 0.8  )mixer2.pod(0.6)
  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )

*/
