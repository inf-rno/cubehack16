'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');


gulp.task('sass', function() {
  return gulp.src(['./assets/styles/style.scss'])
    .pipe(sass())
    .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: true
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./assets/styles/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./assets/styles/'));
});