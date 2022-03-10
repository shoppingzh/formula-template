const { readLines } = require("../../utils/file")
const { existsSync } = require('fs')
const { resolve } = require('path')

const symbols = [
  {
    name: 'base',
    title: '基础数学'
  }
]

symbols.forEach(o => {
  const filePath = resolve(__dirname, `${o.name}`)
  if (!existsSync(filePath)) throw new Error(`${o.title}组没有对应的文件！`)
  const list = readLines(filePath, true)
  o.elements = list.map(x => x.trim()).map(exp => ({
    exp
  }))
})

module.exports = symbols
