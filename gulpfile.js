const gulp = require('gulp');
const fs = require('fs');
const connect = require('gulp-connect');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const uglify = require('gulp-uglify');
const streamify = require('gulp-streamify');
const babelify = require("babelify");

gulp.task('js', function () {
  compileJS('index');
});

for (var i = 0; i <= 3; i++) {
  watch(i);
}

gulp.task('connect', function () {
  connect.server();
});

function compileJS(file) {
  browserify('src/' + file + '.js', {debug: true})
    .transform(babelify)
    .transform('glslify')
    .bundle()
    .on("error", function (err) {
      console.log("Error : " + err.message);
    })
    .pipe(source(file + '.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('public/js'));
}


function watch(i) {
  i = i > 0 ? i : '';
  gulp.task('watch' + i, ['js' + i], function () {
    gulp.watch(['src/*.js', 'src/shaders/*.frag', 'src/shaders/*.vert'], ['js' + i]);
  });
}


