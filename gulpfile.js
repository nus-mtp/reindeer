var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', function(){
	gulp.watch('browser_modules/**/*.js',['scripts','compress']);
})

gulp.task('scripts', function(){
	gulp.src('browser_modules/tutorial.js')
		.pipe(browserify())
		.pipe(gulp.dest('public/javascripts/'))
});

gulp.task('compress', function(){
	return gulp.src('public/javascripts/tutorial.js')
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('public/javascripts/'));
})