const { init } = require('mathjax')
const sharp = require('sharp')
const { resolve } = require('path')
const { writeFileSync } = require('fs')

async function svg(exp) {
  return new Promise(async(resolve, reject) => {
    try {
      const MathJax = await init({
        loader: { load: ['input/tex', 'output/svg'] }
      })
      const el = MathJax.tex2svg(exp, { display: true })
      const svg = MathJax.startup.adaptor.innerHTML(el)
      resolve(svg)
    } catch (err) {
      reject(err)
    }
  })
}

async function create(exp, width, height) {
  try {
    const svgText = await svg('\\sqrt{2}')
    const png = sharp({
      create: {
        width: 150,
        height: 150,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0.8 }
      }
    })
      .resize(200, 200)
      .composite([{
        input: Buffer.from(svgText),
        blend: 'over'
      }])
      .png()
      .toBuffer()
      .then(b => {
        console.log(b)
        writeFileSync(resolve(__dirname, 'new.png'), b)
      })
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  create
}