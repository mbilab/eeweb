const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')

// config
const server = require('./option.json').server

module.exports = {
  context: path.resolve('app'),
  devServer: {
    host: server.host,
    inline: true,
    port: server.port,
    stats: { chunkModules: false }
  },
  entry: ['./app.js','webpack-hot-middleware/client?reload=true'],
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
  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  output: {
    filename: 'app.js',
    path: path.resolve('./dist'),
    publicPath: `http://${server.host}:${server.port}/`
  }
}

// vi:et
