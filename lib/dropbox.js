var cmd = require('child_process').execSync
var config = require('../config.json')

let content = "curl -X POST https://api.dropboxapi.com/2/paper/docs/download"
content += ` -H 'Authorization: Bearer ${config.authorizationToken}'`
content += ` -H 'Dropbox-API-Arg: ${JSON.stringify({doc_id: config.dropboxId, export_format: 'markdown'})}'`

let metadata = "curl -X POST https://api.dropboxapi.com/2/paper/docs/get_metadata"
metadata += ` -H 'Authorization: Bearer ${config.authorizationToken}'`
metadata += " -H 'Content-Type: application/json'"
metadata += ` -d '{"doc_id": "${config.dropboxId}"}'`

module.exports = { 
    getSync: () => {
        return {
            content: cmd(content),
            metadata: cmd(metadata)
        }
    },
}

// vi:et:sw=2:ts=2
