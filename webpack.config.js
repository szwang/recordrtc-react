var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './src/app.js'
  ],

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './build')
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=react,presets[]=es2015,presets[]=stage-0']
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};