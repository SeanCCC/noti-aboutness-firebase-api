const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const { moveStauts, updateDB } = require('../utils')
const {
  sendPreResearchRemind,
  sendConsentAcceptMail,
  sendResearchRemind,
  sendConsentRemind
} = require('../mail')
const status = require('../status')

router.post('/consent/accept', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await sendConsentAcceptMail(uid)
    await moveStauts(uid, status.CONSENT_VALID)
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/consent/remind', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await sendConsentRemind(uid)
    await updateDB(`participant/${uid}`, { consentReminderSent: moment().tz('Asia/Taipei').format() })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/preResearchRemind', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await sendPreResearchRemind(uid)
    await updateDB(`participant/${uid}`, { preResearchReminderSent: moment().tz('Asia/Taipei').format() })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/researchRemind', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await sendResearchRemind(uid)
    await updateDB(`participant/${uid}`, { researchReminderSent: moment().tz('Asia/Taipei').format() })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
