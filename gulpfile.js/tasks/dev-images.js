var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var imageminMozjpeg = require('imagemin-mozjpeg');

var dir = {
    src: path.join(config.dirs.src.images, '/**/*'),
    dest: config.dirs.dev.images
}


function compress () {
    return gulp.src(dir.src)
        .pipe(cache(imagemin({
            optimizationLevel: 7, //3
            progressive: true,
            interlaced: true,
            multipass: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngcrush(), imageminMozjpeg()]
            })))
        .pipe(gulp.dest(dir.dest));
}

gulp.task('dev:images', compress);
module.exports = compress;
