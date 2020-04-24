const express = require('express')
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

router.post('/done/compensation', busboyMiddleWare, async (req, res) => {
  try {
    const payload = req.body
    const file = req.file
    const { id, payInfo } = payload
    const { uploadStream, mimetype } = file
    uploadFile(uploadStream, 'passbook', id, mimetype)
    res.json({ id, payInfo, file })
    // return res.json({ id })
  //   const result = await fetchParticipantDetailById(id)
  //   if (result === null || result.status !== status.RESEARCH_DONE || result.payInfo !== undefined) {
  //     return res.status(400).send('unauth')
  //   }
  //   const moveStatusAsync = moveStauts(id, status.PAYMENT_REQUIRED)
  //   const setPayInfoAsync = updateDB(`participant/${id}`, { payInfo })
  //   await Promise.all([moveStatusAsync, setPayInfoAsync])
  //   res.json({ status: status.PAYMENT_REQUIRED })
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
