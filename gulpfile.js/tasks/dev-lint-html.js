var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var htmlhint = require("gulp-htmlhint");


var pathsrc = path.join(config.rootDirs.dev, '/**/*.html');

function linthtml () {
    return gulp.src(pathsrc)
    	.pipe(htmlhint())
    	.pipe(htmlhint.reporter('htmlhint-stylish'));
}

gulp.task('lint:html', linthtml);
module.exports = linthtml;
