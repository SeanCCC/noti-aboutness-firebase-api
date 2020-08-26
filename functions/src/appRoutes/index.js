const express = require('express')
const router = express.Router()
const status = require('../status')
const check = require('check-types')
const moment = require('moment-timezone')
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
    console.log({ email, deviceId })
    if (check.not.assigned(email) && check.not.assigned(deviceId)) return res.status(400).send('missing email or deviceId')
    const participant = await fetchDetailByEmail(email)
    console.log({ participant })
    if (check.null(participant)) return res.status(400).send('participant not found')
    const { data, uid } = participant
    console.log({ data })
    if (check.assigned(data.deviceId) &&
     [status.APP_VALID, status.RESEARCH_RUNNING].includes(data.status)) {
      if (data.deviceId !== deviceId) {
        await updateDB(`participant/${uid}`, { deviceId })
      }
      return res.json({ uid })
    }
    if (data.status !== status.BIG_FIVE_DONE) {
      return res.status(400).send('wrong status')
    }
    moment.locale('zh-tw')
    const researchStartDate = moment().tz('Asia/Taipei').add(1, 'days').format('YYYY-MM-DD')
    const asyncP = updateDB(`participant/${uid}`, {
      deviceId,
      status: status.APP_VALID,
      researchStartDate,
      lastStatusChanged: moment().tz('Asia/Taipei').format()
    })
    const asyncU = updateDB(`uploadRecord/${uid}`, {
      researchStartDate,
      active: true
    })
    await Promise.all([asyncP, asyncU])
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

router.post('/questionnaire', async (req, res) => {
  try {
    const payload = req.body
    const { uid, questionnaire, time } = payload
    if (!uid || !questionnaire) return res.status(400).send('missing uid or questionnaire')
    const date = moment(time).format('YYYY-MM-DD')
    await pushDB(`questionnaire/${uid}/${date}`, questionnaire)
    res.send('questionnaire saved')
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
