var gulp = require('gulp');
var cache = require('gulp-cache');

function clear (done) {
    return cache.clearAll(done);
}

gulp.task("clear:cache", clear);
module.exports = clear;
