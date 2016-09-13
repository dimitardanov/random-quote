var gulp = require('gulp');
var hb = require('gulp-hb');
var path = require('path');

var config = require('../config');

var paths = {
  src: path.join(config.rootDirs.src, '/**/*.html'),
  dest: config.rootDirs.dev,
  partials: path.join(config.dirs.src.templatePartials, '**/*.hbs'),
  helpers: path.join(config.dirs.src.helpers, '*.js'),
  data: path.join(config.dirs.src.data, '**/*.{js,json}')
}


function compileStaticHandlebars() {
  return gulp
  .src(paths.src)
  .pipe(hb({
    partials: paths.partials,
    helpers: paths.helpers,
    data: paths.data
    // TODO: currently cannot find 
    // {jiji: [{
    //   breed: 'husky',
    //   size: 'medium'
    // }, {
    //   breed: 'chihuahua',
    //   size: 'small'
    // }, {
    //   breed: 'German Shepherd',
    //   size: 'big'
    // }]}
    // paths.data
  }))
  .pipe(gulp.dest(paths.dest));
}

gulp.task('compile:staticHB', compileStaticHandlebars);
module.exports = compileStaticHandlebars;
