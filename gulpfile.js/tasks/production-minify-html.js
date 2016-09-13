var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');


var paths = {
    src: path.join(config.rootDirs.dev, '/**/*.html'),
    dest: config.rootDirs.production
}


function minifyhtml () {
    return gulp.src(paths.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.dest));
}

gulp.task('minify:html', minifyhtml);
module.exports = minifyhtml;
