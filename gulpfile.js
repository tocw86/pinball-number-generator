var gulp = require("gulp");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');


//Sass
gulp.task('sass', function () {
    return gulp.src([
         'src/sass/style.scss'
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: false,
        }))
        .pipe(minifyCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('dist'))
    ;
});

gulp.task("scripts", function () {
    return gulp.src([
        'lib/js.cookie.min.js',
        'lib/phaser-arcade-physics.min.js',
        'lib/box2d-plugin-full.min.js',
        'lib/jquery.js',
        'lib/jquery-ui.js',
        'lib/jquery.ui.touch-punch.min.js',
        'src/js/boot.js',
        'src/js/mm.js',
        'src/js/vectors.js',
        'src/js/helpers.js',
        'src/js/database.js',
        'src/js/box.js',
        'src/js/game.js',
        'src/js/init.js'
    ])
       .pipe(uglify())
        .pipe(concat('start.js'))
        .pipe(gulp.dest("dist"));
});

gulp.task('watch', function () { 
    gulp.watch('src/js/*.js',['scripts'])
    gulp.watch('src/sass/style.scss', ['sass']);
 });


gulp.task('default', ['scripts','watch', 'sass']);