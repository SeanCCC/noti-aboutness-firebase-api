const express = require('express')
const participantRoute = require('./recruit')
const router = express.Router()

router.use('/recruit', participantRoute)
module.exports = router
