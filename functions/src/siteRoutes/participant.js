const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const {
  fetchParticipantDetailById,
  fetchCandidateDetailById,
  updateDB,
  setDB,
  moveDB,
  busboyMiddleWare,
  uploadFile,
  moveStauts
} = require('../utils')
const validators = require('./validators')
const status = require('../status')
const { sendCompensationMail } = require('../mail')

router.get('/checkid', async (req, res) => {
  try {
    const payload = req.query
    const { id } = payload
    const result = await fetchParticipantDetailById(id)
    if (result !== null) {
      res.json({ status: result.status })
    } else {
      const candi = await fetchCandidateDetailById(id)
      if (candi === null) res.status(400).send('not found')
      else {
        await moveDB(`candidate/${id}`, `participant/${id}`, {
          status: status.INIT,
          lastStatusChanged: moment().tz('Asia/Taipei').format()
        })
        res.json({ status: status.INIT })
      }
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/video', validators.video, async (req, res) => {
  try {
    const payload = req.body
    const { id } = payload
    await moveStauts(id, status.VIDEO_DONE)
    res.json({ status: status.VIDEO_DONE })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/bigfive', validators.bigfive, async (req, res) => {
  try {
    const payload = req.body
    const { id, result } = payload
    const setBigfiveAsync = setDB(`bigfive/${id}`, result)
    const moveStatusAsync = moveStauts(id, status.BIG_FIVE_DONE)
    await Promise.all([moveStatusAsync, setBigfiveAsync])
    res.json({ status: status.BIG_FIVE_DONE })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/sendconsent', validators.sendConsent, async (req, res) => {
  try {
    const payload = req.body
    const { id, mailMethod } = payload
    await updateDB(`participant/${id}`, {
      mailMethod,
      consentSentTime: moment().tz('Asia/Taipei').format(),
      status: status.CONSENT_SENT,
      lastStatusChanged: moment().tz('Asia/Taipei').format()
    })
    res.json({ status: status.CONSENT_SENT })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/receipt', validators.receipt, async (req, res) => {
  try {
    const payload = req.body
    const { id, mailMethod } = payload
    await updateDB(`participant/${id}`, {
      receiptMailMethod: mailMethod,
      receiptMailTime: moment().tz('Asia/Taipei').format(),
      status: status.SET_PAY_METHOD,
      lastStatusChanged: moment().tz('Asia/Taipei').format()
    })
    res.json({ status: status.SET_PAY_METHOD })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/compensation', busboyMiddleWare, validators.compensation, async (req, res) => {
  try {
    const payload = req.body
    const { id, payMethod } = payload
    let imgPath = null
    let payDetail = {}
    if (payMethod === 'bankTransfer') {
      const { bankAccount, bankCode } = payload
      imgPath = await uploadFile(req, 'passbook', id)
      payDetail = { payMethod, imgPath, bankAccount, bankCode }
    } else if (payMethod === 'jko') {
      const { jkoAccount } = payload
      payDetail = { payMethod, jkoAccount }
    } else if (payMethod === 'linePay') {
      const { linePayAccount } = payload
      payDetail = { payMethod, linePayAccount }
    }
    await updateDB(`participant/${id}`, {
      payDetail,
      status: status.PAYMENT_REQUIRED,
      lastStatusChanged: moment().tz('Asia/Taipei').format()
    })
    res.json({ status: status.PAYMENT_REQUIRED })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/interview', validators.interviewDone, async (req, res) => {
  try {
    const payload = req.body
    const { id, rsvp } = payload
    const nextStatus = rsvp ? status.INTERVIEW_ACCEPTED : status.SET_RECEIPT_MAIL_METHOD
    await updateDB(`participant/${id}`, {
      rsvp,
      status: nextStatus,
      lastStatusChanged: moment().tz('Asia/Taipei').format()
    })
    if (!rsvp) await sendCompensationMail(id)
    res.json({ status: nextStatus })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})
module.exports = router
