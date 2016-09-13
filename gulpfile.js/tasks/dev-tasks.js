var config = require('../config');

var gulp = require('gulp');
var runSequence = require('run-sequence');
var browsersync = require("browser-sync");
var reload = browsersync.reload;

var requireDir = require('require-dir');
requireDir('./', { recurse: true })


gulp.task('dev:css', function () {
    runSequence([
      'lint:scss',
      'compile:sass'] //, 'lint:css'
    );
});
gulp.task('dev:js', function () {
    return runSequence(['lint:js',
    'compile:js']);
});
gulp.task('dev:html', function () {
    return runSequence(
      // 'compile:html',
      'compile:staticHB',
      ['test:accessibility', 'lint:html', 'bootlint']
    );
});

gulp.task('dev:templates', ['compile:hbs'], function() {
    return runSequence('compile:js');
});



gulp.task("watch:dev", function() {
    gulp.watch([config.dirs.src.styles + '/**/*.scss'], ['dev:css', reload]);
    gulp.watch([config.dirs.src.scripts + '/**/*.js'], ['dev:js', reload]);
    gulp.watch([config.dirs.src.images + '/**/*'], ['dev:images', reload]);
    // gulp.watch([config.rootDirs.src + '/**/*.html'], ['dev:html', reload]);
    gulp.watch([
        config.rootDirs.src + '/**/*.html',
        config.dirs.src.templates + '/**/*.*'
        // config.dirs.src.templates + '/**/*.hbs',
        // config.dirs.src.templates + '/**/*.js'
        ],
      ['dev:html', reload]);
    // gulp.watch([config.dirs.src.templates + '/**/*.hbs'], ['dev:templates', reload]);
    gulp.watch([config.dirs.src.fonts + '/**/*'], ['dev:fonts', reload]);
});

gulp.task('build:dev', function() {
    return runSequence(['dev:clean', 'clear:cache'], ['dev:images', 'dev:fonts', 'dev:css', 'dev:html',
    // 'dev:templates'
  ]);
});

//['dev:clean', 'clear:cache', 'dev:images', 'dev:fonts', 'dev:css', 'dev:templates', 'dev:js', 'dev:html']

// Default Task
gulp.task('default', ['build:dev', 'browsersync', 'watch:dev']);
