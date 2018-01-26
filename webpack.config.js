const autoprefixer = require('autoprefixer')
const config = require('./config')
const webpack = require('webpack')

module.exports = {
  devServer: {
    allowedHosts: config.allowedHosts,
    contentBase: `${__dirname}/dist`,
    host: '0.0.0.0',
    port: config.webpackPort,
    stats: { colors: true, modules: false },
  },
  entry: './app/app.js',
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(eot|ico|jpeg|jpg|otf|png|svg|ttf|woff(2)?)(\?[a-z0-9]+)?$/, use: 'file-loader?name=fonts/[hash:5].[ext]' },
      { test: /\.(ico)$/, use: 'file-loader?name=res/[name].[ext]' },
      { test: /\.pug$/, use: ['file-loader?name=[name].html', 'extract-loader', 'html-loader', 'pug-html-loader'] },
      { test: /\.sass$/, use: [
        'file-loader?name=[name].css',
        'extract-loader',
        'css-loader',
        { loader: 'postcss-loader', options: { plugins: [ autoprefixer ]}},
        'sass-loader',
      ]},
    ]
  },
  output: {
    filename: 'app.js',
    path: `${__dirname}/dist`,
  },
}

if ('production' === process.env.NODE_ENV) {
  module.exports.plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
    }),
  ]
}
