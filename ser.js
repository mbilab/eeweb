#!/usr/bin/env node

const child_process = require('child_process')
const config = require('./config.json')
const dp = require('./lib/dropbox.js')
const fs = require('fs')
const moment = require('moment')
const sqlite3 = require('sqlite3').verbose()
const urlencode = require('urlencode')

// parse data from dropbox paper and save it to the front end
const parseDropbox = (data, toFile=true) => {
    fs.writeFileSync('./dist/raw_data', data.toString())
    data = data.toString().split(/\n+\-{10}\n/).slice(1, -1)
    const news = []
    const data_type = ['lecture','activity','others']
    let i = 1
    moment.locale('zh-tw')
    for (let v of data) {
        let match = v.match(/##\s*(.+?)\s*\n\s*(.+?)\s*\n\s*([\s\S]+?)\s*$/)
        let date = null
        let content_type = 'others'

        for (let m of data_type) {
            let type = match[1].match(/\[(.+?)\]/)

            if (type) {
                if( m == type[1])
                    content_type = m
            }

        }

        if (moment(match[2].substring(3)).isValid())
            date = `${moment(match[2].substring(3)).format('ll dddd')}`
        else
            match[3] = `${match[2]}\n${match[3]}`

        while( match[3].match(/\!\[/) ){
            let img = match[3].match(/\!\[(.*?)\]\((.*?)\)/)

            let pos = match[3].indexOf(img[0])

            match[3] = `${match[3].substring(0, pos)}<img src="${img[2]}">${match[3].substring(pos + img[0].length + 2)}`
        }

        query = /https\:\/\/www\.dropbox.*dl\=\d\n*/g

        file = match[3].match(query)
        match[3] = match[3].replace(query,"")

        if(null != file) {

            match[3] += "<div class='file'><div>附件</div>"
            for (let v of file) {
                file_info = v.match(/.*\/(.*)\.(\w*)\?/).slice(1,3)
                file_name = urlencode.decode(file_info[0]) //附件檔案名稱
                file_type = file_info[1] //附件檔案格式
                file_icon = file_type.toUpperCase()

                match[3] += `<a class="${file_type}" href="${v}" target="blank">
                                <span class="file_type">${file_icon}</span>
                                <span>${file_name}</span>
                             </a>`
            }
            match[3] += "</div>"
        }

        news.push({
            content: match[3],
            date: date,
            index: i++,
            title: match[1],
            type: content_type,
        })
    }
    data = { news: news }
    data.news.reverse()

    if (toFile)
        fs.writeFileSync('./dist/data.json', JSON.stringify(data, null, 2))

    return data
}

if ('get' === process.argv[2]) {
    parseDropbox(dp.getSync().content) // sync
    /*child_process.exec("php ./dist/chatbot.php post", (err, stdout, stderr) => { //sending message to subscriber
        if (err) throw err
    })*/

} else{
    const refresh = () => {
        let meta = JSON.parse(dp.getSync().metadata.toString())
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

                parseDropbox(dp.getSync().content) // update content in front end

                child_process.exec("php ./dist/chatbot.php post", (err, stdout, stderr) => { //sending message to subscriber
                    if (err) throw err
                })
            }
        })

        // close the database connection
         db.close()
    }

    setInterval(refresh, config.refreshInterval)

}

// vi:et:sw=4:ts=4
