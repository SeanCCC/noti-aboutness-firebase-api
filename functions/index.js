const functions = require('firebase-functions');
const cors = require("cors")
const express = require("express")
const bodyParser = require('body-parser');
const apiRoutes = require('./src/routes')
const app = express()

app.use(cors({ origin: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/apis', apiRoutes);

const apis = functions.https.onRequest((request, response) => {
  if (!request.path) {
    request.url = `/${request.url}`
  }
  return app(request, response)
})

module.exports = {
  apis
}
