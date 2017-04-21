import chalk from 'chalk'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import fs from 'fs'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import webpack from 'webpack'

// config
const opt = JSON.parse(fs.readFileSync('./option.json'))

export default {
  devServer: {
    contentBase: path.resolve('./dist'),
    host: opt.host,
    hot: true,
    inline: true,
    port: opt.port,
    stats: {
		  chunkModules: false,
		  chunks: false,
		  colors: true,
		  hash: false,
		  version: false
    }
  },
  entry: path.resolve('./app/app.js'),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(eot|otf|svg|ttf|woff(2)?)(\?[a-z0-9]+)?$/,
        use: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpeg|jpg|png)$/,
        use: 'url-loader?limit=10000'
      },
      {
        test: /\.js$/,
        exclude: /\/node_modules\/|\/lib\//,
        use: 'babel-loader'
      },
      {
        test: /\.pug$/,
        use: 'pug-loader'
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'stylus-loader'
          ]
        })
      }
    ]
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'app.css'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve('./app/index.pug')
    }),
    new ProgressBarPlugin({
      format: `:msg build [${chalk.yellow.bold(':bar')}] ${chalk.green.bold(':percent')} (:elapsed seconds)`
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      stylus: {
        default: {
          use: [require('nib')()]
        }
      }
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    modules: [
      'node_modules'
    ]
  }
}
