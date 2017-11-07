import autoprefixer from 'autoprefixer'
import postcssAutoreset from 'postcss-autoreset'
import webpack from 'webpack'

module.exports = {
    devServer: {
        allowedHosts: ['zoro.ee.ncku.edu.tw','merry.ee.ncku.edu.tw'],
        contentBase: `${__dirname}/dist`,
        host: '0.0.0.0',
        stats: { colors: true, modules: false },
    },
    entry: './app/app.js',
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(eot|otf|svg|ttf|woff(2)?)(\?[a-z0-9]+)?$/, use: 'file-loader?name=fonts/[hash:7].[ext]' },
            { test: /\.(jpeg|jpg|png|ico)$/, use: 'url-loader?limit=10000' },
            { test: /\.(ico)$/, use: 'file-loader?name=res/[name].[ext]' },
            { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
            { test: /\.pug$/, use: ['file-loader?name=[name].html', 'extract-loader', 'html-loader', 'pug-html-loader'] },
            { test: /\.sass$/, use: [
                'file-loader?name=[name].css',
                'extract-loader',
                'css-loader',
                { loader: 'postcss-loader', options: { plugins: [
                    autoprefixer,
                    postcssAutoreset({
                        reset: {
                            //margin: 0
                        }
                    })
                ]}},
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

// vi:et:sw=4:ts=4
