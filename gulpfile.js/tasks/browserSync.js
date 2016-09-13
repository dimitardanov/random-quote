var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var browsersync = require("browser-sync");

var dir = config.rootDirs.dev;


function bsync (cb) {
    return browsersync({
        server: {baseDir: dir}
    }, cb);
}


gulp.task('browsersync', bsync);
module.exports = bsync;
