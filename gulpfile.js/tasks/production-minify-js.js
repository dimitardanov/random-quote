var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');

var paths = {
    //src: path.join(config.dirs.dev.scripts, config.files.jsmain),
    src: path.join(config.dirs.dev.scripts, '/**/*.js'),
    dest: config.dirs.production.scripts
}




function jsmin () {
    return gulp.src(paths.src)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
};

gulp.task('minify:js', jsmin);
module.exports = jsmin;
