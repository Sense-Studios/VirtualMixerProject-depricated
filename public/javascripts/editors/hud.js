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
})
