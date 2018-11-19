// alert("this is hud")
console.log("this is hud")

window.addEventListener('keypress', function(ev) {
  if ( ev.which == 96 ) {
    console.log("show hud")
    if ( document.getElementsByTagName('hud')[0].classList.contains('active') ) {
      document.getElementsByTagName('hud')[0].classList.remove('active')
    }else{
      document.getElementsByTagName('hud')[0].classList.add('active')
    }
  }
});


var connected = true
document.getElementById("audio_toggle").addEventListener('click', function() {
  if ( connected ) {
    window.audioanalysis1.disconnectOutput()
    connected = false
  }else{
    window.audioanalysis1.connectOutput()
    connected = true
  }
})

document.getElementById("reload").addEventListener('click', function() {
  window.location.reload()
})

document.getElementById("changez").addEventListener('click', function() {
  filemanager1.changez()
  filemanager2.changez()
  filemanager3.changez()
  filemanager4.changez()
})

var hudUpdateTimer = function() {
  document.getElementById("beats_display").innerHTML = audioanalysis1.bpm
  setTimeout(hudUpdateTimer, 100)
}
hudUpdateTimer()
