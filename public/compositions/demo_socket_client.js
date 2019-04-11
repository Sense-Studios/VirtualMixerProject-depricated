var renderer = new GlRenderer();

var video1 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/302/302-720.mp4'} )
var video2 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/348/348-720.mp4'} )
var video3 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/344/344-720.mp4'} )
var video4 = new VideoSource( renderer, { src: 'https://assets.mixkit.co/videos/351/351-720.mp4'} )

var chain1 = new Chain( renderer, { sources: [ video1, video2, video3, video4 ] } );
var socket1 = new SocketController( renderer )
var output = new Output( renderer, chain1 )

renderer.init();
renderer.render();

chain1.setAll(0)
socket1.addEventListener( 1,              function(arr)   { chain1.setChainLink( 0, arr[1] ) })
socket1.addEventListener( 2,              function(arr)   { chain1.setChainLink( 1, arr[1] ) })
socket1.addEventListener( 3,              function(arr)   { chain1.setChainLink( 2, arr[1] ) })
socket1.addEventListener( 4,              function(arr)   { chain1.setChainLink( 3, arr[1] ) })
socket1.addEventListener('alpha_video_1', function(_num)  { chain1.setChainLink( 0, _num ) })
socket1.addEventListener('alpha_video_2', function(_num)  { chain1.setChainLink( 1, _num ) })
socket1.addEventListener('alpha_video_3', function(_num)  { chain1.setChainLink( 2, _num ) })
socket1.addEventListener('alpha_video_4', function(_num)  { chain1.setChainLink( 3, _num ) })
socket1.addEventListener('file_video1',   function(_file) { video1.src( _file ) })
socket1.addEventListener('file_video2',   function(_file) { video2.src( _file ) })
socket1.addEventListener('file_video3',   function(_file) { video3.src( _file ) })
socket1.addEventListener('file_video4',   function(_file) { video4.src( _file ) })
