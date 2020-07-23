const _ = require('lodash')
const { fetchDB, updateDB } = require('../utils')

const dailyRecordFunction = async () => {
  const uploadRecord = await fetchDB('/uploadRecord')
  const result = _.mapValues(uploadRecord, (p) => {
    if (!p.notiDistHourly) return p
    const notiDistDaily = _.chain(p.notiDistHourly)
      .groupBy('date')
      .reduce((acu, value, key) => {
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
