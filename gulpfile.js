var gulp = require('gulp'),
  fs = require('fs'),
  connect = require('gulp-connect'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  uglify = require('gulp-uglify'),
  streamify = require('gulp-streamify'),
  babelify = require("babelify");

function compileJS(file){
  browserify('src/'+file+'.js',{debug:true})
    .transform(babelify)
    .transform('glslify')
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source(file+'.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('application/js'));
}
gulp.task('js', function(){
  compileJS('index');
});

function watch(i){
  i=i>0?i:'';
  gulp.task('watch'+i,['js'+i],function(){
    gulp.watch(['src/*.js','src/shaders/*.frag','src/shaders/*.vert'],['js'+i]);
  });
}
for(var i=0;i<=3;i++){
  watch(i);
}

gulp.task('connect', function() {
  connect.server();
});
