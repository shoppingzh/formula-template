const { readdirSync, readFileSync } = require('fs')
const { join } = require('path')

function readFiles(path) {
  return readdirSync(path, { withFileTypes: true }).filter(o => o.isFile())
}

function readLines(path, filterBlankLines = false) {
  const str = readFileSync(path, { encoding: 'utf8' })
  let lines = str.split(/\r?\n/g)
  if (filterBlankLines) {
    lines = lines.filter(line => line.trim())
  }
  return lines
}

module.exports = {
  readFiles,
  readLines
}
