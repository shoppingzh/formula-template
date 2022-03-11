const Spritesmith = require('spritesmith')

function createSprite(sources) {
  return new Promise((resolve, reject) => {
    Spritesmith.run({
      src: sources,
      padding: 5
    }, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

module.exports = {
  createSprite
}
