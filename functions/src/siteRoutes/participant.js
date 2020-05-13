const express = require('express')
const check = require('check-types')
const router = express.Router()
const { fetchDB, updateDB, setDB, moveDB, busboyMiddleWare, uploadFile } = require('../utils')
const status = require('../status')

const fetchParticipantDetailById = async (id) => {
  const result = await fetchDB(`participant/${id}`)
  return result
}

const fetchCandidateDetailById = async (id) => {
  const result = await fetchDB(`candidate/${id}`)
  return result
}

const moveStauts = async (id, status) => {
  const result = await updateDB(`participant/${id}`, { status })
  return result
}

router.get('/checkid', async (req, res) => {
  try {
    const payload = req.query
    const { id } = payload
    const result = await fetchParticipantDetailById(id)
    if (result !== null) { res.json({ status: result.status }) } else {
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

router.post('/done/video', async (req, res) => {
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

router.post('/done/sendconsent', async (req, res) => {
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

router.post('/done/receipt', async (req, res) => {
  try {
    const payload = req.body
    const { id, mailMethod } = payload
    const result = await fetchParticipantDetailById(id)
    if (result === null || result.status !== status.SET_RECEIPT_MAIL_METHOD || result.receiptMailMethod !== undefined) {
      return res.status(400).send('unauth')
    }
    const moveStatusAsync = moveStauts(id, status.SET_PAY_METHOD)
    const setMailMAsync = updateDB(`participant/${id}`, { receiptMailMethod: mailMethod })
    await Promise.all([moveStatusAsync, setMailMAsync])
    res.json({ status: status.SET_PAY_METHOD })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

const compensationCheck = (req, res, next) => {
  const payload = req.body
  const { payMethod } = payload
  if (payMethod === 'linePay') {
    const { linePayAccount } = payload
    if (!check.nonEmptyString(linePayAccount)) return res.status(400).send('invalid lineid')
  } else if (payMethod === 'jko') {
    const { jkoAccount } = payload
    if (!check.nonEmptyString(jkoAccount)) return res.status(400).send('invalid jko account')
  } else if (payMethod === 'bankTransfer') {
    const { bankAccount, bankCode } = payload
    if (!check.nonEmptyString(bankAccount) && !check.nonEmptyString(bankCode)) return res.status(400).send('invalid lineid')
  } else return res.status(400).send('invalid pay method')
  next()
}

router.post('/done/compensation', busboyMiddleWare, compensationCheck, async (req, res) => {
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

router.post('/', async (req, res) => {
  try {
  } catch (err) {
  }
})

module.exports = router
