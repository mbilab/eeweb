const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')

// config
const server = require('./option.json').server

module.exports = {
  devServer: {
    allowedHosts: ['zoro.ee.ncku.edu.tw'],
    host: '0.0.0.0',
    port: server.port,
    stats: { colors: true, modules: false },
  },
  //entry: ['./app.js','webpack-hot-middleware/client?reload=true'],
  entry: ['./app/app.js'],
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader?insertAt=top', 'css-loader'] },
      { test: /\.(eot|otf|svg|ttf|woff(2)?)(\?[a-z0-9]+)?$/, use: 'file-loader?name=fonts/[hash:7].[ext]' },
      { test: /\.(jpeg|jpg|png|ico)$/, use: 'url-loader?limit=10000' },
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.pug$/, use: ['file-loader?name=[name].html', 'extract-loader', 'html-loader', 'pug-html-loader?exports=false'] },
      { test: /\.sass$/, use: ['file-loader?name=[name].css', 'extract-loader', 'css-loader', { loader: 'postcss-loader', options: { plugins: [autoprefixer] } }, 'sass-loader'] }
    ]
  },
  output: {
    filename: 'app.js',
    path: `${__dirname}/dist`,
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}

// vi:et
