#!/usr/bin/env node

const dp = require('./lib/dropbox.js')
const fs = require('fs')
const moment = require('moment')
const opt = require('./option.json')

// parse data from dropbox paper and save it to the front end
const parseDropbox = (data, toFile=true) => {
    data = data.toString().split(/\n\n\-{10}\n/).slice(1, -1)
    const news = []
    let i = 1
    for (let v of data) {
        let match = v.match(/##\s*(.+?)\s*\n\s*(.+?)\s*\n\s*([\s\S]+?)\s*$/)
        let date = null
        if (moment(match[2]).isValid())
            date = moment(match[2]).format('lll')
        else
            match[3] = `${match[2]}\n${match[3]}`
        
        match[3] = match[3].replace(/\!\[/g,"<img ")
        match[3] = match[3].replace(/\]\(/g,"src='")
        match[3] = match[3].replace(/\)/g,"'>")
        
        news.push({
            content: match[3],
            date: date,
            index: i++,
            title: match[1],
        })
    }
    data = { news: news }
    data.news.reverse()

    console.log(data)

    if (toFile)
        fs.writeFileSync('./dist/data.json', JSON.stringify(data, null, 2))

    return data
}

if ('get' === process.argv[2]) {
    //dp.get(parseDropbox) // async
    parseDropbox(dp.getSync()) // sync
} else {
    const clients = {}
    let data = JSON.parse(fs.readFileSync('./dist/data.json', 'utf8'))
    const io = require('socket.io')(opt.socket_port)
    console.log(`socket on ${opt.socket_port}`)

    const refresh = () => {
        data = parseDropbox(dp.getSync(), false)
        for (let k in clients)
            clients[k].emit('data', data)
    }
    setInterval(refresh, opt.refresh_interval)
    io.on('refresh', refresh)

    io.on('connection', socket => {
        clients[socket.id] = socket
        socket.emit('data', data)
    })

    io.on('disconnect', socket => {
        delete clients[socket.id]
    })
}

// vi:et:sw=4:ts=4
