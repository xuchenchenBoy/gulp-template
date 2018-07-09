var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');  
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
var eslint = require('gulp-eslint')
var watch = require('gulp-watch');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var postcss = require('gulp-postcss');
var adaptive = require('postcss-adaptive');

// 检查js规则
gulp.task('lint', function(){
  return gulp.src('src/js/*.js')
    .pipe(eslint({ config: './eslintrc', fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

// js的合并压缩
gulp.task('script', function() {
  gulp.src(['src/js/amfe-flexible.js', 'src/js/index.js'])
    .pipe(concat('min.js')) // 合并
    .pipe(uglify()) // 压缩
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
})

// css的合并压缩
gulp.task('style', function() {
  var processors = [adaptive({ remUnit: 75 })];

  gulp.src(['src/css/reset.less', 'src/css/style.less'])
  .pipe(less())
  .pipe(concat('min.css'))
  .pipe(postcss(processors))
  .pipe(minifyCss())
  .pipe(autoprefixer({  //自动给CSS 加前缀，用于兼容不同浏览器，不同版本
    browsers: ['last 4 versions'], // 主流浏览器的最新的四个版本
    cascade: false
  }))
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload());
})

gulp.task('connect', function() {
    connect.server({
      // host: '10.8.85.174', 
      // port: 8080, 
      // root: './', // 当前项目主目录
      livereload: true // 自动刷新
    });
});

gulp.task('html', function() {
    gulp.src('*.html')
      .pipe(gulp.dest('dist'))
      .pipe(connect.reload());
});

gulp.task('watch', function() {
  // livereload.listen();
  gulp.watch(['*.html'], ['html']); //监控html文件
  gulp.watch('src/css/*.less', ['style']);
  gulp.watch('src/js/*.js', ['lint', 'script']);
})

gulp.task('build', ['html', 'style', 'lint', 'script']);
gulp.task('server', ['html', 'style', 'script', 'watch', 'connect']);



