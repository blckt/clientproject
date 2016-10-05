/*!
 * Facebook React Starter Kit | https://github.com/kriasoft/react-starter-kit
 * Copyright (c) KriaSoft, LLC. All rights reserved. See LICENSE.txt
 */

'use strict';

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const path = require('path');
const merge = require('merge-stream');
const runSequence = require('run-sequence');
const webpack = require('webpack');
const browserSync = require('browser-sync');
const pagespeed = require('psi');
const argv = require('minimist')(process.argv.slice(2));

// Settings
const DEST = './build';                         // The build output folder
const RELEASE = !!argv.release;                 // Minimize and optimize during a build?
const GOOGLE_ANALYTICS_ID = 'UA-XXXXX-X';       // https://www.google.com/analytics/web/
const AUTOPREFIXER_BROWSERS = [                 // https://github.com/ai/autoprefixer
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

const src = {};
const watch = false;
const pkgs = (function () {
  const temp = {};
  const map = function (source) {
    for (const key in source) {
      temp[key.replace(/[^a-z0-9]/gi, '')] = source[key].substring(1);
    }
  };
  map(require('./package.json').dependencies);
  return temp;
}());

// The default task
gulp.task('default', ['serve']);

// Clean up
gulp.task('clean', del.bind(null, [DEST]));

// 3rd party libraries
gulp.task('vendor', function () {
  return merge(
    gulp.src('./node_modules/jquery/dist/**')
      .pipe(gulp.dest(DEST + '/vendor/jquery-' + pkgs.jquery)),
    gulp.src('./node_modules/bootstrap/dist/fonts/**')
      .pipe(gulp.dest(DEST + '/fonts'))
  );
});

// Static files
gulp.task('assets', function () {
  src.assets = 'src/assets/**';
  return gulp.src(src.assets)
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST))
    .pipe($.size({ title: 'assets' }));
});

// Images
gulp.task('images', function () {
  src.images = 'src/images/**';
  return gulp.src(src.images)
    .pipe($.changed(DEST + '/images'))
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(DEST + '/images'))
    .pipe($.size({ title: 'images' }));
});

// HTML pages
gulp.task('pages', function () {
  src.pages = 'src/pages/**/*.html';
  return gulp.src(src.pages)
    .pipe($.changed(DEST))
    .pipe($.if(RELEASE, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true
    })))
    .pipe(gulp.dest(DEST))
    .pipe($.size({ title: 'pages' }));
});

// CSS style sheets
gulp.task('styles', function () {
  src.styles = 'src/styles/**/*.{css,less}';
  return gulp.src('src/styles/bootstrap.less')
    .pipe($.plumber())
    .pipe($.less({
      sourceMap: !RELEASE,
      sourceMapBasepath: __dirname
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
    .pipe($.csscomb())
    .pipe($.if(RELEASE, $.minifyCss()))
    .pipe(gulp.dest(DEST + '/css'))
    .pipe($.size({ title: 'styles' }));
});

// Bundle
gulp.task('bundle', function (cb) {
  const started = false;
  const config = require('./config/webpack.js')(RELEASE);
  const bundler = webpack(config);

  function bundle(err, stats) {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    !!argv.verbose && $.util.log('[webpack]', stats.toString({ colors: true }));

    if (!started) {
      started = true;
      return cb();
    }
  }

  if (watch) {
    bundler.watch(200, bundle);
  } else {
    bundler.run(bundle);
  }
});

// Build the app from source code
gulp.task('build', ['clean'], function (cb) {
  runSequence(['vendor', 'assets', 'images', 'pages', 'styles', 'bundle'], cb);
});

// Launch a lightweight HTTP Server
gulp.task('serve', function (cb) {

  watch = true;

  runSequence('build', function () {
    browserSync({
      notify: false,
      // Customize the BrowserSync console logging prefix
      logPrefix: 'RSK',
      // Run as an https by uncommenting 'https: true'
      // Note: this uses an unsigned certificate which on first access
      //       will present a certificate warning in the browser.
      // https: true,
      server: DEST
    });

    gulp.watch(src.assets, ['assets']);
    gulp.watch(src.images, ['images']);
    gulp.watch(src.pages, ['pages']);
    gulp.watch(src.styles, ['styles']);
    gulp.watch(DEST + '/**/*.*', function (file) {
      browserSync.reload(path.relative(__dirname, file.path));
    });
    cb();
  });
});

// Deploy to GitHub Pages
gulp.task('deploy', function () {

  // Remove temp folder
  if (argv.clean) {
    const os = require('os');
    const path = require('path');
    const repoPath = path.join(os.tmpdir(), 'tmpRepo');
    $.util.log('Delete ' + $.util.colors.magenta(repoPath));
    del.sync(repoPath, { force: true });
  }

  return gulp.src(DEST + '/**/*')
    .pipe($.if('**/robots.txt', !argv.production ? $.replace('Disallow:', 'Disallow: /') : $.util.noop()))
    .pipe($.ghPages({
      remoteUrl: 'https://github.com/{name}/{name}.github.io.git',
      branch: 'master'
    }));
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
  url: 'https://example.com',
  strategy: 'mobile'
}));
