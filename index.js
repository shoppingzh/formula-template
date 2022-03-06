const Spritesmith = require('spritesmith')
const { readFileSync, writeFileSync, existsSync, rmdirSync, mkdirSync, rm, rmSync } = require('fs')
const config = require('./config')
const { joinNormal } = require('./utils/path')
const { resolve, join } = require('path')
const { readFiles } = require('./utils/file')

const IMAGES_PATH = resolve(__dirname, 'images')
const DIST_PATH = resolve(__dirname, 'dist')
const imageMap = {}

function fillConfig() {
  const doIte = (list, parentPath = '') => {
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
            __path: joinNormal(path, file.name)
          }
          o.image = image
          imageMap[image.__path] = image
        }
      })
      if (exp) {
        o.elements = Object.keys(exp).reduce((list, baseName) => {
          const image = {
            __path: joinNormal(path, `${baseName}.png`)
          }
          if (!existsSync(join(IMAGES_PATH, image.__path))) return list
          imageMap[image.__path] = image
          list.push({
            image,
            exp: exp[baseName]
          })
          return list
        }, [])
      }
      doIte(o.children, path)
    })
  }
  doIte(config.groups)
}

fillConfig()

function createDist(image) {
  // if (existsSync(DIST_PATH)) {
  //   rmSync(DIST_PATH, { recursive: true })
  // }
  // mkdirSync(DIST_PATH)

  if (!existsSync(DIST_PATH)) {
    mkdirSync(DIST_PATH)  
  }
  writeFileSync(join(DIST_PATH, 'config.json'), JSON.stringify(config, null, 2))
  writeFileSync(join(DIST_PATH, 'formula.png'), image)
}

Spritesmith.run({
  src: Object.keys(imageMap).map(path => joinNormal('./images', path)),
  padding: 10
}, (err, result) => {
  if (err) return console.error(err)
  const pathRE = new RegExp(/^.*?images\/(.*)$/)
  Object.keys(result.coordinates).forEach(filePath => {
    const res = pathRE.exec(filePath)
    if (res) {
      const path = res[1]
      imageMap[path].position = result.coordinates[filePath]
    }
  })
  createDist(result.image)
})
