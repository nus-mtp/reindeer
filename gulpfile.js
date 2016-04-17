var gulp = require('gulp');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var change = require('gulp-change');
var fs = require('fs');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var exec = require('child_process').exec;
var sass        = require('gulp-sass');

var insertURL = function(content){
	var config = JSON.parse(fs.readFileSync('./config.json','utf8'));
	var protocol = (config['use-https']?'https':'http');
	var root = protocol+'://'+config['server-ip']+':'+config['server-port'];
	return content.replace('HTTP_ROOT', root);
}

gulp.task('default', function(){
	gulp.watch(['browser_modules/**/*.js','!browser_modules/**/*.test.js'],['scripts','compress']);
});

gulp.task('buildtest', function(){
	gulp.src('browser_modules/test/browser.test.js')
		.pipe(change(insertURL))
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
	gulp.src('browser_modules/*.js')
		.pipe(change(insertURL))
		.pipe(browserify())
		.pipe(gulp.dest('public/javascripts/'));
});

gulp.task('compress', function(){
	return gulp.src('public/javascripts/*.js')
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('public/javascripts/'));
})

gulp.task('server', function(cb) {
	return exec('npm --c=config.json start', {maxBuffer: 1024 * 1000}, function (err, stdout, stderr) {
		process.stdout.write(stdout);
	    process.stdout.write(stderr);
	    cb(err);
  	});
}) 

gulp.task('browser-sync', function() {
	setTimeout(function(){
	    browserSync.init({
	        proxy: "http://localhost:3000/dashboard",
	        port: 7000,
	        ghost: false,
		});
	}, 3000);
});

gulp.task("watch", function() {
	// gulp.watch("browser_modules/**/*.js", ['scripts']);
	gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("source/views/**/*.ejs").on('change', function() {
    	browserSync.reload();
    });
    gulp.watch("browser_modules/**/*.js", ['js-watch']);
})

gulp.task('js-watch', ['scripts'], function() {
	setTimeout(function(){
		browserSync.reload();
	}, 2000);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/*.scss")
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest("public/stylesheets"))
        .pipe(browserSync.stream());
});

gulp.task('dev', ['server', 'scripts', 'browser-sync', 'sass', 'watch'], function(cb) {
	 
})

