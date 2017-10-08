#!/usr/bin/env node

const dp = require('./lib/dropbox.js')
const fs = require('fs')
const moment = require('moment')

// parse data from dropbox paper and save it to the front end
const parseDropbox = it => {
    let data = it.toString().split(/\n\n\-{10}\n/).slice(1, -1)
    let news = []
    let i = 0

    for (let v of data) {
        let match = v.match(/##\s*(.+?)\s*\n\s*(.+?)\s*\n\s*([\s\S]+?)\s*$/)
        let date = null
        if (moment(match[2]).isValid())
            date = moment(match[2]).format('lll')
        else
            match[3] = `${match[2]}\n${match[3]}`
        i++
        news.push({
            index: i,
            title: match[1],
            date: date,
            content: match[3],
        })
    }

    fs.writeFileSync('./dist/data.json', JSON.stringify({
        news: news
    }, null, 2))
}

//dp.get(parseDropbox) // async
parseDropbox(dp.getSync()) // sync

// vi:et:sw=4:ts=4
