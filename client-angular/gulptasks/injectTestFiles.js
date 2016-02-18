'use strict';

var gulp = require('gulp');
var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var gulpFilter = require('gulp-filter');

var ignore = [
  '!./app/libs/bower_components/**/*.*'
];

var jsSrcWithTest = [
  './app/**/*.js'
].concat(ignore);

// inject resources for testing
gulp.task('injectTestFiles', function() {
  return gulp.src('./tests/unit-tests.conf')
    .pipe(
      inject(
        gulp.src(
          [].concat(
            bowerFiles({
              paths: {
                bowerDirectory: 'app/libs/bower_components',
                bowerrc: './app/bowerrc',
                bowerJson: './app/bower.json'
              }
            })
          ).concat(['./app/libs/bower_components/angular-mocks/angular-mocks.js', './tests/unit-tests/**.js']), {
            relative: false,
            read: false
          }
        )
        .pipe(
          gulpFilter('**/*.js')
        ), {
          //inject
          starttag: '/*BOWER*/',
          endtag: '/*END_BOWER*/',
          transform: function(filepath, file, i, length) {
            return '".' + filepath + '",';
          }
        }
      )
    )
    .pipe(inject(gulp.src(jsSrcWithTest)
      .pipe(angularFilesort()), {
        starttag: '/*JS*/',
        endtag: '/*END_JS*/',
        transform: function(filepath, file, i, length) {
          return '".' + filepath + '"' + (i + 1 < length ? ',' : '');
        }
      }), {
      relative: true,
      read: false
    })
    .pipe(gulp.dest('./tests'));
});
