const fs = require('fs');

// npm i video-thumbnail-generator
// https://www.npmjs.com/package/video-thumbnail-generator
const ThumbnailGenerator = require('video-thumbnail-generator').default;


var _self = this

/**
 * @description
 *  The ioController is a databaseless socket/ router controller
 *
 * @implements Controller
 * @constructor require('ioController')
 * @example ---
 */

// get IO from app

// is this the first client? return true, else false.
// first client may sent music and beats

// /api/v1/test
const testFolder = '/mnt/d/_work/VirtualMixerProject/public/video/ignore/clutter2/';

exports.test = function( msg ) {
  console.log("test: ", msg)
}

exports.listFiles = function( _callback ) {

  fs.readdir(testFolder, (err, files) => {
    var filtered_files = []
    files.forEach(file => {
      console.log(file);
      if (file.substr(-4).toLowerCase() == ".gif" ) {
        filtered_files.push(file)
      }

    });
    _callback(filtered_files)
  });
}

exports.generateThumbnails = function() {
  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      console.log(file);
      if ( file.substr(-4).toLowerCase() == ".mp4" ) {
        var tg = new ThumbnailGenerator({
          sourcePath: testFolder + file,
          thumbnailPath: testFolder
          //tmpDir: '/some/writeable/directory' //only required if you can't write to /tmp/ and you need to generate gifs
        });

        console.log("generate: ", file, " => ", file.substr(0, file.length - 4 ) + ".gif" )
        tg.generateGif({fps: 10, fileName: file.substr(0, file.length - 4 ) + ".gif" })
          .then(console.log);
      }
    });
  });
}

/*
exports.dibs = function(msg, _socket) {
  console.log(" IO dibs!", msg.payload ) // should be a client UUID
  console.log(clients.length)
  // dibs = msg.payload
  clients.forEach(function(client) {
    if (_socket == client) console.log("MATCH")
    console.log( client.uuid, msg.payload )
  })

  io.emit('command', msg);

	return true // false
}
*/
