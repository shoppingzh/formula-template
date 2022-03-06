const yaml = require('js-yaml')
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')

const doc = yaml.load(readFileSync(resolve(__dirname, 'groups.yml')))

function renderGroups() {
  const groups = []
  const doRender = (list, children) => {
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
        doRender(o[key], group.children)
      }
    })
  }

  doRender(doc, groups)

  return groups
}

module.exports = renderGroups()
