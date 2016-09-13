var config = require('../config');

var path = require('path');
var gulp = require('gulp');


var paths = {
    src: path.join(config.rootDirs.src, '/**/*.html'),
    dest: config.rootDirs.dev
}


function htmlcompile () {
    return gulp.src(paths.src)
        .pipe(gulp.dest(paths.dest));
}


gulp.task('compile:html', htmlcompile);
module.exports = htmlcompile;
