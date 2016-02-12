'use strict';

var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('annotate', function(done) {
       gulp.src(['./**/*.js'])
         .pipe(ngAnnotate())
         .pipe(gulp.dest('.'))
         .on('end', done);
});