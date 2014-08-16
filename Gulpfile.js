var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var open = require('open');
var stylish = require('jshint-stylish');

var karma = require('karma').server;
var karmaConf = require('./karma.conf');

var config = require('./config/build.config');
var conf = require('./config/config');
var tplCombined = config.files.atpl.concat(config.files.ctpl);

gulp.task('js:lint', function () {
  return gulp
    .src('app/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// Styles task (sass - .scss format)
gulp.task('styles', ['styles:vendor'], function () {
  gulp
    .src('app/styles/*.scss')
  // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
    .pipe(plugins.sass({
      onError: function (e) {
        console.log(e);
      },
      sourceMap: 'sass',
      sourceComments: 'map',
      precision: 10,
      // imagePath: 'assets/img',
    }))
    .pipe(plugins.autoprefixer("last 2 versions", "> 1%", "ie 8", {
      map: false
    }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('styles:vendor', function () {
  gulp
    .src(config.vendor.css)
    .pipe(plugins.concat('vendor.css'))
    .pipe(gulp.dest('./dist/css/'));
})

gulp.task('copy:html', function () {
  gulp
    .src('app/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy:jade', function () {
  gulp
    .src('app/*.jade')
    .pipe(plugins.jade())
    .pipe(gulp.dest('dist/'));
})

gulp.task('copy:assets', function () {
  gulp
    .src('app/assets/**/*')
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('clean', function () {
  return gulp
    .src('./dist/*', { read: false })
    .pipe(plugins.clean());
});

gulp.task('js:templates', function () {
  return gulp
    .src(tplCombined)
    .pipe(plugins.jade())
    .pipe(plugins.angularTemplatecache('templates.js', { standalone: true }))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js:vendor', function () {
  return gulp
    .src(config.vendor.js)
    .pipe(plugins.concat('vendor.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js:app', function () {
  return gulp
    .src(config.files.js)
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('js:concat', ['js:vendor', 'js:app', 'js:templates'], function () {
  return gulp
    .src(['./dist/js/vendor.js', './dist/js/templates.js', './dist/js/app.js'])
    .pipe(plugins.concat("bundle.js"))
    .pipe(gulp.dest("./dist/js/"));
});

gulp.task('watch', ['js:lint'], function () {
  gulp.watch(config.files.js, ['compile:js']);
  gulp.watch(config.files.sass, ['styles']);
  gulp.watch(config.files.html, ['copy']);
  gulp.watch(tplCombined, ['compile:js']);
});

gulp.task('clean:bower', function () {
  gulp
    .src('vendor/', { read: false })
    .pipe(plugins.clean());
});

gulp.task('karma', function () {
  karma.start(karmaConf, function (exitCode) {
    gutil.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  });
});

gulp.task('copy', ['copy:assets', 'copy:html', 'copy:jade']);
gulp.task('compile:js', ['js:lint', 'js:concat']);

gulp.task('default', ['clean', 'copy', 'styles', 'compile:js', 'watch']);
