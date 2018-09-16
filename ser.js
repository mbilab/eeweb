#!/usr/bin/env node

const child_process = require('child_process')
const config = require('./config.json')
const dp = require('./lib/dropbox.js')(config)
const fs = require('fs')
const md5 = require('crypto-md5')
const moment = require('moment')
const sqlite3 = require('sqlite3').verbose()
const urlencode = require('urlencode')

// parse data from dropbox paper
const parseDropbox = (data, toFile=true) => {
  data = data.split(/\n+\-{10}\n/).slice(1, -1)

  const news = []
  for (let v of data) {
    let match = v.match(/^##\s*(\[.+?\])?(.+?)\s*\n\s*(.+?)\s*\n\s*([\s\S]+?)\s*$/)
    if (match.index)
      throw Error(`wrong format: ${v}`)

    const tag = match[1] //content type

    const title = match[2] // title

    // date {{{
    let date = moment(match[3].substring(3))
    if (date.isValid())
      date = date.format()
    else
      match[3] = `${match[3]}\n${match[4]}`
    // }}}

    let content = match[4].replace(/\!\[(.*?)\]\((.*?)\)/g, '<img src="$2">') // images

    // files {{{
    const regex = /https:\/\/www\.dropbox.*dl\=\d\n*/g
    const files = content.match(regex)
    if (files) content = content.replace(regex, '')
    // }}}

    news.push({
      content: content,
      date: date,
      files: files,
      index: md5(v, 'hex'),
      tag: tag,
      title: title,
    })
  }

  data = { news: news }

  if (toFile)
    fs.writeFileSync('./dist/data.json', JSON.stringify(data, null, 2))

  return data
}

if ('get' === process.argv[2]) {
  const content = dp.getSync()
  fs.writeFileSync('./dist/data.txt', content)
  parseDropbox(content)
} else if ('parse' === process.argv[2]) {
  const content = fs.readFileSync('./dist/data.txt').toString()
  parseDropbox(content)
} else { // {{{
  const refresh = () => {
    let tmp = dp.getSync()
    if (tmp.split(/\n/)[2].match(/\w/)) { //detect [X] whether update or not 
    
      let oldContents = JSON.parse(fs.readFileSync('./dist/data.json'))
      let newContents = parseDropbox(tmp, false)
      let update_content = []

      for (let i in newContents.news) {
        for (let j in oldContents.news) {
          if (newContents.news[i].index === oldContents.news[j].index) break
          else if (j == oldContents.news.length - 1) update_content.push(newContents.news[i].index)
        }
      }
     
      if (update_content.length) {
        //parseDropbox(tmp)
        update_content = 'update[]=' + update_content.join('&update[]=')
        child_process.exec(`php ./dist/chatbot.php '${update_content}'`, (err, stdout, stderr) => { //sending message to subscriber
          if (err) throw err
        })
      }  
    }
  }

  setInterval(refresh, config.refreshInterval)
} // }}}

// vi:et:sw=2:ts=2
