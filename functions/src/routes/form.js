const express = require('express')
const { appendToCollection } = require('../utils')
const router = express.Router()

router.get('/', (req, res) => {
  console.log(123)
  res.json({ test: 'test' })
})

router.post('/', async (req, res) => {
  const { test } = req.body
  const timestamp = new Date()
  await appendToCollection('tesst', { test, timestamp })
  res.json({ a: '123' })
})

module.exports = router
