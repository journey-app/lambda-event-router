/***************************************************************************
 * Copyright 2016 ThoughtWorks, Inc. and Pengchao Wang
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **************************************************************************/
var gulp = require('gulp');
var file = require('gulp-file');
var async = require('async');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var del = require('del');
var install = require('gulp-install');
var runSequence = require('run-sequence');
var fs = require('fs');
var mocha = require('gulp-mocha');
var awsLambda = require("node-aws-lambda");

gulp.task('clean', function(cb) {
  del(['./dist', './dist.zip'], cb);
});

gulp.task('js', function() {
  return gulp.src('index.js')
    .pipe(gulp.dest('dist/'));
});

gulp.task("env", function() {
  var dotenv = "EVENT_ROUTER_SQS_URL=" + process.env.EVENT_ROUTER_SQS_URL;
  return file(".env", dotenv, {src: true})
    .pipe(gulp.dest('dist/'));
});

gulp.task('node-mods', function() {
  return gulp.src('./package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({production: true}));
});

gulp.task('zip', function() {
  return gulp.src(['dist/**/*', 'dist/.*', '!dist/package.json'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('upload', function(callback) {
  awsLambda.deploy('./dist.zip', require("./lambda-config.js"), callback);
});

gulp.task('deploy', function(callback) {
  return runSequence(
    ['clean'],
    ['js', 'node-mods', 'env'],
    ['zip'],
    ['upload'],
    callback
  );
});

gulp.task('watch', function() {
  gulp.watch(
    ['*.js', 'test/*.js'],
    ['mocha']
  );
});

gulp.task('mocha', function() {
  process.env.NODE_ENV = 'testing'
  return gulp.src('test/all.js')
    .pipe(mocha())
});

gulp.task('default', ['mocha', 'watch']);
