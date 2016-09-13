var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var del = require('del');

var dirs = {
    production: config.rootDirs.production
}

function clean () {
    return del([dirs.production]);
}

gulp.task("production:clean", clean);
module.exports = clean;
