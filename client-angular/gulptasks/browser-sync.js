'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var path = require('path');

var pathPieces = path.join(__dirname, '..').split(/(\/|\\)/);

gulp.task('browser-sync', ['inject'], function() {
  browserSync.init(['./app/**/*.css', './app/**/*.js', '!./app/libs/**'], {
    startPath: pathPieces[pathPieces.length - 1],
    server: {
      // All images are copied during the build into /images, but in dev, they are in app/assets/images.
      // Adding app/assets as base dir for index.thml to be able to access images
      baseDir: ['./app', './app/assets'],
      index: '../build/index.html'
    },
    port: 4000,
    ui: {
      port: 35555,
      weinre: {
        port: 35556
      }
    },
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    },
    logLevel: 'warn',
    open: false
  });
});
