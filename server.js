const path = require('path');
const express = require('express');
const webpack = require('webpack');
const config = require('./webpack.config');

const app = express();
const compiler = webpack(config);
const port = process.env.PORT || process.env.port || 3001;
app.use(/\.js$|\.css$/,express.static('dist'));

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000 // is this the same as specifying --watch-poll?
    }
  }));

  app.use(require('webpack-hot-middleware')(compiler));

app.get('*',function(req,res,next) {
  if(/\.js$|\.css$|\.png$|\.jpg$/.test(req.url)){
    const splittedUrl = req.url.split('/');
    res.sendFile(path.join(__dirname,'./dist',splittedUrl[splittedUrl.length-1]));
  return;
  }
  next();
});
app.get('*', function (req, res) {
  console.log(req.url);
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.listen(port, 'localhost', function (err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Listening at port : '+port);
});
