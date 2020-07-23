const _ = require('lodash')
const moment = require('moment-timezone')
const { fetchDB, updateDB } = require('../utils')

const dailyRecordFunction = async () => {
  const yesterday = moment().subtract(1, 'days').tz('Asia/Taipei').format('YYYY-MM-DDT00:00:00+08:00')
  const uploadRecord = await fetchDB('/uploadRecord')
  const result = _.mapValues(uploadRecord, (p) => {
    if (!p.notiDistHourly) return p
    const notiDistDaily = _.chain(p.notiDistHourly)
      .groupBy('date')
      .reduce((acu, value, key) => {
        const date = moment(key, 'YYYY-MM-DD').tz('Asia/Taipei')
        if (date.isAfter(yesterday)) return acu
        const amount = value.reduce((acc, { amount }) => acc + amount, 0)
        return [...acu, { date: key, amount }]
      }, [])
      .sortBy((r) => { return new Date(r.date) })
      .value()
    return { ...p, notiDistDaily }
  })
  await updateDB('/uploadRecord', result)
  return null
}

module.exports = {
  dailyRecordFunction
}
