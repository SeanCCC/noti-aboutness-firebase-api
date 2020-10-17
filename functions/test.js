// const { setDB } = require('./src/utils')
// const { sendResearchStartMail } = require('./src/mail')
const { researchStarter } = require('./src/triggers/daily')
// const _appTable = require('./appTable')
// const appTable = _appTable.reduce((acu, cur) => {
//   const idx = cur.packageName.split('.').join('_')
//   acu[idx] = cur
//   return acu
// }, {})
researchStarter()
