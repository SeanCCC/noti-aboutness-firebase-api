const _ = require('lodash')
const moment = require('moment-timezone')
const { fetchDB, updateDB, findDB } = require('../utils')
const status = require('../status')
const { sendResearchEndNotice } = require('../mail')

const setResearchDone = async (uid, compensation) => {
  const now = moment().tz('Asia/Taipei').format()
  await updateDB(`participant/${uid}`, {
    compensation,
    status: status.RESEARCH_DONE,
    lastStatusChanged: now,
    researchEndDate: moment().startOf('day').subtract(1, 'days').tz('Asia/Taipei').format('YYYY-MM-DD')
  })
  await sendResearchEndNotice(uid)
}

const dailyRecordFunction = async () => {
  const yesterday = moment().startOf('day').subtract(1, 'days').tz('Asia/Taipei').format()
  const now = moment().tz('Asia/Taipei')
  const uploadRecord = await fetchDB('/uploadRecord')
  const result = _.mapValues(uploadRecord, (p) => {
    if (!p.notiDistHourly || !p.active) return p
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
    const totalNotiCount = notiDistDaily.reduce((acc, { amount }) => acc + amount, 0)
    const totalEsmCount = !p.esmDistDaily ? {} : p.esmDistDaily
      .filter(d => {
        const date = moment(d.date, 'YYYY-MM-DD').tz('Asia/Taipei')
        return !date.isAfter(yesterday)
      })
      .reduce((acc, { amount }) => acc + amount, 0)
    return { ...p, notiDistDaily, totalNotiCount, totalEsmCount }
  })
  const researchDoneList = _.chain(result)
    .mapValues((r, uid) => {
      return { ...r, uid }
    })
    .filter(r => {
      if (!r.active) return false
      const then = moment(r.researchStartDate)
      const ms = now.diff(then)
      const days = moment.duration(ms).asDays()
      return days >= 14 // && r.totalEsmCount >= 42
    })
    .map((r) => {
      const compensation = 1550 + Math.max(0, r.totalEsmCount - 70) * 20
      return setResearchDone(r.uid, compensation)
    })
    .value()
  return Promise.all([updateDB('/uploadRecord', result), ...researchDoneList])
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
