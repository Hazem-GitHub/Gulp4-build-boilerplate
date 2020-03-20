const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      reload = browserSync.reload,
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cleanCss = require('gulp-clean-css'),
      browserify = require('gulp-browserify'),
      concat = require('gulp-concat'),
      imagemin = require('gulp-imagemin'),
      changed = require('gulp-changed'),
      lineEndingCorrector = require('gulp-line-ending-corrector'),
      uglify = require('gulp-uglify'),
      sourcemaps = require('gulp-sourcemaps'),
      babel = require('gulp-babel');

      
/// Defining some paths related to the project folder structure for easy references on writing GULP TASKS
const root = './';

const scss = root + 'src/sass/',
      scssLib = root + 'src/sass/lib/',
      scssPlugins = root + 'src/sass/plugins/',
      scssComp = root + 'src/sass/components/';
/// Writing the sequence of scss files in an array for concat     
const scssArr = [
    scssLib + 'bootstrap.scss',
    scssComp + 'navigation.scss'
];

const cssSrc = root + 'src/css/',
      cssBuild = root + 'build/css/';
/// Writing the sequence of css files in an array for concat     
const cssArr = [
    cssSrc + 'bootstrap.css',
    cssSrc + 'navigation.css'
];

const js = root + 'src/js/',
      jsLib = root + 'src/js/lib/',
      jsPlugins = root + 'src/js/plugins/',
      jsComp = root + 'src/js/components/',
      jsBuild = root + 'build/js/';

/// Writing the sequence of js files in an array for concat   
const jsArr = [
    jsLib + 'jquery.js',
    jsLib + 'bootstrap.js',
    jsPlugins + 'resizeSensor.js',
    jsComp + 'main.js'
];

/// images paths
const imgSrc = root + 'src/img/**/*',
      imgBuild = root + 'build/img/';

/// Watch files
const htmlWatchFiles = root + 'src/*.html',
      styleWatchFiles = scss + '**/*.scss',
      jsWatchFiles = js + '**/*.js';



////// Functions
/// Handling CSS
function css(){
    return gulp.src(scssArr)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass({
            outputStyle: 'compressed'
            }).on('error', sass.logError)
    )
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(lineEndingCorrector())
    .pipe(gulp.dest(cssSrc))
}

function concatCss(){
    return gulp.src(cssArr)
    .pipe(sourcemaps.init({loadMaps:true,largeFile: true}))
    .pipe(concat('style.min.css'))
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(lineEndingCorrector())
    .pipe(gulp.dest(cssBuild))
}
/// Handling JS
function javascript(){
    return gulp.src(jsArr)
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('bundle.min.js'))
    .pipe(browserify({
        insertGlobals: true
    }))
    .pipe(uglify())
    .pipe(lineEndingCorrector())
    .pipe(gulp.dest(jsBuild))
}
/// Handling images
function imgMin(){
    return gulp.src(imgSrc)
    .pipe(changed(imgBuild))
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 80, progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest(imgBuild))
}

/// Watching
function watch(){
    browserSync.init({
        server: './src'
    });
    gulp.watch(styleWatchFiles, gulp.series([css, concatCss]));
    gulp.watch(jsWatchFiles, javascript);
    gulp.watch(imgSrc, imgMin);
    gulp.watch([htmlWatchFiles, jsBuild + 'bundle.min.js', cssBuild + 'style.min.css']).on('change', reload);
}
// Build
const build = gulp.series([css,concatCss, javascript, imgMin,watch]);
/// Default gulp task is to run build
gulp.task('default', build);