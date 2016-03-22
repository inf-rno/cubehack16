'use strict';

// This script is called from the installed pre-push hook (in post-install of packages.json of projects in this repo)

// What it does?
//  - Gathers the content of each commit
//  - Copies the modified files into a temp folder (defined by conf.paths.lintTmp in pre-push-conf.js)
//    under a subfolder named COMMIT_HASH_NUMBER
//  - Lint each commit one by one and out put the results if anything went wrong
//  - If everything is fine, the push goes through, else errors are displayed and push fails

/* jshint -W079 */
var _ = require('lodash');
var path = require('path');
var gulp = require('gulp');
var conf = require('./pre-push-conf');
var execSync = require('shelljs').exec;
var del = require('del');

// https://www.npmjs.com/package/gulp-load-plugins
// gulp-load-plugins avoids having to declare every plugins we use explicitly
// (they still need to be added as dev-dependency in order to be found.)
// You can set DEBUG: true to see what it actually does
var loadPlugins = require('gulp-load-plugins')({
  DEBUG: false,
  lazy: true
});

function noop() {}

function grabFileNames(commitId) {
  return _.compact(execSync('git diff-tree --no-commit-id --name-only -r ' + commitId, {
    silent: true
  }).output.split('\n'));
}

function grabFileContent(commitId, fileName) {
  var cmd = 'git show ' + commitId + ':' + fileName;
  return execSync(cmd, {
    silent: true
  });
}

function grabCommitsInBranch(branchName, gerritBranch, originName) {
  var cmd = 'git rev-list ' + branchName + ' ^' + originName + '/' + gerritBranch;
  return _.compact(execSync(cmd, {
    silent: true
  }).output.split('\n'));
}

function shortenCommitId(commitId) {
  var cmd = 'git rev-parse --short ' + commitId;
  return execSync(cmd, {
    silent: true
  }).output.replace('\n', '');
}

function executeOneLineGitLog(shortId) {
  var cmd = 'git log --oneline ' + shortId + '~1..' + shortId;
  execSync(cmd);
}

var commitIds;

gulp.task('pre-push:pre-clean', function() {
  return del.sync([conf.paths.lintTmp]);
});

gulp.task('pre-push:getCommitId', function(cb) {
  var argv = require('yargs').argv;
  var localBranch = argv.local;
  var remoteBranch = argv.remote.match(/refs\/(?:for|drafts|heads)\/(\w*)/)[1];
  var remoteName = argv.origin;

  console.log('Local Branch:', localBranch);
  console.log('Remote Name:', remoteName);
  console.log('Remote Branch:', remoteBranch);

  commitIds = grabCommitsInBranch(localBranch, remoteBranch, remoteName);
  cb();
});

gulp.task('pre-push:extract', ['pre-push:pre-clean', 'pre-push:getCommitId'], function() {
  var isFirstFile = true;
  var gulpPipeLine;

  console.log('These commits will be tested for lints:');

  commitIds.forEach(function(cId) {
    var files = grabFileNames(cId);

    var shortId = shortenCommitId(cId);
    executeOneLineGitLog(shortId);

    files.forEach(function(fileName) {
      var execStatus = grabFileContent(cId, fileName);
      if (execStatus.code !== 0) {
        // skip deleted files
        return;
      }

      var fileContent = execStatus.output;
      fileName = shortId + '/' + fileName;
      if (isFirstFile) {
        gulpPipeLine = loadPlugins.file(fileName, fileContent, {
          src: true
        });
        isFirstFile = false;
      } else {
        gulpPipeLine = gulpPipeLine.pipe(loadPlugins.file(fileName, fileContent));
      }
    });
  });

  if (gulpPipeLine) {
    return gulpPipeLine
      .pipe(gulp.dest(conf.paths.lintTmp));
  }
});

gulp.task('pre-push:js', ['pre-push:extract'], function() {
  return gulp.src([path.join(conf.paths.lintTmp, conf.pathsGlobs.js)])
    .pipe(loadPlugins.jshint())
    .pipe(loadPlugins.jscs())
    .on('error', noop)
    .pipe(loadPlugins.jscsStylish.combineWithHintResults())
    .pipe(loadPlugins.jshint.reporter('jshint-stylish'))
    .pipe(loadPlugins.jshint.reporter('fail'));

});

gulp.task('pre-push:scss', ['pre-push:extract'], function() {
  return gulp.src(path.join(conf.paths.lintTmp, conf.pathsGlobs.scss))
    .pipe(loadPlugins.scssLint())
    .pipe(loadPlugins.scssLint.failReporter());
});

gulp.task('pre-push', ['pre-push:js', 'pre-push:scss'], function() {
  return del.sync([conf.paths.lintTmp]);
});
