var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var cleancss = require('gulp-clean-css');  // minify css
var purifycss = require('gulp-purifycss'); // removes unused css

var paths = {
    src: path.join(config.dirs.dev.styles, '/**/*.css'),
    dest: config.dirs.production.styles,
    jsfiles: path.join(config.dirs.production.scripts, config.files.jsmain),
    htmlfiles: path.join(config.rootDirs.production, '/**/*.html')
}


function csscleanup () {
    return gulp.src(paths.src)
        .pipe(purifycss([
            paths.jsfiles,
            paths.htmlfiles
            ]))
        .pipe(cleancss())
        .pipe(gulp.dest(paths.dest));
}


gulp.task('cleanup:css', csscleanup);
module.exports = csscleanup;
