const express = require('express')
const router = express.Router()
const { pushDB, findDB, fetchDB, setDB } = require('../utils')
const { sendEmailCheck } = require('../mail')
const moment = require('moment-timezone')

const checkEmailRepeat = async (email) => {
  const asyncList = ['candidate', 'participant', 'declined'].map((v) => findDB(v, 'email', email))
  const resultList = await Promise.all(asyncList)
  return resultList.find((v) => v !== null)
}

const checkIdRepeat = async (id) => {
  const asyncList = ['candidate', 'participant', 'declined'].map((v) => fetchDB(`${v}/${id}`))
  const resultList = await Promise.all(asyncList)
  return resultList.find((v) => v !== null)
}

router.get('/mailcheck', async (req, res) => {
  try {
    const payload = req.query
    const { id } = payload
    const checkIdResult = await checkIdRepeat(id)
    if (checkIdResult) return res.status(400).send('repeated')
    const checkSubmitResult = await fetchDB(`submitted/${id}`)
    if (checkSubmitResult === null) return res.status(400).send('no record')
    const { email } = checkSubmitResult
    const emailRepeat = await checkEmailRepeat(email)
    if (emailRepeat) return res.status(400).send('repeated')
    const moveAsync = setDB(`candidate/${id}`, { ...checkSubmitResult })
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
    const newRef = await pushDB('submitted', { ...payload, timestamp: moment().tz('Asia/Taipei').format() })
    const id = newRef.key
    await sendEmailCheck(email, name, gender, id)
    res.send('success')
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

module.exports = router
