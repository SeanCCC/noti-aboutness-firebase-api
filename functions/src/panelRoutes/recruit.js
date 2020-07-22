const express = require('express')
const router = express.Router()
const { updateDB, moveDB } = require('../utils')
const moment = require('moment-timezone')
const { sendAcceptMail, sendDeclineMail } = require('../mail')
const status = require('../status')

// const restructure = (objs) => {
//   return Object.keys(objs).map((uid) => {
//     return {
//       uid,
//       ...objs[uid]
//     }
//   })
// }

router.post('/add', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    const success = await moveDB(`candidate/${uid}`, `participant/${uid}`, { status: status.INIT })
    if (success === true) { res.send('success') } else res.status(400).send('not found')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

// router.get('/candidates', async (req, res) => {
//   try {
//     const result = await fetchDB('candidate')
//     if (result === null) return res.json([])
//     const data = restructure(result)
//     res.json(data)
//   } catch (err) {
//     console.error(err)
//     res.status(500).send('error')
//   }
// })

router.post('/accept', async (req, res) => {
  try {
    const { uid } = req.body
    if (!uid) return res.status(400).send('missing uid')
    await sendAcceptMail(uid)
    await updateDB(`candidate/${uid}`, { lastInvitationSent: moment().tz('Asia/Taipei').format() })
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/decline', async (req, res) => {
  try {
    const { uid } = req.body
    if (!uid) return res.status(400).send('missing uid')
    const mailAsync = sendDeclineMail(uid)
    const declineAsync = await moveDB(`candidate/${uid}`, `declined/${uid}`)
    await mailAsync
    await declineAsync
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
