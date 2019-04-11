var renderer = new GlRenderer();
var source1 = new VideoSource(renderer, {});
var source2 = new VideoSource(renderer, {});
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
var filemanager1 = new FileManager(source1)
var filemanager2 = new FileManager(source2)
var audioanalysis1 = new AudioAnalysis( renderer, { audio: '/radio/lounge' } )
var output = new Output( renderer, mixer1 );
renderer.init();
renderer.render();

filemanager1.load_set('/sets/mixkit_co_music_and_dance.json')
filemanager2.load_set('/sets/mixkit_co_cities.json')

audioanalysis1.add( mixer1.pod )
audioanalysis1.mod = 0.5

var wasSet = false
var beats = 0
var useBlendmodes = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
var useMixmodes = [ 1, 2, 3, 4, 5, 6, 7, 8 ]
var dice = 0
setInterval(function() {
  if ( audioanalysis1.render() > 0.99 && !wasSet ) {
    wasSet = true
    beats += 1
    dice = Math.random()
    console.log("beat!", beats, dice)

    // init on second and sixth beat
    if (beats == 2) filemanager1.changez()
    if (beats == 6) filemanager2.changez()

    if (beats%8 == 0 && dice < 0.07 ) source1.jump()
    if (beats%16 == 0 && dice < 0.07 ) source2.jump()
    if (beats%8 == 0 && dice < 0.52 ) filemanager1.changez(); setTimeout(function() { source1.jump() }, 1500 )
    if (beats%6 == 0 && dice < 0.52 ) filemanager2.changez(); setTimeout(function() { source1.jump() }, 1500 )
    // if (beats%9 == 0 && dice < 0.7 ) mixer1.blendMode( useBlendmodes[Math.floor( Math.random() * useBlendmodes.length )] );
    if (beats%11 == 0 && dice < 0.4 ) mixer1.mixMode( useMixmodes[Math.floor( Math.random() * useMixmodes.length )] );
  }

  if ( audioanalysis1.render() < 0.01 ) {
    wasSet = false
  }

}, 1 )
