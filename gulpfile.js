
// #############################################################################
// May need update:
// note for update to 4.x https://codeburst.io/switching-to-gulp-4-0-271ae63530c0
// #############################################################################

var glob = require('glob');
var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');

// -----------------------------------------------------------------------------
//  Packaging
// -----------------------------------------------------------------------------

var vendor = glob.sync("./public/javascripts/vendor/**/*.js")
var mixer_min = glob.sync("./public/javascripts/src/**/*.js")

gulp.task('vendor-js', function () {
	return gulp.src( vendor )
		.pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/javascripts/build/'))
    .pipe(require('gulp-minify')())
		.pipe(gulp.dest('public/javascripts/build/'));
});

gulp.task('mixer-js', function () {
	return gulp.src( mixer_min )
		.pipe(concat('mixer.js'))
    .pipe(gulp.dest('public/javascripts/build/'))
    .pipe(require('gulp-minify')())
		.pipe(gulp.dest('public/javascripts/build/'));
});



var vendor = glob.sync("./public/javascripts/vendor/**/*.js")
var mixer_min = glob.sync("./public/javascripts/src/**/*.js")

// -----------------------------------------------------------------------------
//  Scaffolding
// -----------------------------------------------------------------------------

function generateMixerJade( _name ) {
	var jade = ''
	jade += "doctype html\n"
	jade += "html\n"
	jade += "	head\n"
	jade += "		title Awesome Virtual Mixer\n"
	jade += "		script(src='/javascripts/build/vendor.js')\n"
	jade += "		script(src='/javascripts/build/mixer.js')\n"
	jade += "		link(rel='stylesheet', href='/stylesheets/style.css')\n"
	jade += "		link(rel='stylesheet', href='/stylesheets/compositions/"+_name+".css')\n"
	jade += "	body \n"
	jade += "		a.logo(href='/')\n"
	jade += "		canvas#glcanvas\n"
	jade += "		.blink\n"
	jade += "		.payoff\n"
	jade += "			| <h3>" + _name + "</small></h3>\n"
	jade += "			| Part of the <a href='https://virtualmixproject.com/''> Virtual Mixer Project </a><br>\n"
	jade += "			| <small>If you don't hear any music, click somewhere on the screen</small>\n"
	jade += "			script(src='/compositions/"+_name+".js')\n"
	jade += "			include ../partials/analytics\n"
	return jade
}

function generateMixerJs( _name ) {
	var js = ""
	js += "var renderer = new GlRenderer();\n"
	js += "var source1 = new VideoSource(renderer, {});\n"
	js += "var source2 = new VideoSource(renderer, {});\n"
	js += "var mixer1 = new Mixer( renderer, { source1: source1, source2: source2 });\n"
	js += "var output = new Output( renderer, mixer1 );\n"
	js += "renderer.init();\n"
	js += "renderer.render();\n"
	return js;
}

function generateMixerSass( _name ) {
	var sass = ""
	sass += "test\n"
	sass += "  margin: 0\n"
	sass += "  padding: 0\n"
	return sass
}


// create:mixer
// create:controller
// remove:mixer
// remove:controller

function createMixerCode(cb) {
	console.log(" -- Create mixer: " + process.argv[4])
	var scaffold_name = process.argv[4]

	require('fs').writeFileSync('./views/compositions/'+scaffold_name+'.pug', generateMixerJade( scaffold_name ) );
	console.log("writing ", './views/compositions/'+scaffold_name+'.pug')
	require('fs').writeFileSync('./public/compositions/'+scaffold_name+'.js', generateMixerJs( scaffold_name ) );
	console.log("writing ", './public/compositions/'+scaffold_name+'.js')
	require('fs').writeFileSync('./public/stylesheets/compositions/'+scaffold_name+'.sass', generateMixerSass( scaffold_name ) );
	console.log("writing ", './public/stylesheets/compositions/'+scaffold_name+'.sass')
	cb()
}

function removeMixerCode(cb) {
	console.log(" -- Removing mixer: " + process.argv[4])
	var scaffold_name = process.argv[4]
	del( './views/compositions/'+scaffold_name+'.pug' )
	console.log("removing ", './views/compositions/'+scaffold_name+'.pug' )
	del( './public/compositions/'+scaffold_name+'.js' )
	console.log("removing ", './public/compositions/'+scaffold_name+'.js')
	del( './public/stylesheets/compositions/'+scaffold_name+'.sass' )
	console.log("removing ", './public/stylesheets/compositions/'+scaffold_name+'.sass' )
	cb()
}

gulp.task('create_mixer_scaffold', gulp.series( createMixerCode ) )
gulp.task('remove_mixer_scaffold', gulp.series( removeMixerCode ) )

// -----------------------------------------------------------------------------
// commands
// -----------------------------------------------------------------------------

// #############################################################################
// note for update to 4.x https://codeburst.io/switching-to-gulp-4-0-271ae63530c0

gulp.task('default', gulp.series( gulp.parallel('vendor-js','mixer-js') ) ); // default (build)
gulp.task('build', gulp.series( gulp.parallel('vendor-js', 'mixer-js') ) ); // build
//gulp.task('test', gulp.series( gulp.parallel('create_scaffold') ) );

// create thumbnails /directory
// create_mixer
// create_controller
