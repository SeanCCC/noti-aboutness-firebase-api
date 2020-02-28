const express = require('express')
const router = express.Router()
const { pushDB, findDB } = require('../utils')
const { sendEmailCheck } = require('../mail')

router.get('/mailcheck', async (req, res) => {
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

router.post('/', async (req, res) => {
  try {
    const payload = req.body
    const { email, name, gender } = payload
    // check email repeated
    const candidateAsync = findDB('candidate', 'email', email)
    const participantAsync = findDB('participant', 'email', email)
    const candidateRes = await candidateAsync
    const participantRes = await participantAsync
    console.log({ candidateRes, participantRes })
    if (candidateRes !== null || participantRes !== null) return res.status(400).send('repeated')
    const timestamp = new Date()
    const newRef = await pushDB('submitted', { ...payload, timestamp: timestamp.toString() })
    const id = newRef.key
    await sendEmailCheck(email, name, gender, id)
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
