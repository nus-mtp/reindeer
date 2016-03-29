var gulp = require('gulp');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var exec = require('child_process').exec;
var sass        = require('gulp-sass');

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

gulp.task('server', function(cb) {
	return exec('npm --c=config.json start', function (err, stdout, stderr) {
	    console.log(stdout);
	    console.log(stderr);
	    cb(err);
  	});
}) 

gulp.task('browser-sync', function() {
	setTimeout(function(){
	    browserSync.init({
	        proxy: "http://localhost:3000/dashboard",
	        port: 7000,
		});
	}, 2000);
});

gulp.task("watch", function() {
	gulp.watch("browser_modules/**/*.js", ['scripts']);
	gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('dev', ['server', 'scripts', 'browser-sync', 'sass', 'watch'], function(cb) {
	 
})

