//express
const express = require('express')
const app = express()

//node built-in module
const path = require('path')
const fs = require('fs')

//HMR setting
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config.js')
const compiler = webpack(webpackConfig)

//npm module
const moment = require('moment')

//lib 
const dp = require('./lib/dropbox.js')

//express
app.listen(1098, ()=>{console.log("server connect")})

app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true, 
      publicPath: webpackConfig.output.publicPath
}))
    
app.use(webpack_hot_middleware = webpackHotMiddleware(compiler))

//process data from dropbox paper and save it to the front end
dp.data( it => {
  let data = it.replace(/^\n+/,'')
  let output = {}
  let arti = data.split(/\-{10}/).filter((e) => {return e}).slice(1,-1)
  let obj = []

  output["news"] = []
  obj = output["news"]

  function spPos(string, subString, index) {
      return string.split(subString, index).join(subString).length
  }

  for (let i = 0, len = arti.length; i < len; ++i) {
    obj.push({title: arti[i].slice(0,spPos(arti[i], "\n", 2)).replace(/\n+#+\s/g,""),date: arti[i].slice(spPos(arti[i], "\n", 3), spPos(arti[i], "\n", 4)).replace(/\n/g,""),content: arti[i].slice(spPos(arti[i], "\n", 4)).replace(/\n/,"")})
  }

  fs.writeFileSync("./app/res/data.json",JSON.stringify(output, null, 2))
})    
