/*eslint no-console:0 */
'use strict';
require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');
const fse = require('fs-extra');

fse.copySync('./src/index.pug', './dist/index.pug');
fse.copySync('./src/403.html', './dist/403.html');
fse.copySync('./src/500.html', './dist/500.html');
fse.copySync('./src/operation-smarta.html', './dist/operation-smarta.html');
fse.copySync('./src/favicon.ico', './dist/favicon.ico');
fse.copySync('./src/images', './dist/images');
fse.copySync('./src/styles/bootstrap', './dist/styles/bootstrap');
fse.copySync('./src/styles/font-awesome', './dist/styles/font-awesome');

/**
 * Flag indicating whether webpack compiled for the first time.
 * @type {boolean}
 */
let isInitialCompilation = true;

const compiler = webpack(config);

var server = new WebpackDevServer(compiler, config.devServer);

server.use('/', function (req, res, next) {
  if (req.url.match(/.+\/img\//)) {
    // img
    res.redirect(301, req.url.replace(/.*\/(img\/.*)$/, '/$1'));
  } else if (req.url.match(/\/img\//)) {
    // img
    next();
  } else if (req.url.match(/.+\/video\//)) {
    // video
    res.redirect(301, req.url.replace(/.*\/(video\/.*)$/, '/$1'));
  } else if (req.url.match(/\/video\//)) {
    // video
    next();
  } else if (req.url.match(/.+\/font\//)) {
    // font
    res.redirect(301, req.url.replace(/.*\/(font\/.*)$/, '/$1'));
  } else if (req.url.match(/\/font\//)) {
    // font
    next();
  } else if (req.url.match(/.+\/.*\.[^\/]*$/)) {
    // file
    res.redirect(301, req.url.replace(/.*\/([^\/]*)$/, '/$1'));
  } else {
    next();
  }
});

server.listen(config.port, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + config.port);
});

compiler.plugin('done', () => {
  if (isInitialCompilation) {
    // Ensures that we log after webpack printed its stats (is there a better way?)
    setTimeout(() => {
      console.log('\n✓ The bundle is now ready for serving!\n');
      console.log('  Open in iframe mode:\t\x1b[33m%s\x1b[0m',  'http://localhost:' + config.port + '/webpack-dev-server/');
      console.log('  Open in inline mode:\t\x1b[33m%s\x1b[0m', 'http://localhost:' + config.port + '/\n');
      console.log('  \x1b[33mHMR is active\x1b[0m. The bundle will automatically rebuild and live-update on changes.')
    }, 350);
  }
  isInitialCompilation = false;
});
