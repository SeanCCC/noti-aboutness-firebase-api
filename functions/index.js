const functions = require('firebase-functions').region('asia-east2');
const cors = require("cors")
const express = require("express")
const apiRoutes = require('./src/routes')

const app = express()
app.use(cors({ origin: true }))
app.use('/', apiRoutes);

const api = functions.https.onRequest((request, response) => {
    if (!request.path) {
      request.url = `/${request.url}`
    }
    return app(request, response)
  })

  module.exports = {
    api
  }
