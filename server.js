const express = require('express')
const app = express()
const path = require('path')
const webpack = require('webpack')
const fs = require('fs')
//const moment = require('moment')

const dp = require('./lib/dropbox.js')

//app.listen(1098, ()=>{console.log("server connect")})

//app.use(express.static(path.resolve('./dist')))

dp.data( it => {
  let output = {}
  let text = it.split(/\-{10}/)

  for (let i = 0, len = text.length; i < len; ++i) {
      
    if(text[i].match(/^(\n)*##/)){
      
        output["id_" + i] = {}
        let arti = text[i].split(/([0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2})/g)
        let [title,date,content] = [arti[0].replace(/\n/g,""),arti[1],arti[2].replace(/\n/g,"<br>")]
        output["id_" + i]={"title":title,"date":date,"content":content}
      
      }else continue
  }
  
  fs.writeFileSync("./app/res/data.json", JSON.stringify(output, null, 2))
})

