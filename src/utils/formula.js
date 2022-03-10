const { init } = require('mathjax')

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


module.exports = {
  svg
}