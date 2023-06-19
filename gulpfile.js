// Load Gulp
const  { src, dest, task, watch, series, parallel } = require('gulp');

// JS related plugins
let babelify = require('babelify');
let browserify = require('browserify');
let buffer = require('vinyl-buffer');
let source = require('vinyl-source-stream');
let stripDebug = require( 'gulp-strip-debug');
let uglify = require('gulp-uglify');

// Utility plugins
let rename = require('gulp-rename')
let sourcemaps = require('gulp-sourcemaps');
let notify = require('gulp-notify');
let plumber = require('gulp-plumber');
let options = require('gulp-options');
let gulpif = require('gulp-if');
let connection = require('gulp-connect');

// Browsers related plugins
let browserSync  = require('browser-sync').create();

// Project related variables
const constants = require('./project-config.json')
let jsFiles = [constants.jsFront];

// ------------------------------------------------------

// Tasks Functions

function browserSynchronization() {
  browserSync.init({
    server: {
      baseDir: './build/'
    }
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function js(done) {
  jsFiles.map( function( entry ) {
    return browserify({
      entries: [constants.jsSRC + entry]
    })
      .transform( babelify, { presets: [ '@babel/preset-env' ] } )
      .transform('glslify')
      .bundle()
      .pipe(source( entry ) )
      .pipe(rename( {
        extname: '.min.js'
      }))
      .pipe(buffer() )
      .pipe(gulpif( options.has( 'production' ), stripDebug() ) )
      .pipe(sourcemaps.init({ loadMaps: true }) )
      .pipe(uglify())
      .pipe(sourcemaps.write( '.' ))
      .pipe(dest(constants.jsURL))
      .pipe(browserSync.stream());
  });
  done();
}

function triggerPlumber(src_file, dest_file) {
  return src(src_file)
    .pipe(plumber())
    .pipe(dest(dest_file));
}

function css() {
  return triggerPlumber(constants.styleSRC, constants.styleURL);
}

function images() {
  return triggerPlumber(constants.imgSRC, constants.imgURL);
}

function fonts() {
  return triggerPlumber(constants.fontsSRC, constants.fontsURL);
}

function html() {
  return triggerPlumber(constants.htmlSRC, constants.htmlURL);
}

function watchFiles() {
  watch(constants.styleWatch, series(css, reload));
  watch(constants.jsWatch, series(js, reload));
  watch(constants.shadersWatch, series(js, reload));
  watch(constants.imgWatch, series(images, reload));
  watch(constants.fontsWatch, series(fonts, reload));
  watch(constants.htmlWatch, series(html, reload));
  src(constants.jsURL + 'main.min.js')
    .pipe( notify({ message: 'Gulp is Watching, Happy Coding!' }) );
}

function connect() {
  connection.server();
}

// Gulp Tasks

task("css", css);
task("js", js);
task("images", images);
task("fonts", fonts);
task("html", html);
task("build", parallel(css, js, images, fonts, html));

task("connect", connect);
task("watch", parallel(browserSynchronization, watchFiles));