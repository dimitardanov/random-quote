var config = require('../config');

var path = require('path');
var gulp = require('gulp');

var dirs = {
    src: path.join(config.dirs.dev.fonts, '/**/*.*'),
    dest: config.dirs.production.fonts
}



function prodfonts () {
    return gulp.src(dirs.src)
        .pipe(gulp.dest(dirs.dest));
}

gulp.task('production:fonts', prodfonts);
module.exports = prodfonts;
