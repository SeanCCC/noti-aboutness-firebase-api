const express = require('express')
const router = express.Router()
const moment = require('moment-timezone')
const _ = require('lodash')
const {
  fetchParticipantDetailById,
  fetchCandidateDetailById,
  updateDB,
  setDB,
  moveDB,
  fetchDB,
  busboyMiddleWare,
  uploadFile,
  moveStauts,
  getReceiptUrl
} = require('../utils')
const validators = require('./validators')
const status = require('../status')
const {
  sendReceiptMailInfo,
  sendCompensationMail,
  sendConsentMailInfo,
  sendApkLink
} = require('../mail')

router.get('/checkid', async (req, res) => {
  try {
    const payload = req.query
    const { id } = payload
    const result = await fetchParticipantDetailById(id)
    if (result !== null) {
      res.json({
        status: result.status,
        phoneBrand: result.phoneBrand,
        receiptMailMethod: result.receiptMailMethod
      })
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

const apkFileLink = 'https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/app-debug-2.2.1.apk'

router.post('/done/bigfive', validators.bigfive, async (req, res) => {
  try {
    const payload = req.body
    const { id, result } = payload
    const setBigfiveAsync = setDB(`bigfive/${id}`, result)
    const moveStatusAsync = moveStauts(id, status.BIG_FIVE_DONE)
    await Promise.all([moveStatusAsync, setBigfiveAsync])
    await sendApkLink(id, apkFileLink)
    res.json({ status: status.BIG_FIVE_DONE })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/sendchoose', validators.sendchoose, async (req, res) => {
  try {
    const payload = req.body
    const {
      id,
      mailMethod,
      mailBackAddress,
      mailBackCell,
      mailBackPostNumber,
      mailBackName
    } = payload
    let data
    let nextStatus
    if (['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(mailMethod)) {
      data = {
        mailMethod,
        mailBackAddress,
        mailBackCell,
        mailBackPostNumber,
        mailBackName
      }
      nextStatus = status.WAIT_FOR_REVERSED
    } else {
      data = { mailMethod }
      nextStatus = status.CONSENT_CHOSEN
    }
    await updateDB(`participant/${id}`, {
      ...data,
      consentChosenTime: moment().tz('Asia/Taipei').format(),
      status: nextStatus,
      lastStatusChanged: moment().tz('Asia/Taipei').format()
    })
    if (!['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(mailMethod)) {
      await sendConsentMailInfo(id)
    }
    res.json({ status: status.CONSENT_CHOSEN })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/sendconsent', async (req, res) => {
  try {
    const payload = req.body
    const { id } = payload
    let data
    await updateDB(`participant/${id}`, {
      ...data,
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
    const {
      id,
      mailMethod,
      mailBackAddress,
      mailBackCell,
      mailBackPostNumber,
      mailBackName
    } = payload
    let data
    if (['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(mailMethod)) {
      data = {
        receiptMailMethod: mailMethod,
        receiptReverseInfo: {
          mailBackAddress,
          mailBackCell,
          mailBackPostNumber,
          mailBackName
        }
      }
    } else {
      data = { receiptMailMethod: mailMethod }
    }
    await updateDB(`participant/${id}`, {
      ...data,
      // receiptMailTime: moment().tz('Asia/Taipei').format(),
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
    const p = await fetchParticipantDetailById(id)
    if (payMethod === 'bankTransfer') {
      const { bankAccount, bankCode } = payload
      imgPath = await uploadFile(req, 'passbooks', id)
      payDetail = { payMethod, imgPath, bankAccount, bankCode }
    } else if (payMethod === 'jko') {
      const { jkoAccount } = payload
      payDetail = { payMethod, jkoAccount }
    } else if (payMethod === 'linePay') {
      const { linePayAccount } = payload
      payDetail = { payMethod, linePayAccount }
    }
    const nextStatus = ['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(p.receiptMailMethod)
      ? status.WAIT_FOR_RECEIPT_REVERSED : status.RECEIPT_CHOSEN
    await updateDB(`participant/${id}`, {
      payDetail,
      status: nextStatus,
      lastStatusChanged: moment().tz('Asia/Taipei').format()
    })
    if (!['reversedOrdinaryMail', 'reversedRegisteredMail'].includes(p.receiptMailMethod)) await sendReceiptMailInfo(id)
    res.json({ status: nextStatus })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/sendreceipt', async (req, res) => {
  try {
    const { id } = req.body
    await updateDB(`participant/${id}`, {
      receiptMailTime: moment().tz('Asia/Taipei').format(),
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
    const now = moment().tz('Asia/Taipei').format()
    const payload = req.body
    const { id, rsvp } = payload
    const nextStatus = rsvp ? status.INTERVIEW_ACCEPTED : status.SET_RECEIPT_MAIL_METHOD
    await updateDB(`participant/${id}`, {
      rsvp,
      status: nextStatus,
      lastStatusChanged: now,
      interviewAcceptTime: rsvp ? now : undefined
    })
    if (!rsvp) await sendCompensationMail(id)
    res.json({ status: nextStatus })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

const completeDaily = (esmDistDaily = [], daysBetween = []) => {
  let _esmDistDaily = [...esmDistDaily]
  daysBetween.forEach(date => {
    if (_esmDistDaily.find(dist => dist.date === date) === undefined) {
      _esmDistDaily.push({ date, amount: 0 })
    }
  })
  _esmDistDaily = _.sortBy(_esmDistDaily, r => new Date(r.date))
  return _esmDistDaily
}

router.get('/score', async (req, res) => {
  try {
    const payload = req.query
    const { id } = payload
    const [tmp, researchStartDate] = await Promise.all([
      fetchDB(`uploadRecord/${id}/esmDistDaily`),
      fetchDB(`uploadRecord/${id}/researchStartDate`)
    ])
    const esmDistDaily = tmp || []
    if (!researchStartDate) return res.status(500).send('error')
    const today = moment().tz('Asia/Taipei').startOf('day')
    const startDay = moment.tz(researchStartDate, 'YYYY-MM-DD', 'Asia/Taipei')
    const ms = today.diff(startDay)
    const dnum = moment.duration(ms).asDays() + 1
    const daysBetween = [...Array(dnum).keys()].map(
      n => moment(startDay).add(n, 'days').format('YYYY-MM-DD')
    )
    const _dayly = completeDaily(esmDistDaily, daysBetween).reverse()
    const totalEsm = esmDistDaily.reduce((acu, cur) => cur.amount + acu, 0)
    const avgEsm = _.round(totalEsm / dnum, 2)
    res.json({ esmDistDaily: _dayly, totalEsm, avgEsm, dnum })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.get('/mailmethod', async (req, res) => {
  try {
    const payload = req.query
    const { id } = payload
    const mailMethod = await fetchDB(`participant/${id}/mailMethod`)
    res.json({ mailMethod })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.get('/receipt/mailmethod', async (req, res) => {
  try {
    const payload = req.query
    const { id } = payload
    const url = await getReceiptUrl(id)
    const mailMethod = await fetchDB(`participant/${id}/receiptMailMethod`)
    res.json({ mailMethod, url })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
