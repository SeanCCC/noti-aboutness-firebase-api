const express = require('express')
const router = express.Router()
const { moveStauts } = require('../utils')
const { sendPreResearchRemind, sendConsentAcceptMail } = require('../mail')
const status = require('../status')

// const restructure = (objs) => {
//   return Object.keys(objs).map((uid) => {
//     return {
//       uid,
//       ...objs[uid]
//     }
//   })
// }

router.post('/consent/accept', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await sendConsentAcceptMail(uid)
    await moveStauts(uid, status.CONSENT_VALID)
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

// router.get('/consent/pending', async (req, res) => {
//   try {
//     const result = await fetchDB('participant')
//     if (result === null) return res.json([])
//     const data = restructure(result)
//     const consentpending = data
//       .filter((d) => [status.INIT, status.VIDEO_DONE, status.CONSENT_SENT].includes(d.status))
//       .map(({ uid, status, mailMethod, consentSentTime, name }) => ({ uid, status, mailMethod, consentSentTime, name }))
//     res.json(consentpending)
//   } catch (err) {
//     console.error(err)
//     res.status(500).send('error')
//   }
// })

router.post('/preResearchRemind', async (req, res) => {
  try {
    const payload = req.body
    const { uid } = payload
    await sendPreResearchRemind(uid)
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
