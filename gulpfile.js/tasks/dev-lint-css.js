var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var csslint = require("gulp-csslint");

var pathsrc = path.join(config.dirs.dev.styles, '/**/*.css');


function lintcss () {
    gulp.src(pathsrc)
        .pipe(csslint())
        .pipe(csslint.reporter());
}

gulp.task('lint:css', lintcss);
module.exports = lintcss;
