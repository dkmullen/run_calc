/*jshint esversion: 6 */

const gulp = require('gulp'),
  watch = require('gulp-watch'), // monitor changes to files and react
  browserSync = require('browser-sync').create(); // Browser auto refresh, sync across many screens

gulp.task('watch', () => {
  /* Sets up a web server to serve, reload our page, with other nifty features */
  browserSync.init({
    notify: false, // turn off notification in top corner
    server: {
      baseDir: './'
    }
  });

  // On changes to index.html or any js or css, redisplay the page w/o a full reload
  watch('index.html', () => {
    browserSync.reload();
  });

  watch('*.css', () => {
    browserSync.reload();
  });

  watch('*.js', () => {
    browserSync.reload();
    });
}); // End of watch task
