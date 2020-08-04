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
  sendPayCompleteMail
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

// router.post('/interview/invite', async (req, res) => {
//   try {
//     const payload = req.body
//     const { uid } = payload
//     await sendResearchRemind(uid)
//     await updateDB(`participant/${uid}`, {
//       status: status.INTERVIEW_INVITED,
//       interviewInviteTime: moment().tz('Asia/Taipei').format(),
//       lastStatusChanged: moment().tz('Asia/Taipei').format()
//     })
//     res.send('success')
//   } catch (err) {
//     console.error(err)
//     res.status(500).send('error')
//   }
// })

router.post('/payment/ask', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await askPaymentMail(uid)
    await updateDB(`participant/${uid}`, {
      status: status.SET_RECEIPT_MAIL_METHOD,
      askPaymentTime: moment().tz('Asia/Taipei').format(),
      lastStatusChanged: moment().tz('Asia/Taipei').format()
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
      status: status.PAYMENT_DONE,
      payDate,
      lastStatusChanged: moment().tz('Asia/Taipei').format()
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
