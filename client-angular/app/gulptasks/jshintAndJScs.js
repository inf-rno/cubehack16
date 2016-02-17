'use strict';

var gulp = require('gulp');

var loadPlugins = require('gulp-load-plugins')({
  DEBUG: false,
  lazy: true
});

gulp.task('jshintAndJscs', function() {
  return gulp.src(['!./build/**', './**/*.js', '!./libs/**', '!./**/gulptasks/**.js'])
    .pipe(loadPlugins.jshint())
    .pipe(loadPlugins.jscs())
    .pipe(loadPlugins.jscsStylish.combineWithHintResults()) // combine with jshint results
    .pipe(loadPlugins.jshint.reporter('jshint-stylish'));
});

gulp.task('jshintAndJscsForce', function() {
  return gulp.src(['!./build/**', './**/*.js', '!./libs/**', '!./**/gulptasks/**.js'])
    .pipe(loadPlugins.jshint())
    .pipe(loadPlugins.jscs())
    .pipe(loadPlugins.jscsStylish.combineWithHintResults()) // combine with jshint results
    .pipe(loadPlugins.jshint.reporter('jshint-stylish'))
    .pipe(loadPlugins.jshint.reporter('fail'));
});
