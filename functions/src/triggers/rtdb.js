const _ = require('lodash')
const moment = require('moment-timezone')
const { db } = require('../utils')

const countNotifications = (change, context) => {
  const data = change.after.val()
  const path = context.params
  const { uid } = path
  const totalCount = change.after.numChildren()
  const previousCount = change.before.numChildren()
  const addedTimes = _.chain(data)
    .map(d => d)
    .slice(previousCount, totalCount)
    .map(d => moment.tz(d.time, 'Asia/Taipei'))
    .value()
  const recordRef = db.ref(`uploadRecord/${uid}/notiDistHourly`)
  return recordRef.transaction(function (currentValue) {
    const notiDistHourly = currentValue || []
    addedTimes.forEach(t => {
      const hour = parseFloat(t.format('HH'))
      const date = t.format('YYYY-MM-DD')
      const idx = notiDistHourly.findIndex(d => d.date === date && d.hour === hour)
      if (idx === -1) notiDistHourly[notiDistHourly.length] = { date, hour, amount: 1 }
      else notiDistHourly[idx].amount = notiDistHourly[idx].amount + 1
    })
    return notiDistHourly
  })
}

const countESM = (snapshot, context) => {
  const time = snapshot.val()
  const path = context.params
  const { uid } = path
  const date = moment.tz(time, 'Asia/Taipei').format('YYYY-MM-DD')
  const recordRef = db.ref(`uploadRecord/${uid}/esmDistDaily`)
  return recordRef.transaction(function (currentValue) {
    const esmDistDaily = currentValue || []
    const idx = esmDistDaily.findIndex(d => d.date === date)
    if (idx === -1) esmDistDaily[esmDistDaily.length] = { date, amount: 1 }
    else esmDistDaily[idx].amount = esmDistDaily[idx].amount + 1
    const result = _.sortBy(esmDistDaily, (r) => { return new Date(r.date) })
    return result
  })
}

module.exports = { countNotifications, countESM }
