const express = require('express')
const router = express.Router()
const { fetchDB, setDB } = require('../utils')
const status = require('../status')

const moveCandidate = async (id) => {
  const candidateRes = await fetchDB(`candidate/${id}`)
  if (candidateRes === null) return false
  const moveAsync = setDB(`participant/${id}`, { ...candidateRes, status: status.INIT })
  const removeAsync = setDB(`candidate/${id}`, null)
  await moveAsync
  await removeAsync
  return true
}

router.post('/add', async (req, res) => {
  try {
    const payload = req.body
    const { id } = payload
    const success = await moveCandidate(id)
    if (success === true) { res.send('success') } else res.status(400).send('not found')
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
