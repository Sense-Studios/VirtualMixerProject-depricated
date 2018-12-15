var renderer = new GlRenderer();

// create sources
//var testSource1 = new VideoSource( renderer, { src: '//nabu-dev.s3.amazonaws.com/uploads/video/556ce4f36465764bdf590000/720p_5000kbps_h264.mp4' } );
//var testSource1 = new WebcamSource(renderer, {});
var testSource1 = new VideoSource( renderer, { src: '/video/alaro_carnage_the_underground_gif_remix.mp4' } );
var gifSource1 = new GifSource(renderer, { src: '/gif/gifshow/5b4cccdec8c97546ca88f2efc589ba58.gif' });
var gifSource2 = new GifSource(renderer, { src: '/gif/gifshow/5b4cccdec8c97546ca88f2efc589ba58.gif' });

var mixer1 = new Mixer(renderer, { source1: testSource1, source2: gifSource1 })
mixer1.mixMode(2)

var mixer2 = new Mixer(renderer, { source1: gifSource2, source2: mixer1 })
mixer2.mixMode(5)

var switcher1 = new Switcher( renderer, { source1: mixer1, source2: mixer2 } )

var output = new Output( renderer, switcher1 )

// create a bpm addon
// var bpm = new BPM( renderer )
var audioanalysis1 = new AudioAnalysis( renderer, { audio: "/radio/nsb"} )
var bpm = audioanalysis1
//var audioanalysis2 = new AudioAnalysis(renderer)
//audioanalysis2.mod = 0.6
//audioanalysis2.disconnectOutput()

renderer.init();         // init
renderer.render();       // start update & animation
// =============================================================================

//mixer1.pod(bpm)
//bpm.add( mixer1.pod )
audioanalysis1.add( mixer2.pod )
mixer1.pod(1.3)
//audioanalysis1.add( mixer1.pod )
//audioanalysis1.add( mixer2.pod )
//mixer1/
//setInterval( function() {
//  mixer1.pod( audioanalysis1.render()*audioanalysis1.render()  )
  //console.log( mixer1.pod(), audioanalysis1.render() )
//}, 10 )

var filemanager2 = new FileManager( testSource1 )
filemanager2.load('/sets/notv.json')

function changezOnBeat() {

  var r = 60/audioanalysis1.bpm*256*1000
  //
  setTimeout( function() { changezOnBeat() }, r )
  if (!isFinite(r)) return
  console.log("changez", r, isFinite(r))
  filemanager2.changez()
}
changezOnBeat()


var gifs = [
  '008a02e89562569705c2b30d465e1ba1',
  '0dddd3aa1944fd1273ee1e34dce30fac',
  '10a0b41fef44a2bbcca03c377b3b2007',
  '16e4dc644a7fbc3d8423f39abffa199b (1)',
  '16e4dc644a7fbc3d8423f39abffa199b',
  '1a09a229893cd28ebdfd7ff173372f1a',
  '1bdc59dc93a9d6410f6c276632b79023',
  '1bf032190ff44e8d14026a7cd8621fc5',
  '1d49eb60830101275f5ce845d67bd645',
  '1d75323c15ccd56fab64dd33190cf0a8',
  '1d8f51cd5cc39a7280cd4806874723e2',
  '1d918650d213c528d77fb51f1d3c6e61',
  '1dec87e75cae7d52eaaa0659971ecd8b',
  '1efb5cac68670c077d8c7ddfe3829a4a',
  '20aef23d39a8dcb74bf663ed89ab08d6',
  '228cadbe604b12a22a1a3c8d1b492db2',
  '22a0ff47046338c1f015610bccdb3b8c',
  '241a45b4a309488afdac2eff7422b852',
  '24b31d02e13d4e63eaaba260886d1a37',
  '26126e31babfd429344207651b64b94b',
  '2955fb5871aad45d92b815f3ff0856b6',
  '2a757a0fba149549c1f0b53f1936f1e6',
  '2af08d937411b8cff996c50b9e66fbb6',
  '2d09f2844398497960c8a39c0693b16c',
  '2d974d71915c2bf72d30ef60f8731267',
  '2ddd62584c367fdcc5943e9ba90c7c36',
  '2ef8f18fe9d034cfa1a2a4a0e9c90ee8',
  '2fed39b30e98c2b6c6c0b162bca3d19f',
  '3065419930fe7c685cf4e50cd3cd8537',
  '30ec7d4ad95d29e6d773138d3f1cf982',
  '368f454f8509ad0b520a4ba33a2bf13a',
  '37499c2d027841832e7f1222876b530d',
  '38ad6c784e0b009533f29cfb86e10007',
  '396134ebef03e49f07436bc8eecb26da',
  '3a7206ce8289b8a900f4a41300ea2ce4',
  '3b1745be1e159e5c50bcc05f372050ba',
  '3c7b1b495816a9843c6e0bd55fd4b856',
  '3c8065af2ffa49649bdef2e1510b445c',
  '3ca9d8b3aa637d6f48242a41ed886dec',
  '3cf56392a9059fc9ad79f420da8685d3',
  '4007427a7df5eff2525317990853a275',
  '4156f7a6c4adab5880f6c714a1cf9803',
  '426dddb81289e72b1ef7099b2e0a13fa',
  '43790d279995a3a2aa912b230ece15f7',
  '43d0f9b78ccf5b3b772b7c5fe022ea93',
  '43e91075465bdf1e11bce7e95e143dd2',
  '44539fe9c74efbf9f6b89e37f177f571',
  '460873178ab5680b3cab2fd0cd8873d1',
  '4621650200dd471987c52b14d330b618',
  '47a9a4120ed467b2893e8293c442d26b',
  '4853e8362a16d49b57351b34f1104539',
  '4f697465de5a38d177abd6d022a0401b',
  '4f7a9aaacfac9c7f6808b75a3107ed37',
  '50db3c030e540b19368395581861243e',
  '519e245903ca08432d938f036517d337',
  '5404f3677bb50175869ba8967bc7ce74',
  '58a944b0faa4d14a4eae9dde7950a6ad',
  '5b4cccdec8c97546ca88f2efc589ba58',
  '5ded9311a413cd38163fe73f70656958',
  '5f05b8e968388c1dca6d644087534f68',
  '5f7a60591286779152c35443d3b44014',
  '60ef1b915313f0e0f1a223a1597a7f35',
  '63c90ae6a2fbca537a6976475f22623b',
  '65ac39dd8e39966fdf97a151892eaabd',
  '6a162730c27167593ae805a09e0e48bc',
  '6bef7679b9d108ce038d65b67442b0ff',
  '6c4a5eee4a5ea39f75cc6a6dddd86d8f',
  '6dbd14b911f74a9e2d4999df715dd4c9',
  '6f0c35642bfb102dfbc8f7876bf95a02',
  '722a7e60ff3b682be701e5499facaa24',
  '73ac1f506b97ca4f8e14d625230874f6',
  '73d281a3e1149c7a0f0df442663c8fec',
  '7508092a4e72a4f5e139d35df85da241',
  '7519c9b013c6306eddc6fe878c45c093',
  '75ae39c682a4dad5ea527b1edbdd4ba4',
  '7f28df254e05a9dfd15b06bc74e6022d',
  '7ffec3150ae543653113c4fff530a3d7',
  '80f8bcf8e83a172de6f2257469301db4',
  '82f9dfe3e1b4046f421735864c708d48',
  '83db5e717cea5e4d1b627cd4de3e1aeb',
  '8681348a39767c11ef9e68522194376e',
  '88eef500825ad74cac5869e33da82bc9',
  '8a7e382bc0b65a9cb38626256af02e72',
  '9453e1cb0cc1c580d7012af7740962d8',
  '9531866bcca5f8ce4c67ddca0e8e3f07',
  '9983dfde9a0407f670d664980280e1a4',
  '99b790e31d9c55790a7eb2630bc805e3',
  '9ae3c528613ccc6d63b7390cd8c0ff51',
  '9c02c909bd57c4989a901391abafdbcc',
  '9cbfa8ac0403131079413a5cd5ed327f',
  '9d660ccb5b248bf3142a083effe38a97',
  'a0b90d2ad7ed5d684b582ef42a3bb7d7',
  'a0f47d1d849768c88831fabd4d315bd4',
  'a22434eda195bb8670cc7be00d320121',
  'a443ae90a963a657e12737c466ddff95',
  'a86ea053e2507064ec44ea642c432809',
  'a8e0e853112fc5cd3552b328aa174ef8',
  'aa24e0127be67be1dcc972fdaa81450a',
  'ac5316e7ee23e3194c09d87be7abc7a6',
  'ae8af86d57d26f4c736e33c13afc394f',
  'b444281ec3402c89236d7ef2738282ff',
  'b4be2cdb810d831d671f1f7286302169',
  'b651bbfb1b00f2174ea5f2dc5e90daa9',
  'b744e1243c1f565a905c5e5ab91dc511',
  'ba3f1a04d38355e05c8bcb31dfe279be',
  'bb9b53b596a504fb1e80507bf70a0980',
  'c1142dfc92f32ca462dcc30a45c00b0a',
  'c2f54cbae2f58c403cd70e55e327c19f',
  'c7a8c32120ad1e0a7d117040fd6f2e28',
  'c94792cb60edb03ae5cf145ddf984cf1',
  'cdbd0eff5877f82b5f5f8298a5014524',
  'ce4e79592418349d9630ea3c0a26b085',
  'ced78c0ac28ec4160682411dc3fea3c3',
  'd003bdc157747f39d7ff6bb1470ee7f5',
  'd04bb34dc3aae0da24daaf78166a79f9',
  'd097d1aebd12bc519263e23f105039e1',
  'd2592ffaaf11583672771f0340e6cef9',
  'd4217f9df3e226afb6497891f637151f',
  'd677d676dc9c5fb12371211ec7602666',
  'd92d1d287bd45d1744c82ff4560c52ea',
  'dc509fb10cca00fac265357cf4eba821',
  'ddf62779f2c1be9bf980c7f13c5c5dd0',
  'def3f91eb147aa6c4cc83a66d0a6c9a5',
  'df2bdf9feb141b18021d06e22e93ea42',
  'e37169096107208eb2651f940bad8744',
  'e623d7a28983df478f925f570c07f6d1',
  'e7457dd47e9f2880e019ed31580c1287',
  'edf7ae79fb3c521e4206d35b13966d7f',
  'f29cf9eb2a1b33715701e22c373764c0',
  'f76eb0fd717b39cfd43e83e4efb37b77',
  'f8c9400df3a8b17301661302301cd091',
  'f925ed2c050852eef8d063aa0d29c2a4',
  'f9f98aaf2f22125aeacc3a4e150a527a',
  'feca684151ed547d8396677af5141cb9',
  'fed5bf15152ea94e2fe69ba83d292e94'
]



var updateSource = function( _source, initial = 0 ) {
  //console.log('jump', Math.random())
  //testSource1.jump()

  _source.src( '/gif/gifshow/' + gifs[ Math.floor( Math.random() * gifs.length ) ] + ".gif" )

  var r = ( audioanalysis1.bpm^2 ) + initial;
  //r = Math.floor(Math.random() * ( audioanalysis1.bpm * 50 ) ) + 6000 + initial;
  var r = 60/audioanalysis1.bpm*32*1000 + initial;
  setTimeout( updateSource, r, _source  )
  if ( !isFinite(r) ) return
  if ( isNaN(r) || r < 10000) r = 10000 + initial;
  console.log("update src", r, _source.currentSrc)
}

gifSource1.src( '/gif/gifshow/' + gifs[ Math.floor( Math.random() * gifs.length ) ] )
gifSource2.src( '/gif/gifshow/' + gifs[ Math.floor( Math.random() * gifs.length ) ] )

setTimeout( function() {
  updateSource( gifSource1, 9000 )
  updateSource( gifSource2, 18000 )
} , 200 )

var blend_mod = 3200
var scratch_mod = 12000
// be careful with scratch, especially running online it runs with bad performance
function scratch() {
  var r =  ( Math.random() * scratch_mod ) * bpm.bps
  setTimeout( function() {
    scratch()
  }, r )
  testSource1.jump()
}
scratch()


function change_blendmode() {
  //var r = Math.floor( Math.random() * blend_mod )
  var r = blend_mod / bpm.bps
  setTimeout( function() {
    change_blendmode()
  }, r )

  // only use a subset of the mixmodes
  var use = [ 1, 7, 8, 9, 10, 13, 17, 18 ]
  var br = use[Math.floor( Math.random() * use.length )]
  mixer1.blendMode( br );
  console.log("BLENDMODE", br)
    // of 18: 1 ADD (default), 2 SUBSTRACT, 3 MULTIPLY, 4 DARKEN, 5 COLOUR BURN,
    // 6 LINEAR_BURN, 7 LIGHTEN,  8 SCREEN, 9 COLOUR_DODGE, 10 LINEAR_DODGE,
    // 11 OVERLAY, 12 SOFT_LIGHT, 13 HARD_LIGHT, 14 VIVID_LIGHT, 15 LINEAR_LIGHT,
    // 16 PIN_LIGHT, 17 DIFFERENCE, 18 EXCLUSION
}
change_blendmode()
