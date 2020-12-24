// const { setDB, fetchDB, scoreBigFive } = require('./src/utils')
// const { sendResearchStartMail } = require('./src/mail')
const { dailyRecordFunction } = require('./src/triggers/daily')
// const _appTable = require('./appTable')
// const appTable = _appTable.reduce((acu, cur) => {
//   if (cur.category === undefined || cur.appName === undefined) return acu
//   const idx = cur.packageName.split('.').join('_')
//   acu[idx] = cur
//   return acu
// }, {})
// console.log({ appTable })
// setDB('/appTable', appTable)

// const something = async () => {
//   const input = await fetchDB('/bigfive')
//   Object.keys(input).forEach((uid) => {
//     const bigFiveRaw = input[uid]
//     const score = scoreBigFive(bigFiveRaw)
//     console.log({ score })
//     setDB(`/participant/${uid}/bigfive`, score)
//   })
// }

// something()
dailyRecordFunction()
