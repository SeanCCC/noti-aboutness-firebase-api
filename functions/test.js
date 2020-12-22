const { setDB } = require('./src/utils')
// const { sendResearchStartMail } = require('./src/mail')
// const { researchStarter } = require('./src/triggers/daily')
const _appTable = require('./appTable')
const appTable = _appTable.reduce((acu, cur) => {
  if (cur.category === undefined || cur.appName === undefined) return acu
  const idx = cur.packageName.split('.').join('_')
  acu[idx] = cur
  return acu
}, {})
console.log({ appTable })

setDB('/appTable', appTable)
// researchStarter()

// setDB('/onlineRecord', null)

// setDB('/questionnaire', null)

// setDB('/sendESMLog', null)
