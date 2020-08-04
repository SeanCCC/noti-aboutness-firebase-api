const express = require('express')
const router = express.Router()
const { updateDB, moveDB } = require('../utils')
const moment = require('moment-timezone')
const { sendAcceptMail, sendDeclineMail } = require('../mail')

router.post('/accept', async (req, res) => {
  try {
    const { uid } = req.body
    if (!uid) return res.status(400).send('missing uid')
    await sendAcceptMail(uid)
    await updateDB(`participant/${uid}`, { lastInvitationSent: moment().tz('Asia/Taipei').format() })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/decline', async (req, res) => {
  try {
    const { uid } = req.body
    if (!uid) return res.status(400).send('missing uid')
    const mailAsync = sendDeclineMail(uid)
    const declineAsync = await moveDB(`candidate/${uid}`, `declined/${uid}`)
    await mailAsync
    await declineAsync
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
