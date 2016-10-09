var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry  : {
    app    : ['babel-polyfill', './lib/index.js'],
    vendors: [
      'jquery', 'react', 'react-dom', 'material-ui', 'react-router',
      'redux', 'react-redux', 'react-router-redux',  'redux-thunk', 'fixed-data-table', 'highcharts',
      'highcharts-drilldown',  'whatwg-fetch','bootstrap', 'react-bootstrap'
    ]
  },
  output : {
    filename  : '[name].min.js',
    path      : path.join(__dirname, 'dist'),
    publicPath: ''
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendor.bundle.min.js'),
    new webpack.DefinePlugin({
      'process.env' : {
        'NODE_ENV': JSON.stringify('production')
      },
      '__DEVTOOLS__': false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('app.css', { allChunks: true }),
    new HtmlWebpackPlugin({
      title   : 'Redux React Router Async Example',
      filename: 'index.html',
      template: 'index.template.html',
      favicon : path.join(__dirname, 'assets/images/favicon.ico')
    })
  ],
  module : {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader!cssnext-loader' },
      {
        test   : /\.jsx?$/,
        loader : 'babel',
        include: path.join(__dirname, 'lib')
      },
      {
        test  : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      { test: /\.(gif|jpeg)$/, loader: 'file-loader' },
      {
        test   : /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  cssnext: {
    browsers: 'last 2 versions'
  }
};
