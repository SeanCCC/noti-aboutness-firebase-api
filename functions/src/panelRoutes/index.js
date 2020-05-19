const express = require('express')
const recruitRoute = require('./recruit')
const participantRoute = require('./participant')
const router = express.Router()

router.use('/participant', participantRoute)
router.use('/recruit', recruitRoute)
module.exports = router
