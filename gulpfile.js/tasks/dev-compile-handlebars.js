var config = require('../config');

var gulp = require('gulp'),
    path = require('path'),
    handlebars = require('gulp-handlebars'),
    wrap = require('gulp-wrap'),
    declare = require('gulp-declare'),
    concat = require('gulp-concat'),
    merge = require('merge-stream');


var paths = {
  partials: path.join(config.dirs.src.templatePartials, '*.hbs'),
  templates: path.join(config.dirs.src.templates, '*.hbs'),
  templatesDir: config.dirs.src.precompiledTemplates,
  templateFileName: config.files.template
};

function compilehbs () {
    //partials stream
    var partials = gulp.src(paths.partials)
        //handlebars
        .pipe(handlebars({
          handlebars: require('handlebars')
        }))
        //wrap inline javascript
        .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
          imports: {
            processPartialName: function(fileName) {
              return JSON.stringify(path.basename(fileName, '.js'));//.substr(1));
            }
          }
        }));

    //templates stream
    var templates = gulp.src(paths.templates)
        //handlebars
        .pipe(handlebars({
          handlebars: require('handlebars')
        }))
        //wrap
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        //namespace
        .pipe(declare({
          namespace: 'App.templates',
          noRedeclare: true
        }));

    //return merge
    return merge(partials, templates)
        //concat
        .pipe(concat(paths.templateFileName))
        .pipe(wrap('var Handlebars = require("handlebars");\n <%= contents %>'))
        //build
        .pipe(gulp.dest(paths.templatesDir));

};

gulp.task('compile:hbs', compilehbs);
module.exports = compilehbs;
