'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');

gulp.task('jshintAndJscs', function() {
  return gulp.src(['!./build/**', './**/*.js', '!./libs/**', '!./gulptasks/**', '!./tests/**/*.*', '!./**/gulptasks/**.js', '!./**/gulpfile.js'])
        .pipe(jshint())
        .pipe(jscs())
        .pipe(stylish.combineWithHintResults())  // combine with jshint results
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jshintAndJscsForce', function() {
  return gulp.src(['!./build/**', './**/*.js', '!./libs/**', '!./gulptasks/**', '!./tests/**/*.*', '!./**/gulptasks/**.js', '!./**/gulpfile.js'])
        .pipe(jshint())
        .pipe(jscs())
        .pipe(stylish.combineWithHintResults())   // combine with jshint results
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});
