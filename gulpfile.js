'use strict';

var del        = require('del'),
    gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    sass       = require('gulp-sass'),
    imagemin   = require('gulp-imagemin'),
    rename     = require('gulp-rename');


gulp.task('scripts', ['clean'], () => {
    return gulp.src([
            'src/js/circle/autogrow.js',
            'src/js/circle/circle.js',
            'src/js/global.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/scripts'));
});


gulp.task('styles', ['clean'], () => {
    return gulp.src('src/sass/global.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename('all.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/styles'));
});


gulp.task('images', ['clean'], () => {
    return gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});


gulp.task('clean', () => {
    return del('dist');
});


gulp.task('build', ['scripts', 'styles', 'images'], () => {
    gulp.src('src/icons/**/*')
        .pipe(gulp.dest('dist/icons'));
});


gulp.task('default', ['build']);
