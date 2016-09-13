var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var del = require('del');

var dirs = {
    dev: path.join(config.rootDirs.dev, '/**/*.*'),
    reports: config.reports,
    compiledTemplates: path.join(config.dirs.src.precompiledTemplates, '/**/*.js')
}

function clean () {
    return del([dirs.dev, config.rootDirs.dev, dirs.reports, dirs.compiledTemplates]);
}

gulp.task("dev:clean", clean);
module.exports = clean;
