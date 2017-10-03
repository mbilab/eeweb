//express
const express = require('express')
const app = express()

//node built-in module
const path = require('path')
const fs = require('fs')

//npm module
const moment = require('moment')

//lib 
const dp = require('./lib/dropbox.js')

//process data from dropbox paper and save it to the front end
dp.data(it => {

  let data = it.split(/\n\n\-{10}\n/).slice(1, -1)
  let moment = require('moment')
  let news = []

  for (let v of data) {
    let match = v.match(/##\s*(.+?)\s*\n\s*(.+?)\s*\n\s*([\s\S]+?)\s*$/)
    let date = null
    if (moment(match[2]).isValid())
      date = moment(match[2])
    else
      match[3] = `${match[2]}\n${match[3]}`
    news.push({
      title: match[1],
      date: date,
      content: match[3],
    })
  }

  fs.writeFileSync('./app/res/data.json', JSON.stringify({
    news: news
  }, null, 2))
})    

/*
process.exit(0)

//HMR setting
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config.babel.js')
const compiler = webpack(webpackConfig)

//express
app.listen(1098, ()=>{console.log("server connect")})

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true, 
  publicPath: webpackConfig.output.publicPath
}))

app.use(webpack_hot_middleware = webpackHotMiddleware(compiler))
*/
