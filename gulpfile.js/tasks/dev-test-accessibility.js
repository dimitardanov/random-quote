var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var a11y = require('gulp-a11y');


var pathsrc = path.join(config.rootDirs.dev, '/**/*.html');

function accessibilityhtml () {
  return gulp.src(pathsrc)
    .pipe(a11y())
    .pipe(a11y.reporter());
}

gulp.task('test:accessibility', accessibilityhtml);
module.exports = accessibilityhtml;
