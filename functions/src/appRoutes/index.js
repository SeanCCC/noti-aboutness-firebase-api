const express = require('express')
const router = express.Router()
const status = require('../status')
const check = require('check-types')
const { findDB, updateDB, pushDB } = require('../utils')

const fetchDetailByEmail = async (email) => {
  const participant = await findDB('participant', 'email', email)
  if (participant === null) return null
  const uid = Object.keys(participant)[0]
  return {
    data: participant[uid],
    uid
  }
}

const fetchUIDByDeviceId = async (deviceId) => {
  const participant = await findDB('participant', 'deviceId', deviceId)
  if (participant === null) return null
  const uid = Object.keys(participant)[0]
  return uid
}

router.post('/bind', async (req, res) => {
  try {
    const payload = req.body
    const { email, deviceId } = payload
    if (check.not.assigned(email) && check.not.assigned(deviceId)) return res.status(400).send('missing email or deviceId')
    const participant = await fetchDetailByEmail(email)
    if (check.null(participant)) return res.status(400).send('participant not found')
    const { data, uid } = participant
    if (check.not.assigned(data.deviceId) && data.status !== status.BIG_FIVE_DONE) {
      return res.status(400).send('bound already')
    }
    await updateDB(`participant/${uid}`, { deviceId, status: status.APP_VALID })
    res.json({ uid })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/notification', async (req, res) => {
  try {
    const payload = req.body
    const { uid, notification } = payload
    if (!uid || !notification) return res.status(400).send('missing uid or notification')
    await pushDB(`notification/${uid}`, notification)
    res.send('notification saved')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.get('/uid', async (req, res) => {
  try {
    const payload = req.query
    const { deviceId } = payload
    if (!deviceId) return res.status(400).send('missing deviceId')
    const uid = await fetchUIDByDeviceId(deviceId)
    if (uid === null) return res.status(404).send('participant not found')
    res.json({ uid })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
