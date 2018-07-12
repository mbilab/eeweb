const cmd = require('child_process').execSync

module.exports = config => {

  return {

    getMetadataSync: () => {
      return cmd(`
        curl -X POST https://api.dropboxapi.com/2/paper/docs/get_metadata \
             -H 'Authorization: Bearer ${config.authorizationToken}' \
             -H 'Content-Type: application/json' \
             -d '{"doc_id": "${config.dropboxId}"}'
      `).toString()
    },

    getSync: () => {
      return cmd(`
       curl -X POST https://api.dropboxapi.com/2/paper/docs/download \
            -H 'Authorization: Bearer ${config.authorizationToken}' \
            -H 'Dropbox-API-Arg: ${JSON.stringify({doc_id: config.dropboxId, export_format: 'markdown'})}'
      `).toString()
    }
  }
}

// vi:et:sw=2:ts=2
