function AudioAnalysis( renderer ) {
  // returns a floating point between 1 and 0, in sync with a bpm
  var _self = this

  // exposed variables.
  _self.uuid = "Analysis_" + (((1+Math.random())*0x100000000)|0).toString(16).substring(1);
  _self.type = "Addon"
  _self.audio = ""
  _self.bypass = false

    // source.renderer ?
  var nodes = []

  // counter
  var c = 0

  // add to renderer
  renderer.add(_self)

  // init with a tap contoller
  _self.init = function() {
    console.log("init Audio Analysis Addon.")
    //window.addEventListener( 'keydown', keyHandler )
  }

  _self.update = function() {
    // var tempoData = getTempo(dataSet)
    // getBlackout // TODO
    // getAmbience // TODO
    // 
  }

  _self.scheme = function() {

  }
}
