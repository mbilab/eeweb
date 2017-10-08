var child_process = require('child_process')
var opt = require('../option.json')

let cmd = "curl -X POST https://api.dropboxapi.com/2/paper/docs/download"
cmd += " -H 'Authorization: Bearer sMQ5RJX6O_UAAAAAAAAHt515UEc2udU2lyBfBkKyOsA1kQtDOIWC0hv_ijSLEIFt'"
cmd += ` -H 'Dropbox-API-Arg: ${JSON.stringify({doc_id: opt.doc_id, export_format: 'markdown'})}'`

module.exports = { 
    get: cb => {
        child_process.exec(cmd, function(err, stdout, stderr){
            if (err) throw err
            cb(stdout)
        })
    },
    getSync: () => {
        return child_process.execSync(cmd)
    },
}

// vi:et:sw=4:ts=4
