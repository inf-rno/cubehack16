var gulp = require('gulp');

gulp.task('watch', ['jshintAndJScs'], function() {
  gulp.watch(['./**/*.scss'], ['sass']);
  gulp.watch(['./**/*.js'], ['jshintAndJScs']);
  gulp.watch(['./*.html', './**/*.html', './**/*.js'], ['browser-sync-reload']);
});