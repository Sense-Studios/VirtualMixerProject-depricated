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


var fs = require('fs');
var ytdl = require('ytdl-core');
var request = require('request');

router.get('/yti/*', function(req, res, next) {

  var url = "https://www.youtube.com/watch?v=" + req.originalUrl.split('/yti/')[1]
  var videoID = ytdl.getURLVideoID(url)
  console.log("gooo ", videoID )

    // Example of choosing a video format.
  ytdl.getInfo( videoID, (err, info) => {
    if (err) throw err;
    let format = ytdl.chooseFormat(info.formats, { quality: '134' });
    if (format) {
      console.log('Format found!', format);
    }
  });


  ytdl.getInfo( url, {}, function( err, info ) { console.log(err, info) } )
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

router.get('/yt/*', function(req, res, next) {
  var url = "https://www.youtube.com/watch?v=" + req.originalUrl.split('/yt/')[1]
  //ytdl.getBasicInfo(url, {filter: (format) => format.container === 'mp4',}, function( err, info ) { console.log(info)} )

  //res.header('Content-Type': 'video/mp4');
    res.header('Accept-Ranges', 'bytes');
  res.header('Content-Type', 'video/mp4')


  var yt_result = ytdl( url, {
    filter: (format) => format.container === 'mp4',
    begin: '1:15'
    // range: { start: 100 }
  } )
  //console.log('oi oi oi')
  yt_result.pipe( res )

  let starttime = 0;
  yt_result.on('progress', function(chunkLength, downloaded, total) {
    return
    const percent = downloaded / total;
    const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
    //readline.cursorTo(process.stdout, 0);
    //process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
    //process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)\n`);
    //process.stdout.write(`running for: ${downloadedMinutes.toFixed(2)}minutes`);
    //process.stdout.write(`, estimated time left: ${(downloadedMinutes / percent - downloadedMinutes).toFixed(2)}minutes `);
    //readline.moveCursor(process.stdout, 0, -1);

    //readline.cursorTo(process.stdout, 0);
    console.log(`\n${(percent * 100).toFixed(2)}% downloaded `);
    console.log(`(${(downloaded / 1024 / 1024).toFixed(2)} MB of ${(total / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`running for: ${downloadedMinutes.toFixed(2)} minutes`);
    console.log(`estimated time left: ${(downloadedMinutes / percent - downloadedMinutes).toFixed(2) } minutes `);
    //readline.moveCursor(process.stdout, 0, -1);

  });

  yt_result.on('error', (err) => {
    console.log('-- ERROR: ', err, '\n\n');
  });

  yt_result.on('end', () => {
    console.log('-- end\n\n');
  });

  //req.pipe( yt_result.createWriteStream('video.mp4') )
  /*
  var result = ytdl.getBasicInfo( "https://www.youtube.com/watch?v=" + req.originalUrl.split('/yt/')[1], function(err, info) {
    console.log("heeeeeere goes ...")
    console.log(" --> ", resu)
    //res.sendFile( path.join(__dirname, '../public', info.formats[0].url ) );
    //request( info.formats[0].url ).pipe(res);
    request( resu ).pipe(res);
  })
  */
})


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
