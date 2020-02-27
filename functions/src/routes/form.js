const express = require('express')
const router = express.Router()
const { pushDB } = require('../utils')
const { sendEmailCheck } = require('../mail')

router.get('/', (req, res) => {
  console.log(123)
  res.json({ test: 'test' })
})

router.post('/', async (req, res) => {
  try {
    const payload = req.body
    const { email, name, gender } = payload
    const timestamp = new Date()
    const newRef = await pushDB('candidate', { ...payload, timestamp: timestamp.toString() })
    const id = newRef.key
    await sendEmailCheck(email, name, gender, id)
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
