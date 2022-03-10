const yaml = require('js-yaml')
const { readFileSync, existsSync } = require('fs')
const { resolve, join } = require('path')
const { joinNormal } = require('../../utils/path')
const { readFiles } = require('../../utils/file')

const doc = yaml.load(readFileSync(resolve(__dirname, 'groups.yml')))
const IMAGES_PATH = resolve(__dirname, 'images')

const groups = []
const pathImageMap = {}

;(function doGet(list, children) {
  list.forEach(o => {
    const key = typeof o === 'string' ? o : Object.keys(o)[0]
    const keyParts = key.split('-')
    const group = {
      name: keyParts[0],
      title: keyParts[1]
    }
    children.push(group)
    if (Array.isArray(o[key])) {
      group.children = []
      doGet(o[key], group.children)
    }
  })
})(doc, groups);

;(function doIte(list, parentPath = '') {
  if (!list || !list.length) return
  list.forEach(o => {
    const path = joinNormal(parentPath, o.name)
    const dirPath = join(IMAGES_PATH, path)

    // 不存在，跳过
    if (!existsSync(dirPath)) return false

    const files = readFiles(dirPath)
    let exp = null
    files.forEach(file => {
      if (file.name === 'exp.json') {
        exp = JSON.parse(readFileSync(join(dirPath, file.name)))
      } else if (file.name === 'image.png') {
        const image = {
          __path: join(dirPath, file.name)
        }
        o.image = image
        pathImageMap[image.__path] = image
      }
    })
    if (exp) {
      o.elements = Object.keys(exp).reduce((list, baseName) => {
        const image = {
          __path: join(dirPath, `${baseName}.png`)
        }
        if (!existsSync(image.__path)) return list
        pathImageMap[image.__path] = image
        list.push({
          image,
          exp: exp[baseName]
        })
        return list
      }, [])
    }
    doIte(o.children, path)
  })
})(groups);

module.exports = {
  groups,
  pathImageMap
}
