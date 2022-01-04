var renderer = new GlRenderer();
var source1 = new VideoSource(renderer, { src: "/resolve_streamable/3zt9ea" });
var source2 = new VideoSource(renderer, { src: "/resolve_streamable/2z3acq" });
var testSource1 = new GifSource(   renderer, { src: '//nabu.sense-studios.com/assets/nabu_themes/sense/slowclap.gif' } );
var gifmanager1 = new GiphyManager( testSource1 )
var testSource2 = new GifSource(   renderer, { src: '//nabu.sense-studios.com/assets/nabu_themes/sense/slowclap.gif' } );
var gifmanager2 = new GiphyManager( testSource2 )
var mixer1 = new Mixer( renderer, { source1: testSource1, source2: testSource2 });
var bpm = new BPM()
var bpm = new BPM( renderer );

bpm.add( mixer1.pod )
window.addEventListener('keypress', function(ev) {
  if (ev.which == 13) bpm.tap()
})

var output = new Output( renderer, mixer1 );
renderer.init();
renderer.render();

renderer.scene.children[0].scale.x = 0.8
renderer.scene.children[0].position.z = -10

var strlist = [
  /*
  "what is your truth",
  "nirvana",
  "captain black",
  "bath thumbnailssex clubs",
  "freaky people",
  "getting it on",
  "nervous",
  "restless",
  "ive seen it all",
  "twinkies",
  "fast and greazy",
  "tub",
  "sleep",
  "drank up all my money",
  "your gone",
  "high",
  "high all the time",
  "mind",
  "Psh",
  "Oop",
  "Hustle",
  "Oh man",
  "Peasants",
  "Dad joke",
  "No regrets",
  "Everything",
  "trending"
  */

  "black widow",
  "marvel",
  "hulk",
  "iron man",
  "spiderman",
  "avengers",
  "dr. strange",
  "x-men",
  "thor"
]

// add a function that moves the mixer handle from left to right.
var c = 0;
var f = 0;
var last_beat = false
setInterval( function() {
  c += 0.01 // << try and change this in 0.1
  //f = ( Math.sin(c) * 0.5 ) + 0.5
  //mixer1.pod ( f );
  if ( bpm.bpm_float > 0.99 && !last_beat ) {
    console.log("beat! ", bpm.bpm, c)
    last_beat = true

    console.log("role dice")
    if (Math.random() > 0.90) gifmanager1.change();
    if (Math.random() > 0.90) gifmanager2.change();

    if (Math.random() > 0.90) {
      var r1 = strlist[Math.floor(Math.random() * strlist.length)]
      console.log("search: ", r1)
      gifmanager1.search(r1, gifmanager1.change );
    }

    if (Math.random() > 0.90)  {
      var r2 = strlist[Math.floor(Math.random() * strlist.length)]
      console.log("search: ", r2)
      gifmanager2.search(r2, gifmanager2.change );
    }
  }

  if ( bpm.bpm_float < 0.1 && last_beat) {
    last_beat = false
  }


  if (c > 50000) {
    c = 0
    if (Math.random() > 0.5) {
      console.log("change1")
      gifmanager2.change()
    }else{
      console.log("change2")
      gifmanager1.change()
    }

    if (Math.random() > 0.1) {
      var r1 = strlist[Math.floor(Math.random() * strlist.length)]
      var r2 = strlist[Math.floor(Math.random() * strlist.length)]
      console.log(" CHANGE TAGS", r1, r2)
      if (Math.random() > 0.5) gifmanager1.search(r1, gifmanager1.change )
      if (Math.random() < 0.5) gifmanager2.search(r2, gifmanager2.change )
    }
  }
}, 10)

// give it a little time to boot, then load and change
setTimeout( function() {
  gifmanager1.search(strlist[Math.floor(Math.random() * strlist.length)], gifmanager1.change )
  gifmanager2.search(strlist[Math.floor(Math.random() * strlist.length)], gifmanager2.change )
}, 1200)


/*
  http://127.0.0.1:3001/yt/yArprk0q9eE

  https://cdn-cf-east.streamable.com/video/mp4/uodb43.mp4?Expires=1630276140&Signature=GHIqrdh7JT6ZjBeVbFSoCZLs8zs6CR27hN82AUAKvKADM1y1VKmK5K1Bm~6jcNrf1SgVNHlwIWP2tzG9xxf031yC1aabYcvbJMxJ3C8PdyKRrshgg~qgNpSaaM3DbO6SQkdK7GXOlJ-CFlAltQx9IfZ1bVulX~jNKGMX3iG-u8PMckXK42Mfgviw4g56PGySzqyT1zDkdnzC~PFPB4pgnvUp3RgElCD9Lsya9xE9fSo~v0n0SgTpPTzN9TrF9Umq2Z9fqluP5pusdNR5WGwuo1XePTj60PJbo7wQGXVVoVTSOCz-SXHUZDRFV8P0d2GKiz3vthRi-tC2awupJKTxnw__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ

  https://streamable.com/d6qecn
  https://streamable.com/e/d6qecn
  https://api.streamable.com/videos/itas2i
  https://cdn-cf-east.streamable.com/video/mp4/d6qecn.mp4?Expires=1602807660&Signature=ZfzkKaOGP9bqjUZ~qNs76vnyB~zYL8mCpi66qPrNeyr6fdAi2qtMiP1HzZigsykm98Yuvi94w6MbwQVcjrzptuVkAL2A6f-7Mo-Ra~ItTnFrUn3emRFk0hOskvdIXcP89AKgog~UhbzuSuhEpR6pht72MUkp09iyCeVC5cc9FpknSkdBoivdc6-I9okBVhTqFQzH-U0MWC4x6xetpQswuuOSknjAam1ZBIxBtxRrm0VnwpD2BthsV6jPEYfsDEIG9xWRvJQHzMWxkzzkaESUDu4j3AZPxZWiIe4RE6Urww8LFVIMDapz8dfS1HXyVDU98T24LRCQjQDnJxspKNHV4A__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ
  https://cdn-cf-east.streamable.com/video/mp4/mdgqan.mp4?Expires=1602807660&Signature=ZfzkKaOGP9bqjUZ~qNs76vnyB~zYL8mCpi66qPrNeyr6fdAi2qtMiP1HzZigsykm98Yuvi94w6MbwQVcjrzptuVkAL2A6f-7Mo-Ra~ItTnFrUn3emRFk0hOskvdIXcP89AKgog~UhbzuSuhEpR6pht72MUkp09iyCeVC5cc9FpknSkdBoivdc6-I9okBVhTqFQzH-U0MWC4x6xetpQswuuOSknjAam1ZBIxBtxRrm0VnwpD2BthsV6jPEYfsDEIG9xWRvJQHzMWxkzzkaESUDu4j3AZPxZWiIe4RE6Urww8LFVIMDapz8dfS1HXyVDU98T24LRCQjQDnJxspKNHV4A__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ



  https://api.streamable.com/videos/[streamable-id]
  files.mp4.url

  status: 2,
  framerate: 30,
  height: 240,
  width: 320,
  bitrate: 422357,
  size: 1634154,
  duration: 30.896667
*/
