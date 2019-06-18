var renderer = new GlRenderer();

var video1 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/302/302-720.mp4'} )
var video2 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/348/348-720.mp4'} )
var video3 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/344/344-720.mp4'} )
var video4 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/351/351-720.mp4'} )

var chain1 = new Chain( renderer, { sources: [ video1, video2, video3, video4 ] } );
var socket1 = new SocketController( renderer )
socket1.debug = true
var output = new Output( renderer, chain1 )

renderer.init();
renderer.render();

chain1.setAll(0)

socket1.addEventListener( 1, function(arr) {
  chain1.setChainLink( 0, arr[1] )
})

socket1.addEventListener( 2, function(arr) {
  chain1.setChainLink( 1, arr[1] )
})

socket1.addEventListener( 3, function(arr) {
  chain1.setChainLink( 2, arr[1] )
})

socket1.addEventListener( 4, function(arr) {
  chain1.setChainLink( 3, arr[1] )
})
