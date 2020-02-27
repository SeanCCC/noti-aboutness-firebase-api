const express = require('express')
const { pushDB } = require('../utils')
const router = express.Router()

router.get('/', (req, res) => {
  console.log(123)
  res.json({ test: 'test' })
})

router.post('/', async (req, res) => {
  try {
    const payload = req.body
    const timestamp = new Date()
    console.log(timestamp)
    await pushDB('candidate', { ...payload, timestamp: timestamp.toString() })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
