const { setDB } = require('./src/utils')
const _appTable = require('./appTable')
const appTable = _appTable.reduce((acu, cur) => {
  const idx = cur.packageName.split('.').join('_')
  acu[idx] = cur
  return acu
}, {})
setDB('appTable', appTable)
