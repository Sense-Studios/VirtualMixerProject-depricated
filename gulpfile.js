var glob = require('glob');
var gulp = require('gulp');
var minify = require('gulp-minify');
var concat = require('gulp-concat');

var vendor = glob.sync("./public/javascripts/vendor/**/*.js")
var mixer_min = glob.sync("./public/javascripts/src/**/*.js")

gulp.task('vendor-js', function () {
	return gulp.src( vendor )
		.pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/javascripts/build/'))
    .pipe(minify())
		.pipe(gulp.dest('public/javascripts/build/'));
});

gulp.task('mixer-js', function () {
	return gulp.src( mixer_min )
		.pipe(concat('mixer.js'))
    .pipe(gulp.dest('public/javascripts/build/'))
    .pipe(minify())
		.pipe(gulp.dest('public/javascripts/build/'));
});

gulp.task('default', ['vendor-js', 'mixer-js']);
