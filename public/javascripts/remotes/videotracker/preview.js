  var p_canvas = document.getElementById('preview_canvas_1')
  var p_context = p_canvas.getContext('2d')
  function update() {
    p_context.drawImage( window.opener.document.getElementById('glcanvas'), 0, 0, 1280, 720)
    window.requestAnimationFrame(update);
  }
  window.requestAnimationFrame(update);
