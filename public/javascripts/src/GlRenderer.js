var GlRenderer = function() {

  console.log("created renderer")

  var _self = this

  _self.glrenderer = new THREE.WebGLRenderer( { canvas: glcanvas, alpha: false } );

  // set up threejs scene
  _self.scene = new THREE.Scene();
  _self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  _self.camera.position.z = 20

  // container for all elements that inherit init() and update()
  _self.nodes = [] // sources modules and effects

  // containers for custom uniforms and cosutomDefines
  _self.customUniforms = {}
  _self.customDefines = {}

  // base vertexShader
  _self.vertexShader = "\
\nvarying vec2 vUv;\
\nvoid main() {\
\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
\n  vUv = uv;\
\n}"

  // base fragment shader
  _self.fragmentShader = "\
\nuniform sampler2D textureTest;\
\nuniform float wave;\
\n/* custom_uniforms */\n\
\n/* custom_helpers */\n\
\nvarying vec2 vUv;\
\nvoid main() {\
\n  /* custom_main */\n\
\n}"

  // ---------------------------------------------------------------------------
  _self.init = function(  ) {
    console.log("init renderer")

    // init nodes
    _self.nodes.forEach(function(n){ n.init() });

    // create the shader
    _self.shaderMaterial = new THREE.ShaderMaterial({
       uniforms: _self.customUniforms,
       defines: _self.customDefines,
       vertexShader: _self.vertexShader,
       fragmentShader: _self.fragmentShader,
       side: THREE.DoubleSide,
       transparent: true
    })

    // apply the shader material to a surface
    _self.flatGeometry = new THREE.PlaneGeometry( 67, 38 );
    _self.flatGeometry.translate( 0, 0, 0 );
    _self.surface = new THREE.Mesh( _self.flatGeometry, _self.shaderMaterial );
    // surface.position.set(60,50,150);

    _self.scene.add( _self.surface );
  }

  // ---------------------------------------------------------------------------
  var r = Math.round(Math.random()*100)
  _self.render = function() {
  	requestAnimationFrame( _self.render );
  	_self.glrenderer.render( _self.scene, _self.camera );
    _self.glrenderer.setSize( window.innerWidth, window.innerHeight );
    _self.nodes.forEach( function(n) { n.update() } );
  }

  // ---------------------------------------------------------------------------
  // Helpers

  // adds nodes to the renderer
  _self.add = function( module ) {
    _self.nodes.push( module )
  }

  // reset the renderer, for a new lay out
  _self.dispose = function() {
    _self.shaderMaterial
    _self.flatGeometry
    _self.scene.remove(_self.surface)
    _self.glrenderer.resetGLState()
    _self.customUniforms = {}
    _self.customDefines = {}
    // base vertexShader
    _self.vertexShader = "\
  \nvarying vec2 vUv;\
  \nvoid main() {\
  \n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\
  \n  vUv = uv;\
  \n}"

    // base fragment shader
    _self.fragmentShader = "\
  \nuniform sampler2D textureTest;\
  \nuniform float wave;\
  \n/* custom_uniforms */\n\
  \n/* custom_helpers */\n\
  \nvarying vec2 vUv;\
  \nvoid main() {\
  \n  /* custom_main */\n\
  \n}"
    _self.nodes = []
  }
}
