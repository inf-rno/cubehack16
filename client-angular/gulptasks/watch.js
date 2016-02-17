'use strict';

var gulp = require('gulp');

gulp.task('watch', ['jshintAndJscs'], function() {
  gulp.watch(['./app/**/*.scss'], ['sass']);
  gulp.watch(['./app/**/*.js'], ['jshintAndJscs']);
  gulp.watch(['./app/*.html', './app/**/*.html', './app/**/*.js'], ['browser-sync-reload']);
});
