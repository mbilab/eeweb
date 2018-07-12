#!/usr/bin/env node

const child_process = require('child_process')
const config = require('./config.json')
const dp = require('./lib/dropbox.js')
const fs = require('fs')
const moment = require('moment')
const sqlite3 = require('sqlite3').verbose()
const urlencode = require('urlencode')

// parse data from dropbox paper
const parseDropbox = (data, toFile=true) => {
  data = data.split(/\n+\-{10}\n/).slice(1, -1)

  const news = []
  for (let v of data) {
    let match = v.match(/^##\s*(.+?)\s*\n\s*(.+?)\s*\n\s*([\s\S]+?)\s*$/)
    if (match.index)
      throw Error(`wrong format: ${v}`)

    const title = match[1] // title

    // date {{{
    let date = moment(match[2].substring(3))
    if (date.isValid())
      date = date.format()
    else
      match[3] = `${match[2]}\n${match[3]}`
    // }}}

    let content = match[3].replace(/\!\[(.*?)\]\((.*?)\)/g, '<img src="$2">') // images

    // files {{{
    const regex = /https:\/\/www\.dropbox.*dl\=\d\n*/g
    const files = content.match(regex)
    if (files) content = content.replace(regex, '')
    // }}}

    news.push({
      content: content,
      date: date,
      files: files,
      index: news.length + 1,
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
    let meta = JSON.parse(dp.getMetadataSync())
    let current = moment(meta.last_updated_date).format('YYYY-MM-DD HH:MM:SS.SSS')
    //open database
    let db = new sqlite3.Database('./data.db', err => {
      if (err)
        return err.message
    })

    let sql = 'select * from meta'

    db.get(sql, [], (err, row) => {
      if (err)
        return err.message

      if( row.update_date != current){
        db.run(`UPDATE meta SET update_date = "${current}"`, err => { //update update time
          if (err)
            return err.message
        })

        parseDropbox(dp.getSync()) // update content in front end

        child_process.exec("php ./dist/chatbot.php post", (err, stdout, stderr) => { //sending message to subscriber
          if (err) throw err
        })
      }
    })

    // close the database connection
    db.close()
  }

  setInterval(refresh, config.refreshInterval)
} // }}}

// vi:et:sw=2:ts=2
