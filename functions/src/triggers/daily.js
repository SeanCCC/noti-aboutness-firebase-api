const _ = require('lodash')
const moment = require('moment-timezone')
const { fetchDB, updateDB, findDB } = require('../utils')
const status = require('../status')

const dailyRecordFunction = async () => {
  const yesterday = moment().subtract(1, 'days').tz('Asia/Taipei').format('YYYY-MM-DDT00:00:00+08:00')
  const uploadRecord = await fetchDB('/uploadRecord')
  const result = _.mapValues(uploadRecord, (p, uid) => {
    if (!p.notiDistHourly) return p
    const notiDistDaily = _.chain(p.notiDistHourly)
      .groupBy('date')
      .reduce((acu, value, key) => {
        const date = moment(key, 'YYYY-MM-DDT00:00:00+08:00').tz('Asia/Taipei')
        console.log(uid)
        console.log(date.format('YYYY-MM-DDT00:00:00+08:00'), yesterday, date.isAfter(yesterday))
        if (date.isAfter(yesterday)) return acu
        const amount = value.reduce((acc, { amount }) => acc + amount, 0)
        return [...acu, { date: key, amount }]
      }, [])
      .sortBy((r) => { return new Date(r.date) })
      .value()
    const totalNotiCount = notiDistDaily.reduce((acc, { amount }) => acc + amount, 0)
    const totalEsmCount = !p.esmDistDaily ? {} : p.esmDistDaily
      .filter(d => {
        const date = moment(d.date, 'YYYY-MM-DD').tz('Asia/Taipei')
        return !date.isAfter(yesterday)
      })
      .reduce((acc, { amount }) => acc + amount, 0)
    return { ...p, notiDistDaily, totalNotiCount, totalEsmCount }
  })
  return updateDB('/uploadRecord', result)
}

const researchStarter = async () => {
  const today = moment().add(1, 'hours').tz('Asia/Taipei').format('YYYY-MM-DD')
  const participants = await findDB('participant', 'researchStartDate', today)
  const result = _.reduce(participants, (acu, p, uid) => {
    if (p.status === status.RESEARCH_RUNNING) return acu
    const _acu = { ...acu }
    _acu[uid] = { ...p, status: status.RESEARCH_RUNNING }
    return _acu
  }, {})
  if (_.size(result) === 0) return null
  return updateDB('/participant', result)
}

module.exports = {
  dailyRecordFunction,
  researchStarter
}
