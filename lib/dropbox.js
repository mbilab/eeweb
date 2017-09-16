var opt = require('../option.json')
var arg = opt.dropbox_api
var child_process = require('child_process')

module.exports = {
  data: () => {    
    child_process.exec("curl -X POST https://api.dropboxapi.com/2/paper/docs/download -H 'Authorization: Bearer sMQ5RJX6O_UAAAAAAAAHt515UEc2udU2lyBfBkKyOsA1kQtDOIWC0hv_ijSLEIFt' -H 'Dropbox-API-Arg:" + JSON.stringify(arg) + "'", function(err, stdout, stderr){
      if(err){
        throw err
      }
      return stdout
    })
  }
}
