const express = require('express')
const router = express.Router()
const { fetchDB, setDB, updateDB } = require('../utils')
const { sendAcceptMail, sendDeclineMail } = require('../mail')
const status = require('../status')

const restructure = (objs) => {
  return Object.keys(objs).map((uuid) => {
    return {
      uuid,
      ...objs[uuid]
    }
  })
}

const moveCandidate = async (uuid) => {
  const candidateRes = await fetchDB(`candidate/${uuid}`)
  if (candidateRes === null) return false
  const moveAsync = setDB(`participant/${uuid}`, { ...candidateRes, status: status.INIT })
  const removeAsync = setDB(`candidate/${uuid}`, null)
  await moveAsync
  await removeAsync
  return true
}

router.post('/add', async (req, res) => {
  try {
    const payload = req.body
    const { uuid } = payload
    const success = await moveCandidate(uuid)
    if (success === true) { res.send('success') } else res.status(400).send('not found')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.get('/participants', async (req, res) => {
  try {
    const result = await fetchDB('participant')
    if (result === null) return res.json([])
    const data = restructure(result)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.get('/candidates', async (req, res) => {
  try {
    const result = await fetchDB('candidate')
    if (result === null) return res.json([])
    const data = restructure(result)
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/accept', async (req, res) => {
  try {
    const { uuid } = req.body
    if (!uuid) return res.status(400).send('missing uuid')
    const mailAsync = sendAcceptMail(uuid)
    const setAsync = updateDB(`candidate/${uuid}`, { lastInvitationSent: new Date().toString() })
    await setAsync
    await mailAsync
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/decline', async (req, res) => {
  try {
    const { uuid } = req.body
    if (!uuid) return res.status(400).send('missing uuid')
    const mailAsync = sendDeclineMail(uuid)
    await mailAsync
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
