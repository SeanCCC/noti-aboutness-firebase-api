const functions = require('firebase-functions');
const cors = require("cors")
const express = require("express")
const bodyParser = require('body-parser');
const apiRoutes = require('./src/routes')

// recruit apis
const recruitApp = express()
recruitApp.use(cors({ origin: true }))
recruitApp.use(express.json());
recruitApp.use(express.urlencoded({ extended: false }));
recruitApp.use(bodyParser.json());
recruitApp.use(bodyParser.urlencoded({ extended: true }));

recruitApp.use('/apis/recruit', apiRoutes);

const recruit = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`
  }
  return recruitApp(request, response)
})

// panel apis
const panelApp = express()
panelApp.use(cors({ origin: true }))
panelApp.use(express.json());
panelApp.use(express.urlencoded({ extended: false }));
panelApp.use(bodyParser.json());
panelApp.use(bodyParser.urlencoded({ extended: true }));

const panel = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`
  }
  return panelApp(request, response)
})

// app apis
const notiApp = express()
notiApp.use(cors({ origin: true }))
notiApp.use(express.json());
notiApp.use(express.urlencoded({ extended: false }));
notiApp.use(bodyParser.json());
notiApp.use(bodyParser.urlencoded({ extended: true }));

const noti = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`
  }
  return notiApp(request, response)
})

module.exports = {
  recruit,
  noti,
  panel
}
