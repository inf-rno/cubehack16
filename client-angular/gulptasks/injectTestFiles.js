'use strict';

var gulp = require('gulp');
var bowerFiles = require('main-bower-files');

var loadPlugins = require('gulp-load-plugins')({
  DEBUG: false,
  lazy: true
});

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
      loadPlugins.inject(
        gulp.src(
          [].concat(
            bowerFiles({
              paths: {
                bowerDirectory: 'app/libs/bower_components',
                bowerrc: './bowerrc',
                bowerJson: './bower.json'
              }
            })
          ).concat(['./app/libs/bower_components/angular-mocks/angular-mocks.js', './tests/unit-tests/**.js']), {
            relative: false,
            read: false
          }
        )
        .pipe(
          loadPlugins.filter('**/*.js')
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
    .pipe(loadPlugins.inject(gulp.src(jsSrcWithTest)
      .pipe(loadPlugins.angularFilesort()), {
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
