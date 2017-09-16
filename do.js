const fs = require('fs')
const data = fs.readFileSync('./data','utf-8')
const output = {}
const row = data.split(/\-\s/)
var obj = []
var flag = false

module.exports = {
  update: () => {  
    for (let i = 0 , j = 0, len = row.length; i < len; ++i) {
      //console.log(i + '+' + row[i])
      if(row[i] == ""){
        continue
      }else if(row[i].match(/^#/)){
        let page = row[i].replace(/#+\s+/g,'')
        row[i] = row[i].replace(/\n/g,'')
        output[page] = []
        obj = output[page]
        //console.log('page')
      }else if(row[i].match(/[a-zA-Z]+/)){
        if(!flag){
          //console.log('title')
          row[i] = row[i].replace(/\n/g,'')
          obj.push({topic: row[i]})
        }else{
          //console.log('content')
          row[i] = row[i].replace(/\n/g,'</br>')
          console.log(row[i])
          obj.push({content: row[i]})
        }
      }else if(row[i].match(/[0-9]+/)){
        //console.log('date')
        row[i] = row[i].replace(/\n/g,'')
        obj.push({date: row[i]})
        flag = true
      }
      
      if(row[i].match(/\-$/)){
          //console.log('end')
          flag = false
      }
    }
    
    fs.writeFileSync("../app/res/data.json",JSON.stringify(output, null, 2))
  },
  updateMin: () => {
    console.log(data)
  }
}
