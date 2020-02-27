const express = require('express')
const formRoutes = require('./form')
const router = express.Router()

router.use('/form', formRoutes)

module.exports = router
