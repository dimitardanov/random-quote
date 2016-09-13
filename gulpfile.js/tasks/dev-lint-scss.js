var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var scsslint = require('gulp-scss-lint');


var paths = {
  src: path.join(config.dirs.src.styles, '/**/*.scss'),
  ignore: '!' + path.join(config.dirs.src.styles, config.ignoreDirs.styles, '/**/*.*')
}



function lintscss () {
    gulp.src([paths.src, paths.ignore])
    .pipe(scsslint({
            'endless': true,
            'verbose': true,
            'format': 'String'
        }));
}


gulp.task('lint:scss', lintscss);
module.exports = lintscss;
