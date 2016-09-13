var config = require('../config');

var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var browsersync = require("browser-sync");
var reload = browsersync.reload;

var requireDir = require('require-dir');
requireDir('./', { recurse: true })

var paths = {
    src: path.join(config.dirs.dev.images, '/**/*'),
    dest: config.dirs.production.images
}



gulp.task('production:html', function () {
    return runSequence('compile:html', 'minify:html');
});
gulp.task('production:js', function () {
    return runSequence('compile:js', 'compile:hbs', 'minify:js');
});
gulp.task('production:css', function () {
    runSequence('compile:sass', 'cleanup:css');
});
gulp.task('production:images', ['dev:images'], function () {
    return gulp.src(paths.src)
        .pipe(gulp.dest(paths.dest));
});

gulp.task('build:production', ['dev:clean', 'production:clean', 'clear:cache'], function () {
        runSequence(
            [
            'production:html',
            'production:js',
            'production:fonts',
            'production:images'
            ],
            'production:css'
        );
});
