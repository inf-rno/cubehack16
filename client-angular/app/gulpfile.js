'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var bower = require('bower');
var inject = require('gulp-inject');
var bowerFiles = require('main-bower-files');
var angularFilesort = require('gulp-angular-filesort');
var rev = require('gulp-rev-append');
var argv = require('yargs').argv;
var cssmin = require('gulp-minify-css');
var uglify =  require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sh = require('shelljs');
var concat = require('gulp-concat');
var gulpFilter = require('gulp-filter');
var htmlreplace = require('gulp-html-replace');

// Load all the task filenames.
var tasks = fs.readdirSync('./gulptasks/');

// Load all the tasks
tasks.forEach(function (task) {
    require('./gulptasks/' + task);
});

//setup paths
var ignore = [
  '!./build/**/*.*',
  '!./libs/bower_components/**/*.*',
  '!./gulptasks/*.js',
  '!./gulpfile.js'
];
ignore.push(argv.dev ? '!./js/appConfig.js': '!./js/appConfig-dev.js');
ignore.push('!./js/appConfig-stage.js'); // TODO: Add support for stage builds

var jsSrc = [
  './**/*.js'
].concat(ignore);
var htmlSrc = [
  './**/*.html',
  './**/*.png'
].concat(ignore);
var cssSrc = [
  './assets/styles/style.min.css'
].concat(ignore);

gulp.task('default', ['sass', 'inject', 'browser-sync', 'watch']);

// inject resources
gulp.task('inject', function() {
  gulp.src('index.html')
  .pipe(inject(gulp.src(bowerFiles({
        paths: {
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    }), {read: false}), {name: 'bower', relative: true}))
  .pipe(inject(gulp.src(jsSrc).pipe(angularFilesort()), {relative: true}))
  .pipe(inject(gulp.src(cssSrc), {relative: true}))
  .pipe(gulp.dest('.'));
});

/*----------------------DIST BUILD-----------------------------*/

gulp.task('clean', function() {
  sh.rm('-rf', './build');
});

gulp.task('copyBower', function() {
  var jsFilter = gulpFilter('**/*.js', {restore: true});
  var cssFilter = gulpFilter('**/*.css', {restore: true});

  return gulp.src(bowerFiles({
        paths: {
            bowerrc: '.bowerrc',
            bowerJson: 'bower.json'
        }
    }))
    .pipe(jsFilter)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./build'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(cssmin())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build'))
    .pipe(cssFilter.restore);
});

gulp.task('copyJS', function() {
  return gulp.src(jsSrc)
    .pipe(angularFilesort())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('copyHTML', function() {
  return gulp.src(htmlSrc)
    .pipe(gulp.dest('./build'));
});

gulp.task('copyCSS', ['sass'], function() {
  return gulp.src(cssSrc)
    .pipe(cssmin())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./build'));
});

gulp.task('build', ['clean', 'sass', 'copyBower', 'copyJS', 'copyHTML', 'copyCSS', 'jshintAndJscsForce'], function() {
 return gulp.src('./build/index.html')
    .pipe(htmlreplace({
        'css': ['vendor.css?rev=@@hash', 'app.min.css?rev=@@hash'],
        'js': ['vendor.js?rev=@@hash', 'app.min.js?rev=@@hash']
    }))
  .pipe(rev())
  .pipe(gulp.dest('./build'));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});