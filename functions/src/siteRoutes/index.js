const express = require('express')
const formRoutes = require('./form')
const participantRoute = require('./participant')
const router = express.Router()

router.use('/form', formRoutes)
router.use('/participant', participantRoute)
module.exports = router
