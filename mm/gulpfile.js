// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var path = require('path');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');

//Sass
gulp.task('sass', function () {
    return gulp.src([
        //'sass/keno.scss',
        'sass/style.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: false,
        }))
        .pipe(minifyCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


// Dla widoku modelu
gulp.task('core', function () {
    return gulp.src([
            'lib/jquery-2.1.4.min.js',
            'lib/jquery-ui.js',
            'lib/jquery.ui.touch-punch.min.js',
            'lib/select2.min.js',
            'lib/libgif.js',
            'lib/multi.js',
            'lib/init.js',
        ])
        .pipe(concat('core.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('js/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


// Watch Files For Changes
gulp.task('watch', function () {
    browserSync({
        proxy: "http://127.0.0.1:5500"
    });
    gulp.watch('lib/*.js', ['core']);
    gulp.watch('sass/style.scss', ['sass']);

});

// Default Task
gulp.task('default', ['core', 'watch', 'sass']);