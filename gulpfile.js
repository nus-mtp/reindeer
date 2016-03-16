var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

gulp.task('default', function(){
	gulp.watch(['browser_modules/**/*.js','!browser_modules/**/*.test.js'],['scripts','compress']);
});

gulp.task('buildtest', function(){
	gulp.src('browser_modules/test/browser.test.js')
		.pipe(browserify())
		.pipe(gulp.dest('browser_modules/test/bundle'));
})

gulp.task('phantomtest', function(cb){

	//var www = require('./app');
	var rooms = require('./source/models/Rooms');
	var room = new rooms.Room();
	rooms.getLobby().addRoom('testid', room);
	//console.log('testing');
	gulp.src('browser_modules/test/test.html')
		.pipe(mochaPhantomJS({reporter:'spec'}));
	//www.close();
})

gulp.task('scripts', function(){
	gulp.src('browser_modules/Tutorial.js')
		.pipe(browserify())
		.pipe(gulp.dest('public/javascripts/'))
});

gulp.task('compress', function(){
	return gulp.src('public/javascripts/Tutorial.js')
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('public/javascripts/'));
})