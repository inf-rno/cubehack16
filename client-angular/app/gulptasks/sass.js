'use strict';

var gulp = require('gulp');

var loadPlugins = require('gulp-load-plugins')({
  DEBUG: false,
  lazy: true
});

gulp.task('sass', function() {
  return gulp.src(['./assets/styles/style.scss'])
    .pipe(loadPlugins.sass())
    .pipe(loadPlugins.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true
    }))
    .pipe(loadPlugins.concat('style.css'))
    .pipe(gulp.dest('./assets/styles/'))
    .pipe(loadPlugins.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(loadPlugins.rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./assets/styles/'));
});
