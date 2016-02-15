'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var configFile = require('./config.js');

gulp.task('browser-sync', function() {
  browserSync.init(['css/*.css', '*/*.js'], {
    port: 5000,
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
    proxy: configFile.appProxyURL,
    logLevel: 'warn',
    open: true,
    browser: ['google chrome']
  });
});