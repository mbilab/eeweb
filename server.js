//express
const express = require('express')
const app = express()

//node built-in module
const path = require('path')
const fs = require('fs')

//HMR setting
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config.babel.js')
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

let data = it.split(/\-{10}/).filter( e => { return e }).slice(1,-1)
let output = {}
let moment = require('moment')
let obj = []
let date

output["news"] = []
obj = output["news"]

for(let i = 0; i< data.length; ++i){
  let title = data[i].match(/##(.)+/g)[0].replace(/^##\s*/,"")
  let arti = data[i].replace(/##(.)+/,"").split(/\n/).filter( e => { return e })
  
  moment(arti[0]).isValid()?(date = arti[0], arti.shift(), obj.push({title: title, date: date, content: arti.join("\n")})):(obj.push({title: title, date: null, content: arti.join("\n")}))

}

fs.writeFileSync("./app/res/data.json",JSON.stringify(output, null, 2))

})    
