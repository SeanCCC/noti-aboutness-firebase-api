const functions = require('firebase-functions')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const siteRoutes = require('./src/siteRoutes')
const panelRoutes = require('./src/panelRoutes')

// site apis
const siteApp = express()
siteApp.use(cors({ origin: true }))
siteApp.use(express.json())
siteApp.use(express.urlencoded({ extended: false }))
siteApp.use(bodyParser.json())
siteApp.use(bodyParser.urlencoded({ extended: true }))

siteApp.use('/apis/site', siteRoutes)

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
panelApp.use(bodyParser.json())
panelApp.use(bodyParser.urlencoded({ extended: true }))

panelApp.use('/apis/panel', panelRoutes)

const panel = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`
  }
  return panelApp(request, response)
})

// app apis
const notiApp = express()
notiApp.use(cors({ origin: true }))
notiApp.use(express.json())
notiApp.use(express.urlencoded({ extended: false }))
notiApp.use(bodyParser.json())
notiApp.use(bodyParser.urlencoded({ extended: true }))

const noti = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`
  }
  return notiApp(request, response)
})

module.exports = {
  site,
  noti,
  panel
}
