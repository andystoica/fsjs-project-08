'use strict';

var del        = require('del'),
    gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    sass       = require('gulp-sass'),
    imagemin   = require('gulp-imagemin'),
    rename     = require('gulp-rename'),
    connect    = require('gulp-connect'),
    eslint     = require('gulp-eslint'),
    runSequence   = require('run-sequence');

gulp.task('default', ['build']);



/**
 * Lints every .js file inside the ./src/js folder, outputs
 * the results and terminates if any errors are found
 */
gulp.task('eslint', () => {
    return gulp.src('src/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

/**
 * Concatenates and minifies all the .js files inside ./src/js folder
 * generates the source maps and copies everyting to ./dist folder
 */
gulp.task('scripts', ['eslint'], () => {
    return gulp.src([
            'src/js/circle/autogrow.js',
            'src/js/circle/circle.js',
            'src/js/global.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(connect.reload());
});


/**
 * Compiles and minifies all the scss files inside ./src/sass folder
 * generates the source maps and copies everyting to ./dist folder
 */
gulp.task('styles', () => {
    return gulp.src('src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename('all.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/styles'));
});


/**
 * Optimises all images inside ./src/images folder and
 * copies them to the ./dist folder
 */
gulp.task('images', () => {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'))
});


/**
 * Deletes all files inside the ./dist folder
 */
gulp.task('clean', () => {
    return del('dist/**/*');
});


/**
 * Builds the entire project by cleaning up the ./dist folder,
 * calling the scripts, styles and images task and finally
 * copying the icons subfolder
 */
gulp.task('build', () => {
    runSequence(
        'clean',
        ['scripts', 'styles', 'images'],
        () => {
            gulp.src('src/icons/**/*')
            .pipe(gulp.dest('dist/icons'));
        })
});


/**
 * Starts a web server for the index file inside the ./src folder
 */
gulp.task('serve', () => {
    connect.server({
      root: 'src',
      livereload: true
    });
});


/**
 * Watches for changes in any .js files located inside the ./src/js folder
 */
gulp.task('watch', ['serve'], () => {
    gulp.watch('src/js/**/*', ['scripts']);
});
