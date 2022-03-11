const { cloneDeepWith, mergeWith, pick, pickBy, isPlainObject } = require('lodash')
const sharp = require('sharp')
const { svg } = require('./formula')

function createFormulaImage(exp, width, height) {
  return new Promise(async(resolve, reject) => {
    try {
      const text = await svg(exp)
      const buffer = await sharp({
        create: {
          width,
          height,
          channels: 3,
          background: { r: 0, g: 0, b: 0 }
        }
      }).composite([{
        input: Buffer.from(text),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer()
      resolve(buffer)
    } catch (err) {
      reject(err)
    }
  })
}

function cloneUseful(o) {
  return cloneDeepWith(o, (value, key, object, stack) => {
    if (isPlainObject(value)) {
      Object.keys(value).forEach(key => {
        if (/^__/.test(key)) {
          delete value[key]
        }
      })
    }
  })
}

module.exports = {
  createFormulaImage,
  cloneUseful
}