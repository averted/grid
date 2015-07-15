var gulp      = require('gulp')
  , concat    = require('gulp-concat')
  , connect   = require('gulp-connect')
  , babel     = require('gulp-babel')
  , del       = require('del');

gulp.task('clean', function() {
  return del('build');
});

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(concat('build.js'))
    .pipe(babel({ optional: ['runtime'] }))
    .pipe(gulp.dest('build'))
    .pipe(connect.reload());
});

gulp.task('connect', ['build'], function() {
  connect.server({
    root: '.',
    port: '5252',
    livereload: true
  });
});

gulp.task('watch', ['connect'], function () {
  gulp.watch('src/**/*.js', { debounceDelay: 2000 }, ['build']);
});

gulp.task('default', ['clean', 'watch']);
