var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');


var filesrc = path.join(config.dirs.src.scripts, config.files.jsmain);


function jscompile () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: [filesrc],
    debug: true
  });

  return b.bundle()
    .pipe(source(config.files.jsmain))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dirs.dev.scripts));
}

gulp.task('compile:js', jscompile);
module.exports = jscompile;
