const _ = require('lodash')
const moment = require('moment-timezone')
const { db, fetchDB } = require('../utils')

const countNotifications = (snapshot, context) => {
  const time = snapshot.val()
  const path = context.params
  const { uid } = path
  const d = moment.tz(time, 'Asia/Taipei')
  const recordRef = db.ref(`uploadRecord/${uid}/notiDistHourly`)
  return recordRef.transaction(function (currentValue) {
    const notiDistHourly = currentValue || []
    const hour = parseFloat(d.format('HH'))
    const date = d.format('YYYY-MM-DD')
    const idx = notiDistHourly.findIndex(d => d.date === date && d.hour === hour)
    if (idx === -1) notiDistHourly[notiDistHourly.length] = { date, hour, amount: 1 }
    else notiDistHourly[idx].amount = notiDistHourly[idx].amount + 1
    return notiDistHourly
  })
}

let appTableCache

const getAppTable = async () => {
  if (appTableCache === undefined) {
    appTableCache = await fetchDB('appTable')
  }
  return appTableCache
}

const getNotificaiton = (uid, nid) => fetchDB(`notification/${uid}/${nid}`)

const addESMCount = (date, uid) => db
  .ref(`uploadRecord/${uid}/esmDistDaily`)
  .transaction(function (currentValue) {
    const esmDistDaily = currentValue || []
    const idx = esmDistDaily.findIndex(d => d.date === date)
    if (idx === -1) esmDistDaily[esmDistDaily.length] = { date, amount: 1 }
    else esmDistDaily[idx].amount = esmDistDaily[idx].amount + 1
    const result = _.sortBy(esmDistDaily, (r) => { return new Date(r.date) })
    return result
  })

const addCatDistPersonal = async (uid, notification, appTable) => {
  const { mNotificaitonPackageName } = notification
  const packageName = mNotificaitonPackageName.split('.').join('_')
  const category = !appTable[packageName] ? 'others' : appTable[packageName].category
  return db.ref(`uploadRecord/${uid}/esmCatDist/${category}`)
    .transaction(function (currentValue) {
      return !currentValue ? 1 : currentValue + 1
    })
}

const addCatDistGeneral = async (notification, appTable) => {
  const { mNotificaitonPackageName } = notification
  const packageName = mNotificaitonPackageName.split('.').join('_')
  const category = !appTable[packageName] ? 'others' : appTable[packageName].category
  return db.ref(`esmCatDist/${category}`)
    .transaction(function (currentValue) {
      return !currentValue ? 1 : currentValue + 1
    })
}

const countESM = async (snapshot, context) => {
  const esm = snapshot.val()
  const { drmtime, notificationId } = esm
  if (!drmtime) return null
  const path = context.params
  const { uid, date } = path
  const [notification, appTable] = await Promise.all(
    [getNotificaiton(uid, notificationId), getAppTable()]
  )
  return Promise.all([
    addESMCount(date, uid),
    addCatDistPersonal(uid, notification, appTable),
    addCatDistGeneral(notification, appTable)]
  )
}

module.exports = { countNotifications, countESM }
