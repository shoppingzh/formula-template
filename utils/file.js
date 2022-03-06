const { readdirSync } = require('fs')
const { join } = require('path')

function readFiles(path) {
  return readdirSync(path, { withFileTypes: true }).filter(o => o.isFile())
}

module.exports = {
  readFiles
}
