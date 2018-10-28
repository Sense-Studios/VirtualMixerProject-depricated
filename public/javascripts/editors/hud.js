// alert("this is hud")
console.log("this is hud")
window.onkeypress = function(ev) {
  if ( ev.which == 96 ) {
    console.log("askldjaskldajsdlk")
    if ( document.getElementsByTagName('hud')[0].classList.contains('active') ) {
      document.getElementsByTagName('hud')[0].classList.remove('active')
    }else{
      document.getElementsByTagName('hud')[0].classList.add('active')
    }
  }
}
