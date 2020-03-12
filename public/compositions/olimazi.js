/* ----------

  VIBE 1: DINNER:
  De rustige logobehanganimaties Deze staan idealiter 30 seconden tot 3 minuten aan,
  afwisselend. Ik zou er niet of nauwelijks effecten aan toevoegen, en gewoon rustig
  crossfaden als overgang. NB: echt erg langzaam en rustig houden
  De landschapsvideos: van deze kan je prima lange blokken hebben van 10 minuten ofzo,
  in verhouding mag dit 4 of 5 keer  keer zoveel tijd innemen als het logo.
  Ik zou er hooguit subtiele  effecten aan toevoegen, en gewoon rustig
  crossfaden als overgang.Dit moet functioneren als een raam of buiten eten

  VIBE 2: DANSEN
  Na het eten gaan de stoelen en tafels weg, en is het disco. Totaal andere vibe
  De logo-animaties moeten lekker a tempo
  En er is een map met allerlei VJ loops Zo mogelijk zou ik de logoloops in een
  verhouding 1 op 10 hiermee mixen, random
  Overgangen effecten etc: energiek en disco achtig, commercieel gevoel (Monza,
  Excape, The Palace)

------------- */

var renderer = new GlRenderer();
var logo_source = new VideoSource(renderer, {});
var source1 = new VideoSource(renderer, {});
var source2 = new VideoSource(renderer, {});

var filemanager_logo = new FileManager( logo_source )
filemanager_logo.load_set(logoset)
var filemanager1 = new FileManager( source1 )
filemanager1.load_set(dinerset)
var filemanager2  = new FileManager( source2 )
filemanager2.load_set(dinerset)

/*
var effect_a1 = new ColorEffect( renderer, { source: source1 } )
var effect_a2 = new ColorEffect( renderer, { source: effect_a1 } )
var effect_b1 = new ColorEffect( renderer, { source: source2 } )
var effect_b2 = new ColorEffect( renderer, { source: effect_b1 } )
*/

var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
// var effect_f1 = new ColorEffect( renderer, { source: mixer1 } )
var mixer2 = new Mixer( renderer, { source1: mixer1, source2: logo_source });
// var effect_f2 = new ColorEffect( renderer, { source: effect_f1 } )

var bpm = new BPM( renderer );
bpm.add( mixer1.pod )

var output = new Output( renderer, mixer2 );

renderer.init();
renderer.render();

/* -------------------------------------------------------------------------- */

bpm.bpm = 8
bpm.bypass = true
mixer1.pod(1)
mixer2.pod(1)

// set a little contrast
// effect_f1.effect(61)
/// effect_f1.extra(0.4)

/* -------------------------------------------------------------------------- */

var partymode = false
var wasSet = false
var beats = 0

/*
1 ADD (default),
2 SUBSTRACT,
3 MULTIPLY,
4 DARKEN,
5 COLOUR BURN,
6 LINEAR_BURN,
7 LIGHTEN,
8 SCREEN,
9 COLOUR_DODGE,
10 LINEAR_DODGE,
11 OVERLAY,
12 SOFT_LIGHT,
13 HARD_LIGHT,
14 VIVID_LIGHT,
15 LINEAR_LIGHT,
16 PIN_LIGHT,
17 DIFFERENCE,
18 EXCLUSION
*/

var useBlendmodes = [ 1, 7, 8 ] // 9, 10, 13, 17, 18 ]

/*
1: NORMAL (default),   regular, linear crossfade
2: HARD,               switches with a hard cut at 50%
3: NAM,                fades with an upward curvature forcing 100% opacity throughout the crossfade (lighter!)
4: FAM,                fades with a downward curve, forcing a 'overlay' period
5: NON DARK,           Never goes dark, 0-2 linear curve, capped at 1 and .36
6: LEFT,               forces the pod on 0 (locks pod)
7: RIGHT,              forces the pod on 1 (locks pod)
8: CENTER,             forces both sources at ~66% (locks pod)
9: BOOM                forces both sources at 100%, allows for overflow (lighter!) (locks pod)
*/

var useMixmodes = [ 1, 3, 5 ] //  6, 7, 8
var dice = 0
var c = 0
var next = 0
var _oldsrc1 = ""
var _oldsrc2 = ""
var _oldsrc1_time = (new Date()).getTime()
var _oldsrc2_time = (new Date()).getTime()

window.addEventListener('keypress', function(ev) {
  if ( ev.which == 112 ) {
    if ( partymode ) {
      // switch partymode off
      partymode = false
      bpm.bpm = 8
      bpm.bypass = true
      useBlendmodes = [ 1 ]
      useMixmodes = [ 1 ] //  6, 7, 8
      c = 0 // reset

      mixer2.pod(1)
      mixer1.pod(1)
      mixer1.mixMode(1)
      mixer1.blendMode(1)
      filemanager1.load_set(dinerset)
      filemanager2.load_set(dinerset)

    }else{
      // switch partymode on
      partymode = true
      bpm.bpm = 68
      bpm.bypass = false
      useBlendmodes = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
      useMixmodes = [ 1, 2, 3, 4, 5 ] // 6, 9 ] //  6, 7, 8

      mixer2.pod(1)
      mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      filemanager1.load_set(afterdinerset)
      filemanager2.load_set(afterdinerset)
    }

    setTimeout( function() {
      filemanager_logo.changez()
      filemanager1.changez()
      filemanager2.changez()
    }, 1200 )
  }

  // C
  if ( ev.which == 99 ) {
    filemanager_logo.changez()
    filemanager1.changez()
    filemanager2.changez()
    mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
  }

  // L
  if ( ev.which == 108 ) {
    console.log("do the fader 1")
    mixer2.fade(1000);
    setTimeout( function() { mixer2.fade(1000) }, 8000 );
    setTimeout( function() { mixer2.pod(1) }, 10000 );
  }

  // I
  if ( ev.which == 108 ) {
    // set info ?
  }
})

setTimeout( function() {
  // populate the app
  if ( window.in_app ) {
    window.eu.check_set(filemanager_logo.set)
    window.eu.check_set(filemanager1.set)
    window.eu.check_set(filemanager2.set)
  }

  setTimeout( function()  {
    filemanager_logo.changez()
    filemanager1.changez()
    filemanager2.changez()
  }, 3000)

  cycle() // start the app

}, 1500 )

// main loop
function cycle() {
  if ( bpm.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    dice = Math.random()
    console.log("beat!", beats, dice)

    if ( partymode ) {
      if (beats%4 == 0 && dice < 0.2 ) source1.jump()
      if (beats%4 == 0 && dice < 0.2 ) source2.jump()
      if (beats%6 == 0 && dice < 0.64 ) filemanager_logo.changez();
      if (beats%8 == 0 && dice < 0.64 ) filemanager1.changez();
      if (beats%12 == 0 && dice < 0.64 ) filemanager2.changez();
      if (beats%16 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
      if (beats%18 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
      if (beats%24 == 0 && dice < 0.3 && ( mixer2.pod() == 1 || mixer2.pod() == 0 ) ) {
        console.log("do the fader 2");
        mixer1.pod( Math.round( mixer1.pod() ))
        mixer1.blendMode(1)
        mixer1.mixMode(1)
        mixer2.blendMode(1)
        mixer2.mixMode(1)
        mixer2.fade(1000);
        setTimeout( function() { mixer2.fade(1000) }, 8000 );
      }
    }
  }

  if ( bpm.render() < 0.01 ) {
    wasSet = false
  }

  // -------------------------------------------------------------------------

  if (!partymode) { // this is not a party

    c++
    // if (c%800 == 0 && dice < 0.12 ) filemanager2.changez();//setTimeout(function() { source1.jump() }, 1500 )
    // if (c%900 == 0 && dice < 0.12 ) filemanager1.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    if (c%900 == 0 && dice < 0.12 ) mixer2.fade(1000); //setTimeout(function() { source1.jump() }, 1500 )
    if (c%1000 == 0 && dice < 0.1 ) filemanager_logo.changez(); //setTimeout(function() { source1.jump() }, 1500 )
    //if (c%1000 == 0 && dice < 0.6 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    //if (c%1200 == 0 && dice < 0.3 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
    if (c%1600 == 0 && dice < 0.2 && ( mixer1.pod() == 1 || mixer1.pod() == 0 ) ) mixer1.fade(1800)
    if (c%2400 == 0 && dice < 0.5 ) c = Math.round( Math.random() * 6000 )
    if (c%3200 == 0 && dice < 0.6 && ( mixer2.pod() == 1 || mixer2.pod() == 0 ) ) {
      console.log("do the fader 2");
      mixer1.pod( Math.round( mixer1.pod() ))
      mixer1.blendMode(1)
      mixer1.mixMode(1)
      mixer2.blendMode(1)
      mixer2.mixMode(1)
      mixer2.fade(1000);
      setTimeout( function() { mixer2.fade(1000) }, 12000 );
    }

    // check c ~20 seconds
    if (c%200 == 0) {
      console.log("I'm still alive ... ")
    }

    // check source
    if ( _oldsrc1 != source1.video.src && ( (new Date()).getTime() - _oldsrc1_time > 180000 ) ) {
      console.log("source timeout, change src1")
      filemanager1.change()
      if ( _oldsrc1 != source1.video.src ) {
        _oldsrc1_time = (new Date()).getTime()
        _oldsrc1 = source1.video.src
      }
    }

    if ( _oldsrc2 != source1.video.src && ( (new Date()).getTime() - _oldsrc2_time > 180000 ) ) {
      console.log("source timeout, change src2")
      filemanager2.change()
      if ( _oldsrc2 != source2.video.src ) {
        _oldsrc2_time = (new Date()).getTime()
        _oldsrc2 = source2.video.src
      }
    }
  }

  requestAnimationFrame(cycle)
}
