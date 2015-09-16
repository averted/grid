var gulp       = require('gulp')
  , concat     = require('gulp-concat')
  , connect    = require('gulp-connect')
  , babel      = require('gulp-babel')
  , browserify = require('browserify')
  , source     = require('vinyl-source-stream');

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('build'))
});

gulp.task('browserify', ['build'], function() {
  return browserify({ entries: './build/index.js' })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('connect', ['browserify'], function() {
  connect.server({
    root: '.',
    port: '5252',
    livereload: true
  });
});

gulp.task('watch', ['connect'], function () {
  gulp.watch('src/**/*.js', { debounceDelay: 2000 }, ['browserify']);
});

gulp.task('default', ['watch']);
