var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var io = null

var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var radioRouter = require('./routes/radio');
var ioRouter = require('./routes/io');
var apiRouter = require('./routes/api');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// when we have io,pass it to the requests
app.use(function(req, res, next) {
	req.io = io;
	next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));

// set cors to all
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/radio', radioRouter);
app.use('/io', ioRouter);
app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// -----------------------------------------------------------------------------
// For Sockets
// -----------------------------------------------------------------------------
// get sockets.io and pass it to the router
app.setIo = function( _io ) {
  io = _io
  ioRouter.setIo(_io)
}


/*
var io = null
app.setIo = function( _io ) {
  io = _io
  ioRouter.setIo(_io)

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
}
*/

module.exports = app;
