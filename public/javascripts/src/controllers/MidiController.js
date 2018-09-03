


// refers to ...
// https://gist.github.com/xangadix/936ae1925ff690f8eb430014ba5bc65e

function MidiController( renderer, _mixer1, _mixer2, _mixer3 ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Midi_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Control"
  _self.controllers = {};
  _self.bypass = true

  // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // init with a tap contoller
  _self.init = function() {
    console.log("init MidiController contoller.")
    //window.addEventListener( 'keydown', keyHandler )
  }

  _self.update = function() {
  }

  _self.scheme = function() {
    var scheme = {
      inputs: {
      },
      outputs: {
        tones: [],
        floats: [],
        visual: [],
        audio: []
      }
    }
    return scheme
  }
}
