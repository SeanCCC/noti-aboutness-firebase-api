const express = require('express')
const router = express.Router()
const { fetchDB, updateDB, setDB, moveDB } = require('../utils')
const status = require('../status')

const fetchParticipantDetailById = async (id) => {
  const result = await fetchDB(`participant/${id}`)
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
    if (result !== null) { res.json({ status: result.status }) } else res.status(401).send('unauthorized')
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
    await setBigfiveAsync
    await moveStatusAsync
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
    const setBigfiveAsync = updateDB(`participant/${id}`, { mailMethod })
    await moveStatusAsync
    await setBigfiveAsync
    res.json({ status: status.CONSENT_SENT })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/done/compensation', async (req, res) => {
  try {
    const payload = req.body
    const { id, mailMethod } = payload
    const moveStatusAsync = moveStauts(id, status.CONSENT_SENT)
    const setBigfiveAsync = updateDB(`participant/${id}`, { mailMethod })
    await moveStatusAsync
    await setBigfiveAsync
    res.json({ status: status.CONSENT_SENT })
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
