const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const { moveStauts, updateDB } = require('../utils')
const {
  sendPreResearchRemind,
  sendConsentAcceptMail,
  sendResearchRemind,
  sendConsentRemind,
  askPaymentMail,
  sendReceiptRemind,
  sendPayMethodRemind,
  sendPayCompleteMail,
  sendInterviewInvitation,
  sendInterviewInviteReminder,
  sendInterviewSchedule,
  sendInterviewCancel
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

router.post('/receipt/remind', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await sendReceiptRemind(uid)
    await updateDB(`participant/${uid}`, { receiptReminderSent: moment().tz('Asia/Taipei').format() })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/paymethod/remind', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await sendPayMethodRemind(uid)
    await updateDB(`participant/${uid}`, { payMethodReminderSent: moment().tz('Asia/Taipei').format() })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/payment/ask', async (req, res) => {
  try {
    const payload = req.body
    const now = moment().tz('Asia/Taipei').format()
    const { uid } = payload
    await askPaymentMail(uid)
    await updateDB(`participant/${uid}`, {
      status: status.SET_RECEIPT_MAIL_METHOD,
      askPaymentTime: now,
      lastStatusChanged: now
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/payment/done', async (req, res) => {
  try {
    const payload = req.body
    const { uid, payDate } = payload
    await sendPayCompleteMail(uid, payDate)
    await updateDB(`participant/${uid}`, {
      status: status.ALL_DONE,
      payDate,
      lastStatusChanged: moment().tz('Asia/Taipei').format()
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/interview/invite', async (req, res) => {
  try {
    const now = moment().tz('Asia/Taipei').format()
    const payload = req.body
    const { uid } = payload
    await sendInterviewInvitation(uid)
    await updateDB(`participant/${uid}`, {
      status: status.INTERVIEW_INVITED,
      interviewInviteTime: now,
      lastStatusChanged: now
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/interview/remind', async (req, res) => {
  try {
    const now = moment().tz('Asia/Taipei').format()
    const payload = req.body
    const { uid } = payload
    await sendInterviewInviteReminder(uid)
    await updateDB(`participant/${uid}`, {
      interviewInviteRemindTime: now
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/interview/schedule', async (req, res) => {
  try {
    const now = moment().tz('Asia/Taipei').format()
    const payload = req.body
    const { uid, interviewScheduleTime } = payload
    await sendInterviewSchedule(uid, interviewScheduleTime)
    await updateDB(`participant/${uid}`, {
      status: status.INTERVIEW_SCHEDULED,
      interviewScheduleTime,
      lastStatusChanged: now
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/interview/finish', async (req, res) => {
  try {
    const now = moment().tz('Asia/Taipei').format()
    const payload = req.body
    const { uid } = payload
    await updateDB(`participant/${uid}`, {
      status: status.ALL_DONE,
      lastStatusChanged: now
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/interview/cancel', async (req, res) => {
  try {
    const now = moment().tz('Asia/Taipei').format()
    const payload = req.body
    const { uid } = payload
    await sendInterviewCancel(uid)
    await updateDB(`participant/${uid}`, {
      status: status.SET_RECEIPT_MAIL_METHOD,
      askPaymentTime: now,
      lastStatusChanged: now
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})
module.exports = router
