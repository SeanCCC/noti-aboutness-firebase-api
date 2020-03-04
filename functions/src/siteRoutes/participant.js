const express = require('express')
const router = express.Router()
const { fetchDB } = require('../utils')

const fetchIdDetail = async (id) => {
  const result = await fetchDB(`participant/${id}`)
  return result
}

router.get('/checkid', async (req, res) => {
  try {
    const payload = req.query
    const { id } = payload
    const result = await fetchIdDetail(id)
    if (result !== null) { res.json({ status: result.status }) } else res.status(401).send('unauthorized')
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
