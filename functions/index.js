const functions = require('firebase-functions')
const cors = require('cors')
const express = require('express')
const cookieParser = require('cookie-parser')
const siteRoutes = require('./src/siteRoutes')
const panelRoutes = require('./src/panelRoutes')
const appRoutes = require('./src/appRoutes')
const {
  countNotifications,
  dailyRecordFunction,
  countESM,
  researchStarter,
  researchReminder,
  interviewReminder
} = require('./src/triggers')

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
panelApp.use(cookieParser())
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
  .ref('/questionnaire/{uid}/{date}/{qid}')
  .onUpdate(countESM)

// cronjob
const dailyRecord = functions.pubsub.schedule('0 5 * * *') // running at every 5 am
  .timeZone('Asia/Taipei')
  .onRun(dailyRecordFunction)

const startResearch = functions.pubsub.schedule('0 0 * * *') // running at every 0 am
  .timeZone('Asia/Taipei')
  .onRun(researchStarter)

const researchRemind = functions.pubsub.schedule('0 9 * * *') // running at every 9 am
  .timeZone('Asia/Taipei')
  .onRun(researchReminder)

const interviewRemind = functions.pubsub.schedule('30 12 * * *') // running at every 12:30
  .timeZone('Asia/Taipei')
  .onRun(interviewReminder)

module.exports = {
  site,
  app,
  panel,
  onNotificationAdded,
  onQuestionnaireAdded,
  dailyRecord,
  startResearch,
  researchRemind,
  interviewRemind
}
