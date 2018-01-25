#!/usr/bin/env node

const config = require('./config.json')
const dp = require('./lib/dropbox.js')
const fs = require('fs')
const moment = require('moment')

// parse data from dropbox paper and save it to the front end
const parseDropbox = (data, toFile=true) => {
    data = data.toString().split(/\n+\-{10}\n/).slice(1, -1)
    const news = []
    let i = 1

    moment.locale('zh-tw')
    for (let v of data) {
        let match = v.match(/##\s*(.+?)\s*\n\s*(.+?)\s*\n\s*([\s\S]+?)\s*$/)
        let date = null
        if (moment(match[2].substring(3)).isValid())
            date = `${match[2].substring(0,3)}${moment(match[2].substring(3)).format('ll ddd')}`
        else
            match[3] = `${match[2]}\n${match[3]}`

        while( match[3].match(/\!\[/) ){
            let img = match[3].match(/\!\[(.*?)\]\((.*?)\)/)
            let pos = match[3].indexOf(img[0])
            
            if(!img[1])
                img[1] = 'size-small'

            match[3] = `${match[3].substring(0, pos)}<img class="${img[1]}" src="${img[2]}">${match[3].substring(pos + img[0].length)}`
        }

        //match[3] = match[3].replace(/\!\[/g,"<img class='")
        //match[3] = match[3].replace(/\]\(/g,"' src='")
        //match[3] = match[3].replace(/\)/g,"'>")

        news.push({
            content: match[3],
            date: date,
            index: i++,
            title: match[1],
        })
    }
    data = { news: news }
    data.news.reverse()

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
    const io = require('socket.io')(config.socketPort)
    console.log(`socket on ${config.socketPort}`)

    const refresh = () => {
        data = parseDropbox(dp.getSync(), false)
        for (let k in clients)
            clients[k].emit('data', data)
    }
    setInterval(refresh, config.refreshInterval)
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
