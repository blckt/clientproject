const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000 // is this the same as specifying --watch-poll?
  }
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function (req, res) {
  console.log(req.url);
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(3001, 'localhost', function (err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Listening at http://localhost:3001');
});
