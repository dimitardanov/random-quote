var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var changed = require('gulp-changed');

var dirs = {
    src: config.deps.fonts.concat(
        [path.join(config.dirs.src.fonts, '/**/*')]),
    dest: config.dirs.dev.fonts
}


function devfonts () {
    return gulp.src(dirs.src)
        .pipe(changed(dirs.dest))
        .pipe(gulp.dest(dirs.dest));
}

gulp.task('dev:fonts', devfonts);
module.exports = devfonts;
