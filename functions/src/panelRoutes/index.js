const express = require('express')
const participantRoute = require('./participant')
const router = express.Router()

router.use('/participant', participantRoute)
module.exports = router
