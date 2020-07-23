const functions = require('firebase-functions')
const cors = require('cors')
const express = require('express')
const siteRoutes = require('./src/siteRoutes')
const panelRoutes = require('./src/panelRoutes')
const appRoutes = require('./src/appRoutes')
const { countNotifications, dailyRecordFunction } = require('./src/triggers')

// site apis
const siteApp = express()
siteApp.use(cors({ origin: true }))
siteApp.use(express.json())
siteApp.use(express.urlencoded({ extended: false }))
siteApp.use('/apis', siteRoutes)

const site = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`
  }
  return siteApp(request, response)
})

// panel apis
const panelApp = express()
panelApp.use(cors({ origin: true }))
panelApp.use(express.json())
panelApp.use(express.urlencoded({ extended: false }))
panelApp.use('/apis', panelRoutes)

const panel = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`
  }
  return panelApp(request, response)
})

// app apis
const appApp = express()
appApp.use(cors({ origin: true }))
appApp.use(express.json())
appApp.use(express.urlencoded({ extended: false }))
appApp.use('/', appRoutes)

const app = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`
  }
  return appApp(request, response)
})

// rtdb triggers
const onNotificationAdded = functions.database
  .ref('/notification/{userId}')
  .onUpdate(countNotifications)

// cronjob
const dailyRecord = functions.pubsub.schedule('30 8 * * *') // running at every 8 am
  .timeZone('Asia/Taipei')
  .onRun(dailyRecordFunction)

module.exports = {
  site,
  app,
  panel,
  onNotificationAdded,
  dailyRecord
}
