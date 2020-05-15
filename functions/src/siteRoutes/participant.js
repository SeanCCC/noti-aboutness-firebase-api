const express = require('express')
const router = express.Router()
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
        await moveDB(`candidate/${id}`, `participant/${id}`, { status: status.INIT })
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

router.post('/done/bigfive', async (req, res) => {
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
    const moveStatusAsync = moveStauts(id, status.CONSENT_SENT)
    const setMailMethodAsync = updateDB(`participant/${id}`, { mailMethod })
    await Promise.all([moveStatusAsync, setMailMethodAsync])
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
    const moveStatusAsync = moveStauts(id, status.SET_PAY_METHOD)
    const setMailMAsync = updateDB(`participant/${id}`, { receiptMailMethod: mailMethod })
    await Promise.all([moveStatusAsync, setMailMAsync])
    res.json({ status: status.SET_PAY_METHOD })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/compensation', busboyMiddleWare, validators.compensation, async (req, res) => {
  try {
    const payload = req.body
    const { uid, payMethod } = payload
    const result = await fetchParticipantDetailById(uid)
    if (result === null || result.status !== status.SET_PAY_METHOD || result.payDetail !== undefined) {
      return res.status(400).send('unauth')
    }
    let imgPath = null
    let payDetail = {}
    if (payMethod === 'bankTransfer') {
      const { bankAccount, bankCode } = payload
      imgPath = await uploadFile(req, 'passbook', uid)
      payDetail = { payMethod, imgPath, bankAccount, bankCode }
    } else if (payMethod === 'jko') {
      const { jkoAccount } = payload
      payDetail = { payMethod, jkoAccount }
    } else if (payMethod === 'linePay') {
      const { linePayAccount } = payload
      payDetail = { payMethod, linePayAccount }
    }
    const setPayInfoAsync = updateDB(`participant/${uid}`, { payDetail })
    const moveStatusAsync = moveStauts(uid, status.PAYMENT_REQUIRED)
    await Promise.all([moveStatusAsync, setPayInfoAsync])
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
    const moveStatusAsync = moveStauts(id, nextStatus)
    const setRSVPAsync = updateDB(`participant/${id}`, { rsvp })
    if (rsvp) await Promise.all([moveStatusAsync, setRSVPAsync])
    else {
      const sendMailAsync = sendCompensationMail(id)
      await Promise.all([moveStatusAsync, setRSVPAsync, sendMailAsync])
    }
    res.json({ status: nextStatus })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})
module.exports = router
