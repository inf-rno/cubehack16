'use strict';

var gulp = require('gulp');
var KarmaServer = require('karma').Server;

gulp.task('runTests', ['injectTestFiles'], function(done) {
  new KarmaServer({
    configFile: __dirname + '/../tests/unit-tests.conf',
    singleRun: true // DEV NOTE => Set to false to be able to rerun tests and debug them in the browser karma opens
  }, function(exitStatusCode) {
    if (exitStatusCode) {
      console.log('Errors in tests, bailing', exitStatusCode);
      process.exit(1);
    } else {
      console.log('Testing success! :)');
      done();
    }
  }).start();
});
