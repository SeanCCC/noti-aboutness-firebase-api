const express = require('express')
const router = express.Router()
const { pushDB, findDB, fetchDB, setDB, moveDB } = require('../utils')
const { sendEmailCheck } = require('../mail')

const checkEmailRepeat = async (email) => {
  const candidateAsync = findDB('candidate', 'email', email)
  const participantAsync = findDB('participant', 'email', email)
  const candidateRes = await candidateAsync
  const participantRes = await participantAsync
  return candidateRes !== null || participantRes !== null
}

router.get('/mailcheck', async (req, res) => {
  try {
    const payload = req.query
    const { id } = payload
    const result = await fetchDB(`submitted/${id}`)
    if (result === null) return res.status(400).send('no record')
    const { email } = result
    const emailRepeat = await checkEmailRepeat(email)
    if (emailRepeat) return res.status(400).send('repeated')
    const moveAsync = setDB(`candidate/${id}`, { ...result })
    const removeAsync = setDB(`submitted/${id}`, null)
    await moveAsync
    await removeAsync
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

router.post('/', async (req, res) => {
  try {
    const payload = req.body
    const { email, name, gender } = payload
    // check email repeated
    const emailRepeat = await checkEmailRepeat(email)
    if (emailRepeat) return res.status(400).send('repeated')
    const timestamp = new Date()
    const newRef = await pushDB('submitted', { ...payload, timestamp: timestamp.toString() })
    const id = newRef.key
    await sendEmailCheck(email, name, gender, id)
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
