const { join } = require('path')

function joinNormal(...paths) {
  return join(...paths).replace(/\\/g, '/')
}

module.exports = {
  joinNormal
}