'use strict';

var gulp = require('gulp');

gulp.task('watch', function() {
  gulp.watch(['./app/**/*.scss'], ['sass']);
  gulp.watch(['./app/*.html', './app/**/*.html', './app/**/*.js', '!./app/index.html'], 
  	['jshintAndJscs', 'browser-sync-reload']);
});
