var path = require('path');

var rootDirs = {
    src: 'src',
    dev: 'builds/dev',
    production: 'builds/production'
};
var reports = 'builds/dev_reports';
var deps = {
    fonts: ['node_modules/bootstrap-sass/assets/fonts/**/*'],
    styles: []
};
var files = {
    jsmain: 'main.js',
    sassmain: 'styles.scss',
    template: 'templates.js'
};
var ignoreDirs = {
    styles : 'vendors'
};
var dirs = {
    src: {
        templates: 'templates',
        helpers: 'templates/helpers',
        data: 'templates/data',
        templatePartials: 'templates/partials',
        precompiledTemplates: 'js/compiledTemplates',
        scripts: 'js',
        styles: 'scss',
        images: 'img',
        fonts: 'fonts'
    },
    dev: {
        styles: 'css',
        scripts: 'js',
        images: 'img',
        fonts: 'fonts',
        reports: 'reports'
    },
    production: {
        styles: 'css',
        scripts: 'js',
        images: 'img',
        fonts: 'fonts'
    },
};
(function() {
    for (var i in rootDirs) {
        for (var j in dirs[i]) {
            dirs[i][j] = path.join(rootDirs[i], dirs[i][j]);
        }
    }
})();

module.exports = {
    rootDirs: rootDirs,
    dirs: dirs,
    files: files,
    reports: reports,
    deps: deps,
    ignoreDirs: ignoreDirs
};
