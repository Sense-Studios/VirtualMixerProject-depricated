SocketSource.prototype = new Source(); // assign prototype to marqer
SocketSource.constructor = SocketSource;  // re-assign constructor

/**
 * @summary
 *  This will serve as a 'receiver' or a send/receiver module for remote video
 *  viewing; ie. you should be able to send a stream, or part theirof to another machine
 *
 *
 * @description
 *
 *  This will serve as a 'receiver' or a send/receiver module for remote video
 *  viewing; ie. you should be able to send a stream, or part theirof to another machine
 *
 *
 * @example
 *  ...
 *
 *
 * @implements Soutce
 * @constructor Soutce#SocketSource
 * @author Sense Studios
 */

 function SocketSource(renderer, options) {
  var _self = this


   /*
    http://www.coding4developers.com/node-js/video-stream-with-node-js-socket-io-stream-data-in-node-js-using-socket-io/
    function viewVideo(video,context){
      context.drawImage(video,0,0,context.width,context.height);
      socket.emit('stream',canvas.toDataURL('image/webp'));
     }

     var socket = new WebSocket('ws://localhost');
     socket.binaryType = 'arraybuffer';
    socket.send(new ArrayBuffer);

    var theDataURL = canvas.toDataURL('image/jpeg',jpgQuality);

    // deserialize
    var img=new Image();
img.onload=start;
img.src=theBase64URL;
function start(){
    document.body.appendChild(img);
    // or
    context.drawImage(img,0,0);

  _self.addStream()
  _self.sendStream()
  _self.addListener()
  */
 }
