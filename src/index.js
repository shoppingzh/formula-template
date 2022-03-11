const { groups, pathImageMap: groupsPathImageMap } = require('./config/groups')
const symbols = require('./config/symbols')
const { writeFileSync, existsSync, mkdirSync } = require('fs')
const { resolve, join } = require('path')
const { rmdirFiles } = require('./utils/file')
const { createFormulaImage, cloneUseful } = require('./utils/common')
const Vinyl = require('vinyl')
const { createSprite } = require('./utils/image')

const DIST_PATH = resolve(__dirname, '../dist')

async function init() {
  if (existsSync(DIST_PATH)) {
    rmdirFiles(DIST_PATH)
  } else {
    mkdirSync(DIST_PATH)
  }

  // 符号
  const symbolElementMap = {}
  for (const symbol of symbols) {
    const elements = symbol.elements || []
    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i]
      el.__data = await createFormulaImage(el.exp, 40, 40)
      el.__imageVitualName = `${el.exp}.png`
      symbolElementMap[el.__imageVitualName] = el
    }
  }

  await Promise.all([new Promise(async(resolve, reject) => {
    try {
      const result = await createSprite(Object.keys(symbolElementMap).map(o => (new Vinyl({
        path: symbolElementMap[o].__imageVitualName,
        contents: symbolElementMap[o].__data
      }))))

      writeFileSync(join(DIST_PATH, 'symbols.png'), result.image)
      Object.keys(result.coordinates).forEach(path => {
        symbolElementMap[path].image = {
          position: result.coordinates[path]
        }
      })
  
      resolve()
    } catch (err) {
      reject(err)
    }
  }), new Promise(async(resolve, reject) => {
    try {
      const result = await createSprite(Object.keys(groupsPathImageMap))

      writeFileSync(join(DIST_PATH, 'groups.png'), result.image)
      Object.keys(result.coordinates).forEach(path => {
        groupsPathImageMap[path].position = result.coordinates[path]
      })

      resolve()
    } catch (err) {
      reject(err)
    }
  })])

  const conf = cloneUseful({
    symbols,
    groups
  })

  writeFileSync(join(DIST_PATH, 'config.json'), JSON.stringify(conf, null, 2))
  console.log('done')
}

init()
