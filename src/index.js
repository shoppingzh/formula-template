const { groups, pathImageMap: groupsPathImageMap } = require('./config/groups')
const symbols = require('./config/symbols')
const { writeFileSync, rmSync, existsSync, mkdirSync } = require('fs')
const { resolve, join } = require('path')
const { rmdirFiles, readFiles } = require('./utils/file')
const Spritesmith = require('spritesmith')
const { createFormulaImage } = require('./utils/common')

const DIST_PATH = resolve(__dirname, '../dist')
const TEMP_PATH = resolve(__dirname, DIST_PATH, '.tmp')
let image = null

async function init() {
  if (existsSync(DIST_PATH)) {
    rmdirFiles(DIST_PATH)
  } else {
    mkdirSync(DIST_PATH)
  }
  mkdirSync(TEMP_PATH)

  // 符号
  const symbolsPathElementMap = {}
  for (const symbol of symbols) {
    const elements = symbol.elements || []
    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i]
      const filepath = join(TEMP_PATH, `${i + 1}.png`)
      symbolsPathElementMap[filepath] = el
      await createFormulaImage(el.exp, 40, 40, filepath)
    }
  }

  await Promise.all([new Promise(async(resolve, reject) => {
    const files = readFiles(TEMP_PATH)
    Spritesmith.run({
      src: files.map(f => `${join(TEMP_PATH, f.name)}`)
    }, (err, result) => {
      if (err) return reject(err)
      writeFileSync(join(DIST_PATH, 'symbols.png'), result.image)
  
      Object.keys(result.coordinates).forEach(path => {
        symbolsPathElementMap[path].image = {
          position: result.coordinates[path]
        }
      })
  
      rmSync(TEMP_PATH, { recursive: true, force: true })

      resolve()
    })
  }), new Promise(async(resolve, reject) => {
    Spritesmith.run({
      src: Object.keys(groupsPathImageMap)
    }, (err, result) => {
      if (err) return reject(err)
      writeFileSync(join(DIST_PATH, 'groups.png'), result.image)

      Object.keys(result.coordinates).forEach(path => {
        groupsPathImageMap[path].position = result.coordinates[path]
      })

      resolve()
    })
  })])

  writeFileSync(join(DIST_PATH, 'config.json'), JSON.stringify({
    symbols,
    groups
  }, null, 4))
  console.log('done')
}

init()