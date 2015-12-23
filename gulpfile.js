var gulp       = require('gulp')
  , path       = require('path')
  , connect    = require('gulp-connect')
  , babel      = require('gulp-babel')
  , stylus     = require('gulp-stylus')
  , browserify = require('browserify')
  , source     = require('vinyl-source-stream');

var config = {
  src:  'src',
  dist: 'dist',
  build: 'build',
  port: 5252,
};

gulp.task('build:js', function() {
  return gulp.src(path.join(config.src, '/**/*.js'))
    .pipe(babel())
    .pipe(gulp.dest(path.join(config.build, 'js')))
});

gulp.task('build:stylus', function() {
  return gulp.src(path.join(config.src, '/styles/**/*.styl'))
    .pipe(stylus({
      errors: true,
      compress: true,
      paths: ['.', 'styles'],
    }))
    .pipe(gulp.dest(path.join(config.build, '/css')))
    .pipe(connect.reload());
});

gulp.task('build:images', function() {
  return gulp.src(path.join(config.src, 'public/img/**/*.{png,jpg,jpeg,gif}'))
    .pipe(gulp.dest(path.join(config.build, 'img')));
});

gulp.task('browserify', ['build:js'], function() {
  return browserify({ entries: path.join(config.build, 'js/index.js') })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(path.join(config.build)))
    .pipe(connect.reload());
});

gulp.task('build', ['browserify', 'build:stylus', 'build:images'], function() {
  return gulp.src(path.join(config.src, 'index.html'))
    .pipe(gulp.dest(path.join(config.build)));
});

gulp.task('connect', ['build'], function() {
  connect.server({
    root: config.build,
    port: config.port,
    livereload: true
  });
});

gulp.task('watch', ['connect'], function () {
  gulp.watch(
    path.join(config.src, '**/*.js'),
    { debounceDelay: 2000 }, ['browserify']
  );

  gulp.watch([
    path.join(config.src, '/styles/**/*.styl'),
    path.join('!' + config.src + '/styles/normalize.styl')
  ], { debounceDelay: 2000 }, ['build:stylus']);
});

gulp.task('default', ['watch']);
