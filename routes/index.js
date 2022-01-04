var express = require('express');
var io = require('socket.io');
var router = express.Router();
var path = require('path')

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log('this is index')
  console.log( express.io )

  res.render( 'compositions/vmp_demo', { title: 'VirtualMixProject: ' });
  /*
    res.render('index', {
    title: 'Express'
    //giphy_key: process.env.GIPHYKEY,
    //marduq_key: process.env.MARDUQKEY
  });
  */
});

// for testing
router.get('/test/*', function(req, res, next) {});
router.get('/example1', function(req, res, next) {
  res.render('compositions/example1', { title: 'Example 1' });
});

router.get('/docs', function(req, res, next) {
  res.render('docs/');
});

// FIXME: routing scheme should be nicer
// editors and controllers
router.get('/editors/*', function(req, res, next) {
  var repl_url = req.originalUrl.replace('/editors', 'editors')
  res.render(repl_url, { title: 'Editors: ' });
});

// depricated
router.get('/controllers/*', function(req, res, next) {
  var repl_url = req.originalUrl.replace('/controllers', 'remotes')
  res.render(repl_url, { title: 'Remote Controller: ' });
});

router.get('/remotes/*', function(req, res, next) {
  var repl_url = req.originalUrl.replace('/remotes', 'remotes')
  repl_url = repl_url.split('?')[0]
  console.log("replace url was: ", repl_url)
  res.render(repl_url, { title: 'Remote Controller: ' });
});

// for composiions see /views
router.get('/mixer/*', function(req, res, next) {
  //console.log(req, res, next)
  var repl_url = req.originalUrl.replace('/mixer', 'compositions')
  var title = req.originalUrl.replace('/mixer/', '')
  repl_url = repl_url.split('?')[0]
  console.log("replace url was: ", repl_url)
  res.render(repl_url, { title: 'Composition: ' + title });
});

router.get('/nocorsaudio/*', function( req, res, next ) {
  var repl_url = req.originalUrl.replace('/nocorsaudio', '/audio')
  res.header('Access-Control-Allow-Origin', '*');
  // Access-Control-Allow-Origin: <origin> | *
  // Origin
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendFile( path.join(__dirname, '../public', repl_url) );
});

const fetch = require('node-fetch');
router.get('/resolve_streamable/*', function( req, res, next ) {
  //var repl_url = req.originalUrl.replace('/resolve_streamable', '/streamable')
  var videoID = req.originalUrl.split('/resolve_streamable/')[1].split('/')[0]

  console.log("get data for video id", videoID)
  var apiurl = 'https://api.streamable.com/videos/' + videoID;
  var get_data = request(apiurl)

  fetch(apiurl)
  .then(response => response.json())
  .then( function(data) {
    var newurl = data.files.mp4.url
    console.log("new url", newurl)
    //res.send(JSON.stringify(data));

    request(newurl).pipe(res);
  });


  /*
  res.writeHead(200, {
    'Content-Length': total,
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'POST, GET, OPTIONS',
  });
  */

  //var newurl = 'https://cdn-cf-east.streamable.com/video/mp4/n9k7d0.mp4?Expires=1630280880&Signature=Hp5DeP-k0IGb8y49-ky62ocQtWOA-cBvpjRJK5ISzOXd2y-2z961msR-cYTLJzKD1~1wFQjVuHmqlRn~QizrAf804XBSMqCo8-Dhlgt9GiYUiB94IIVHFHSHWDHGiG9vSAX7ZmZJwI-D4xyS30qSIGx0YbAaVJJGwdquzv4422U7G6RNI2~3sbuGHE84C6yAaHIm2JQ8Ngt8iTbQVjstSLIj27UGNnlF~KDerPfVkXzLVyTnzGn0K1IZEBXvQmlqmtN7UdCwqY-6jyYc~1AmD8U0DcN1K7zF5XcZ3egcR5foIiTvuDGBg7LDp8QyclvtSB2ftIVt2nqGhkIUi1iWfQ__&Key-Pair-Id=APKAIEYUVEN4EVB2OKEQ';
  //res.header('Access-Control-Allow-Origin', '*');
  //request(newurl).pipe(res);


  // Access-Control-Allow-Origin: <origin> | *
  // Origin
  //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //res.header('Access-Control-Allow-Headers', 'Content-Type');
  //res.sendFile( path.join(__dirname, '../public', repl_url) );
});

/* -------------------------------------------------------------------------- */

var fs = require('fs');
var ytdl = require('ytdl-core');
var request = require('request');

router.get('/yt/*', function(req, res, next) {
  var videoID = req.originalUrl.split('/yt/')[1].split('/')[0]
  var itag = req.originalUrl.split('/yt/')[1].split('/')[1]
  var url = "https://www.youtube.com/watch?v=" + videoID

  if (itag !== undefined) {
    var yt_result = ytdl( url, { filter: (format) => format.itag === itag } )
  }else{
    var yt_result = ytdl( url )
  }


  var ctl = null
  yt_result.once('response', (resp) => {
    console.log(' ----------------------------- ')
    console.log( resp.headers['content-length'] )
    console.log(' ----------------------------- ')

    var total = resp.headers['content-length']

    //res.header('Content-lenght', ctl )
    //res.header('Content-Type', 'video/mp4');
    //res.header('Accept-Ranges', 'bytes');

    /*
    if (req.headers['range']) {
       var range = req.headers.range;
       var parts = range.replace(/bytes=/, "").split("-");
       var partialstart = parts[0];
       var partialend = parts[1];

       var start = parseInt(partialstart, 10);
       var end = partialend ? parseInt(partialend, 10) : total-1;
       var chunksize = (end-start)+1;
       console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

       // var file = fs.createReadStream(path, {start: start, end: end});
       //res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': total, 'Content-Type': 'video/mp4' });
       res.writeHead(206, { 'Content-Length': total, 'Content-Type': 'video/mp4','Accept-Ranges': 'bytes', });
       yt_result.pipe( res )

     } else {
       console.log('ALL: ' + total);
       res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', });
       //fs.createReadStream(path).pipe(res);
       yt_result.pipe( res )
     }
     */

     res.writeHead(200, {
       'Content-Length': total,
       'Content-Type': 'video/mp4',
       'Accept-Ranges': 'bytes',
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
       'Access-Control-Allow-Headers': 'POST, GET, OPTIONS',
     });

     yt_result.pipe( res )
  })

  yt_result.on('info', function( info, format) {
    //console.log(' ----------------------------- ')
    //console.log(info)
    console.log(' ----------------------------- ')
    console.log(format)
    console.log(' ----------------------------- ')
  })


  //if (req.headers['range']) {
  //  res.writeHead(206, { 'Content-Length': 21977813, 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', });
  //  yt_result.pipe( res )
  //}else{
  //}

  //'Content-Length': 21977813,




})

/* -------------------------------------------------------------------------- */

router.get('/yti/*', function(req, res, next) {

  var url = "https://www.youtube.com/watch?v=" + req.originalUrl.split('/yti/')[1]
  var videoID = ytdl.getURLVideoID(url)
  console.log("gooo ", videoID )

  // Example of choosing a video format.
  //ytdl.getInfo( videoID, (err, info) => {
  //  if (err) throw err;
  //  let format = ytdl.chooseFormat(info.formats, { quality: '134' });
  //  if (format) {
  //    console.log('Format found!', format);
  //  }
  //});


  ytdl.getInfo( url, {}, function( err, info ) {
    // console.log(err, info)
    // res write
    res.send(JSON.stringify(info));
  } )


  //res.write('oi!') //http://virtualmixproject.com/yti/3pD68uxRLkM
})

var ytsr = require('ytsr');

router.get('/yt_set/*', function(req, res, next) {

  var query = req.originalUrl.split('/yt_set/')[1]
  let filter;

  console.log("go go g")
  ytsr.getFilters( query, function(err, filters) {
    if(err) console.log(err) //throw err;

  	filter = filters.get('Type').find(o => o.name === 'Video');
    ytsr.getFilters(filter.ref, function(err, filters) {
      if(err) console.log(err) //throw err;
    	//filter = filters.get('Duration').find(o => o.name.startsWith('Short'));
    	var options = {
    		limit: 30,
    		nextpageRef: filter.ref,
    	}

    	ytsr(null, options, function(err, searchResults) {
    		//if(err) throw err;
        if(err) {
          console.log("ERROR IN ytsr: ", err)
          return
        }

    		//console.log(searchResults);
        var results = []
         searchResults.items.forEach( function(item, i) {
           console.log( ">>>", item.link, i )
           results.push( "/yt/" + ytdl.getVideoID( item.link) )
         })

        console.log("write!")
        res.send(JSON.stringify(results));
    	});
  	});
  });
});


router.get('/yt2/*', function(req, res, next) {

  var stream = ytdl('https://www.youtube.com/watch?v=2UBFIhS1YBk', {
    requestOptions: {
      transform: (parsed) => {
        return {
          host: '127.0.0.1',
          port: 3001,
          path: parsed.href,
          headers: { Host: parsed.host },
        };
      },
    }
  });

  console.log('Starting Download');

  stream.on('data', (chunk) => {
    console.log('chunkdata')
    console.log('downloaded', chunk.length);
  });

  stream.on('end', () => {
    console.log('Finished');
  });
});


var socketConnection = function socketConnection(socket){
  socket.emit('message', {message: 'Hey!'});
};

module.exports = router;
