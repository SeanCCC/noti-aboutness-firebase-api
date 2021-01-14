const _ = require('lodash')
const moment = require('moment-timezone')
const { fetchDB, updateDB, findDB } = require('../utils')
const status = require('../status')
const { sendResearchEndNotice, sendResearchStartMail, sendWeekReminder } = require('../mail')
const periodRequired = 14 // for pilot
const questionnaireEachDay = 3

const setResearchDone = async (uid, compensation) => {
  const now = moment().tz('Asia/Taipei').format()
  await updateDB(`participant/${uid}`, {
    compensation,
    status: status.RESEARCH_DONE,
    lastStatusChanged: now,
    researchEndDate: moment().startOf('day').subtract(1, 'days').tz('Asia/Taipei').format('YYYY-MM-DD')
  })
  await updateDB(`uploadRecord/${uid}`, {
    active: false
  })
  await sendResearchEndNotice(uid)
}

const dailyRecordFunction = async () => {
  const yesterday = moment().tz('Asia/Taipei').startOf('day').subtract(1, 'days').format()
  const uploadRecord = await fetchDB('/uploadRecord')
  console.log({ yesterday })
  const result = _.mapValues(uploadRecord, (p) => {
    if (!p.notiDistHourly || !p.active) return p
    const notiDistDaily = _.chain(p.notiDistHourly)
      .groupBy('date')
      .reduce((acu, value, key) => {
        const date = moment.tz(key, 'YYYY-MM-DD', 'Asia/Taipei')
        if (date.isAfter(yesterday)) return acu
        console.log({ notidate: date.format() })
        const amount = value.reduce((acc, { amount }) => acc + amount, 0)
        return [...acu, { date: key, amount }]
      }, [])
      .sortBy((r) => { return new Date(r.date) })
      .value()
    const totalNotiCount = notiDistDaily.reduce((acc, { amount }) => acc + amount, 0)
    const totalEsmCount = !p.esmDistDaily ? 0 : p.esmDistDaily
      .filter(d => {
        const date = moment.tz(d.date, 'YYYY-MM-DD', 'Asia/Taipei')
        if (!date.isAfter(yesterday)) console.log({ esmdate: date.format() })
        return !date.isAfter(yesterday)
      })
      .reduce((acc, { amount }) => acc + amount, 0)
    return { ...p, notiDistDaily, totalNotiCount, totalEsmCount }
  })
  await updateDB('/uploadRecord', result)
  const now = moment().tz('Asia/Taipei')
  const WeekRemindList = _.chain(result)
    .mapValues((r, uid) => {
      return { ...r, uid }
    })
    .filter(r => {
      if (!r.active) return false
      const then = moment.tz(r.researchStartDate, 'YYYY-MM-DD', 'Asia/Taipei')
      const ms = now.diff(then)
      const days = moment.duration(ms).asDays()
      return days >= 7 && days < 8
    })
    .map((r) => {
      return sendWeekReminder(r.uid, r.totalEsmCount)
    })
    .value()
  await Promise.all(WeekRemindList)
  const researchDoneList = _.chain(result)
    .mapValues((r, uid) => {
      return { ...r, uid }
    })
    .filter(r => {
      if (!r.active) return false
      const then = moment.tz(r.researchStartDate, 'YYYY-MM-DD', 'Asia/Taipei')
      const ms = now.diff(then)
      const days = moment.duration(ms).asDays()
      return days >= periodRequired && r.totalEsmCount >= periodRequired * questionnaireEachDay
    })
    .map((r) => {
      const compensation = 1550 + Math.max(0, r.totalEsmCount - 5 * periodRequired) * 22
      return setResearchDone(r.uid, compensation)
    })
    .value()
  return Promise.all(researchDoneList)
}

const researchStarter = async () => {
  const today = moment().add(1, 'hours').tz('Asia/Taipei').format('YYYY-MM-DD')
  const participants = await findDB('participant', 'researchStartDate', today)
  const result = _.reduce(participants, (acu, p, uid) => {
    if (p.status !== status.APP_VALID) return acu
    const _acu = { ...acu }
    _acu[uid] = { ...p, status: status.RESEARCH_RUNNING }
    return _acu
  }, {})
  if (_.size(result) === 0) return null
  return updateDB('/participant', result)
}

const researchReminder = async () => {
  const today = moment().tz('Asia/Taipei').format('YYYY-MM-DD')
  const participants = await findDB('participant', 'researchStartDate', today)
  const mailAsyncList = _.reduce(participants, (acu, p, uid) => {
    if (p.status !== status.RESEARCH_RUNNING) return acu
    const _acu = [...acu, sendResearchStartMail(uid)]
    return _acu
  }, [])
  if (_.size(mailAsyncList) === 0) return null
  return Promise.all(mailAsyncList)
}

module.exports = {
  dailyRecordFunction,
  researchStarter,
  researchReminder
}
