const functions = require('firebase-functions')
const cors = require('cors')
const express = require('express')
const siteRoutes = require('./src/siteRoutes')
const panelRoutes = require('./src/panelRoutes')
const appRoutes = require('./src/appRoutes')
const { countNotifications, dailyRecordFunction, countESM, researchStarter } = require('./src/triggers')

// site apis
const siteApp = express()
siteApp.disable('etag')
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
panelApp.disable('etag')
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
appApp.disable('etag')
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
  .ref('/notification/{uid}/{nid}/time')
  .onCreate(countNotifications)

const onQuestionnaireAdded = functions.database
  .ref('/questionnaire/{uid}/{qid}/longTime')
  .onCreate(countESM)

// cronjob
const dailyRecord = functions.pubsub.schedule('0 8 * * *') // running at every 8 am
  .timeZone('Asia/Taipei')
  .onRun(dailyRecordFunction)

const startResearch = functions.pubsub.schedule('0 0 * * *') // running at every 8 am
  .timeZone('Asia/Taipei')
  .onRun(researchStarter)

module.exports = {
  site,
  app,
  panel,
  onNotificationAdded,
  onQuestionnaireAdded,
  dailyRecord,
  startResearch
}
