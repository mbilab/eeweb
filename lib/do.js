let fs = require('fs')
let data = fs.readFileSync('./data','utf-8')
let output = {}
let flag = false
let row = data.split(/\n/)
let obj

for(let i = 0 , j = 0 , len = row.length ; i < len ; ++i){
  //console.log(row[i])
  if(row[i] == ""){
    continue
  }else if(row[i].match(/^##\s(\w+)/)){
    let page = row[i].replace(/#+\s+/g,'')

    output[page] = []
    obj = output[page]
    flag = false
  }else if(row[i].match(/^[\|-\s]+$/)){
    flag = true
  }else if(!flag)
    continue 
  else{
    let [topic,date,content] = row[i].split(/\s*\|\s*/g).slice(1,-1)
    
    //content.replace(/\{/g,'<img')
    //content.replace(/\[/g,' href=')
    obj.push({topic: topic,date: date,content: content})
  }
}

fs.writeFileSync("../app/res/data.json",JSON.stringify(output, null, 2))

