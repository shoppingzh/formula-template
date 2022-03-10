const sharp = require('sharp')
const { svg } = require('./formula')
const { writeFileSync } = require('fs')

function createFormulaImage(exp, width, height, path) {
  return new Promise(async(resolve, reject) => {
    try {
      const text = await svg(exp)
      const buffer = await sharp({
        create: {
          width,
          height,
          channels: 3,
          background: { r: 255, g: 255, b: 255 }
        }
      }).composite([{
        input: Buffer.from(text),
        blend: 'dest-in'
      }])
      .png()
      .toBuffer()
      writeFileSync(path, buffer)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  createFormulaImage
}