'use strict';

var gulp = require('gulp');

gulp.task('watch', ['jshintAndJscs'], function() {
  gulp.watch(['./**/*.scss'], ['sass']);
  gulp.watch(['./**/*.js'], ['jshintAndJscs']);
  gulp.watch(['./*.html', './**/*.html', './**/*.js'], ['browser-sync-reload']);
});
