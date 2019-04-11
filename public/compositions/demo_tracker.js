var renderer = new GlRenderer();
var source1 = new VideoSource(renderer, {});
var source2 = new VideoSource(renderer, {});
var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });
var bpm1 = new BPM( renderer )
var output = new Output( renderer, mixer1 );
renderer.init();
renderer.render();


var tracker_socket = new SocketController();
tracker_socket.addEventListener('ready', function(d) {
  console.log('tracker ready: ', d )
})

// send beats


var wasSetUp = false
var wasSetDown = false
var beats = 0
function update(timestamp) {
  //console.log( bpm1.render() )

  if (bpm1.render() > 0.98 & !wasSetUp ) {
    //console.log('beat!')
    beats += 1
    tracker_socket.send( '6706', 'beats', beats )
    wasSetUp = true
  }

  if (bpm1.render() < 0.02 & !wasSetDown ) {
    //console.log('beat!')
    beats += 1
    tracker_socket.send( '6706', 'beats', beats )
    wasSetDown = true
  }

  if (bpm1.render() < 0.94 & wasSetUp ) {
    wasSetUp = false
  }

  if (bpm1.render() > 0.02 & wasSetDown ) {
    wasSetDown = false
  }

  window.requestAnimationFrame(update);
}

window.requestAnimationFrame(update);
