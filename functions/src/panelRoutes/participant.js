const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const { moveStauts, updateDB, fetchDB, moveDB, pushDB } = require('../utils')
const {
  sendPreResearchRemind,
  sendConsentAcceptMail,
  sendResearchRemind,
  sendConsentRemind,
  askPaymentMail,
  sendReceiptRemind,
  sendPayMethodRemind,
  sendPayCompleteMail,
  sendInterviewSchedule,
  sendConsentReversedMail,
  sendReceiptReversedMail,
  sendInterviewReschedule
} = require('../mail')
const status = require('../status')
const interviewStatus = require('../interviewStatus')

router.post('/consent/reversesent', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await updateDB(`participant/${uid}`, { status: status.CONSENT_CHOSEN, reverseNoticedTime: moment().tz('Asia/Taipei').format() })
    await sendConsentReversedMail(uid)
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

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

router.post('/consent/sendremind', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await sendConsentRemind(uid)
    await updateDB(`participant/${uid}`, { consentSendReminderSent: moment().tz('Asia/Taipei').format() })
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

router.post('/receipt/reversesent', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await updateDB(`participant/${uid}`, {
      status: status.RECEIPT_CHOSEN,
      receipt: {
        reverseNoticedTime: moment().tz('Asia/Taipei').format()
      }
    })
    await sendReceiptReversedMail(uid)
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
    const { uid, interview } = payload
    const p = await fetchDB(`participant/${uid}`)
    // 遠端支付的部份
    const compensation = interview ? (p.compensation + 300) : p.compensation
    const _interviewStatus = p.status === status.INTERVIEWEE ? interviewStatus.DONE : p.interviewStatus
    await updateDB(`participant/${uid}`, {
      compensation,
      status: status.SET_RECEIPT_MAIL_METHOD,
      askPaymentTime: now,
      lastStatusChanged: now,
      interviewStatus: _interviewStatus
    })
    await askPaymentMail(uid)
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
    await moveDB(`participant/${uid}`, `done/${uid}`, {
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
    const p = await fetchDB(`participant/${uid}`)
    if (p.status === status.RESEARCH_DONE) {
      await updateDB(`participant/${uid}`, {
        status: status.INTERVIEWEE,
        lastStatusChanged: now,
        interviewInviteTime: now,
        interviewStatus: interviewStatus.PENDING
      })
    } else { // RESEARCH_RUNNING
      await updateDB(`participant/${uid}`, {
        interviewInviteTime: now,
        interviewStatus: interviewStatus.PENDING
      })
    }
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/interview/declined', async (req, res) => {
  try {
    const now = moment().tz('Asia/Taipei').format()
    const payload = req.body
    const { uid } = payload
    const p = await fetchDB(`participant/${uid}`)
    if (p.status === status.RESEARCH_RUNNING) {
      await updateDB(`participant/${uid}`, {
        interviewStatus: interviewStatus.DECLINED
      })
    } else {
      await updateDB(`participant/${uid}`, {
        status: status.RESEARCH_DONE,
        lastStatusChanged: now,
        interviewStatus: interviewStatus.DECLINED
      })
    }
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/interview/schedule', async (req, res) => {
  try {
    const payload = req.body
    const { uid, interviewScheduleTime } = payload
    await sendInterviewSchedule(uid, interviewScheduleTime)
    await updateDB(`participant/${uid}`, {
      interviewStatus: interviewStatus.SCHEDULED,
      interviewScheduleTime
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/interview/reschedule', async (req, res) => {
  try {
    const payload = req.body
    const { uid, interviewScheduleTime } = payload
    await sendInterviewReschedule(uid, interviewScheduleTime)
    await updateDB(`participant/${uid}`, {
      interviewScheduleTime
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/interview/finish', async (req, res) => {
  try {
    const payDate = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')
    const now = moment().tz('Asia/Taipei').format()
    const payload = req.body
    const { uid } = payload
    const p = await fetchDB(`participant/${uid}`)
    if (p.status === status.RESEARCH_RUNNING) {
      await updateDB(`participant/${uid}`, {
        interviewStatus: interviewStatus.DONE
      })
    } else {
      await moveDB(`participant/${uid}`, `done/${uid}`, {
        interviewStatus: interviewStatus.DONE,
        status: status.ALL_DONE,
        lastStatusChanged: now,
        payDate,
        payMethod: 'inPerson',
        compensation: p.compensation + 300
      })
    }
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
    const p = await fetchDB(`participant/${uid}`)
    if (p.status === status.RESEARCH_RUNNING) {
      await updateDB(`participant/${uid}`, {
        interviewStatus: interviewStatus.CANCELED
      })
    } else {
      await updateDB(`participant/${uid}`, {
        status: status.RESEARCH_DONE,
        lastStatusChanged: now,
        interviewStatus: interviewStatus.CANCELED
      })
    }
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/research/start', async (req, res) => {
  try {
    const today = moment().tz('Asia/Taipei').format('YYYY-MM-DD')
    const payload = req.body
    const { uid } = payload
    await updateDB(`participant/${uid}`, {
      status: status.RESEARCH_RUNNING,
      researchStartDate: today
    })
    await updateDB(`uploadRecord/${uid}`, {
      researchStartDate: today
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/research/done', async (req, res) => {
  try {
    const today = moment().tz('Asia/Taipei').format('YYYY-MM-DD')
    const payload = req.body
    const { uid } = payload
    await updateDB(`participant/${uid}`, {
      compensation: 1550,
      status: status.RESEARCH_DONE,
      lastStatusChanged: today,
      researchEndDate: moment().startOf('day').subtract(1, 'days').tz('Asia/Taipei').format('YYYY-MM-DD')
    })
    await updateDB(`uploadRecord/${uid}`, {
      active: false
    })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/research/add', async (req, res) => {
  try {
    const payload = req.body
    const result = payload
    await pushDB('participant', result)
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
