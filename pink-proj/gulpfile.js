//Подключаем модули
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var csscomb = require('gulp-csscomb');
var less = require('gulp-less');
var concat = require('gulp-concat');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var del = require('del');
var Sync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');

//Массив файлов для конкатенации стилей
var cssFiles = [
    './source/less/style.less'
]
//Массив файлов для конкатинации скриптов
var scriptFiles = [
    './source/js/menu.js',
    './source/js/slider.js'
]

//Таск на стили CSS
function styles(){
    //Путь откуда берутся файлы для компиляции
    return gulp.src(cssFiles)
         .pipe(plumber())
         .pipe(sourcemaps.init())
         .pipe(less())

    //Добавляем префиксы в наш css
    .pipe(postcss([
        autoprefixer()
    ]))
    //Сжимаем файл
    .pipe(cleanCSS({
        level: 2
    }))
    //Куда запишется карта кода. Запишется в style.css
    .pipe(sourcemaps.write())
    //Путь куда будут записываться файлы в результате
    .pipe(gulp.dest('./source/css'))
    .pipe(Sync.stream());
}

//Очищаем папку build от файлов
function clean(){
    return del(['source/css/*'])

}

//Просмотр файлов, отслеживание изменений в них
function watch(){

    Sync.init({
        server: {
            baseDir: "./source"
        }
    });

    gulp.watch('./source/less/**/*.less', styles)
    gulp.watch('./source/js/**/*.js', scripts)
    gulp.watch("./source/*.html").on('change', Sync.reload)
}

//Таск на скрипты
function scripts(){
    //Путь откуда берутся скрипты
    return gulp.src(scriptFiles)
    //В какой файл склееваются
    .pipe(concat('script.js'))
    //Cжатие файла скрипта
    .pipe(uglify({
        toplevel: true
    }))
    //Путь куда отправляются склеенные файлы
    .pipe(gulp.dest('./build/js'))
    .pipe(Sync.stream());
}

gulp.task('style', styles);
gulp.task('script', scripts);
gulp.task('clean', clean)

gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts)));
gulp.task('dev', gulp.series('build','watch'));