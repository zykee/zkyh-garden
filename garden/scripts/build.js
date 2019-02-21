const fs = require('fs-extra')
const path = require('path')

const distDir = path.join(__dirname, '../dist')

const actions = {
  clear() {
    fs.emptyDirSync(distDir)
  }
}

let action = process.argv[2]
if (actions[action]) {
  actions[action]()
}