
/*

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
    // remove user

  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

  socket.on('command', function(msg){
    console.log('command: ' + msg);
    io.emit('command', msg);
  });
});
*/

/*
exports.author_list = function (req, res, next) {

    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('author_list', { title: 'Author List', author_list: list_authors });
        })

};
*/

var io

exports.setIo = function( _io ) {
  console.log("controller set io")
  io = _io
}

exports.test = function (req, res, next) {
  console.log("helloooooooo nurse")
  console.log("has io:", io)
  io.emit('command', 'ping')
  res.send({message:"ok"})
}
