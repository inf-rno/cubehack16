'use strict';

var gulp = require('gulp');
var fs = require('fs');
var bower = require('bower');
var bowerFiles = require('main-bower-files');
var argv = require('yargs').argv;
var sh = require('shelljs');

var loadPlugins = require('gulp-load-plugins')({
  DEBUG: false,
  lazy: true
});

// Load all the task filenames.
var tasks = fs.readdirSync('./gulptasks/');

// Load all the tasks
tasks.forEach(function(task) {
  require('./gulptasks/' + task);
});

//setup paths
var ignore = [
  '!./app/libs/bower_components/**/*.*'
];

if (process.env.NODE_ENV === 'production') {
  ignore = ignore.concat(['!./app/components/base/EnvConfig.js']);
} else {
  ignore = ignore.concat(['!./app/components/base/EnvConfig.production.js']);
}

var jsSrc = [
  './app/**/*.js'
].concat(ignore);

var htmlSrc = [
  './app/**/*.html'
].concat(ignore);

var cssSrc = [
  './app/assets/styles/style.min.css'
].concat(ignore);

gulp.task('default', ['sass', 'inject', 'browser-sync', 'watch']);

// inject resources
gulp.task('inject', function() {
  return gulp.src('app/index.html')
    .pipe(loadPlugins.inject(gulp.src(bowerFiles({
      paths: {
        bowerrc: './.bowerrc',
        bowerJson: './bower.json'
      }
    }), {
      read: false
    }), {
      name: 'bower',
      relative: true
    }))
    .pipe(loadPlugins.inject(gulp.src(jsSrc).pipe(loadPlugins.angularFilesort()), {
      relative: true
    }))
    .pipe(loadPlugins.inject(gulp.src(cssSrc), {
      relative: true
    }))
    .pipe(gulp.dest('./build/'));
});

/*----------------------DIST BUILD-----------------------------*/

gulp.task('clean', function(cb) {
  sh.rm('-rf', './build');
  cb();
});

gulp.task('copyBower', function() {
  var jsFilter = loadPlugins.filter('**/*.js', {
    restore: true
  });
  var cssFilter = loadPlugins.filter('**/*.css', {
    restore: true
  });

  return gulp.src(bowerFiles({
      paths: {
        bowerrc: './.bowerrc',
        bowerJson: './bower.json'
      }
    }))
    .pipe(jsFilter)
    .pipe(loadPlugins.concat('vendor.js'))
    .pipe(gulp.dest('./build'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(loadPlugins.minifyCss())
    .pipe(loadPlugins.concat('vendor.css'))
    .pipe(gulp.dest('./build'))
    .pipe(cssFilter.restore);
});

gulp.task('copyJS', function() {
  return gulp.src(jsSrc)
    .pipe(loadPlugins.angularFilesort())
    .pipe(loadPlugins.ngAnnotate())
    .pipe(loadPlugins.uglify())
    .pipe(loadPlugins.concat('app.min.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('copyHTML', function() {
  return gulp.src(htmlSrc)
    .pipe(gulp.dest('./build'));
});

gulp.task('copyCSS', ['sass'], function() {
  return gulp.src(cssSrc)
    .pipe(loadPlugins.minifyCss())
    .pipe(loadPlugins.concat('app.min.css'))
    .pipe(gulp.dest('./build'));
});

gulp.task('copyFonts', function() {
   gulp.src(bowerFiles({
      paths: {
        bowerrc: './.bowerrc',
        bowerJson: './bower.json'
      }
    }))
    .pipe(loadPlugins.filter(['**/*.{eot,svg,ttf,woff,woff2}', '!slick.*']))
    .pipe(loadPlugins.flatten())
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('build', ['clean', 'sass', 'copyBower', 'copyJS',
 'copyHTML', 'copyCSS', 'copyFonts', 'jshintAndJscsForce'], function() {
  return gulp.src('./build/index.html')
    .pipe(loadPlugins.htmlReplace({
      'css': ['vendor.css?rev=@@hash', 'app.min.css?rev=@@hash'],
      'js': ['vendor.js?rev=@@hash', 'app.min.js?rev=@@hash']
    }))
    .pipe(loadPlugins.revAppend())
    .pipe(gulp.dest('./build'));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      loadPlugins.util.log('bower', loadPlugins.util.colors.cyan(data.id), data.message);
    });
});
