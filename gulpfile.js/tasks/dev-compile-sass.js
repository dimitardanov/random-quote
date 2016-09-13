var config = require('../config');

var path = require('path');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require("gulp-sass");
var autoprefixer = require('gulp-autoprefixer');

var paths = {
    src: path.join(config.dirs.src.styles, config.files.sassmain),
    dest: config.dirs.dev.styles,
    deps: config.deps.styles
}


function sasscompile () {
    return gulp.src(paths.src)
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: paths.deps })
                .on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dest));
}

gulp.task('compile:sass', sasscompile);
module.exports = sasscompile;
