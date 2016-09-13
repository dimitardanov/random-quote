var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var dirs = {
    src: [path.join(config.dirs.src.scripts, '/**/*.js'),
      '!' + config.dirs.src.precompiledTemplates + '/**/*.js']
}
console.log(dirs);

function lintjs () {
    gulp.src(dirs.src)
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
}

gulp.task('lint:js', lintjs);
module.exports = lintjs;
