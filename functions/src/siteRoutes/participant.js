const express = require('express')
const Busboy = require('busboy')
const path = require('path')
const os = require('os')
const fs = require('fs')
const router = express.Router()
const { fetchDB, updateDB, setDB, moveDB } = require('../utils')
const status = require('../status')

const fetchParticipantDetailById = async (id) => {
  const result = await fetchDB(`participant/${id}`)
  return result
}

const fetchCandidateDetailById = async (id) => {
  const result = await fetchDB(`candidate/${id}`)
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
    if (result !== null) { res.json({ status: result.status }) } else {
      const candi = await fetchCandidateDetailById(id)
      if (candi === null) res.status(400).send('not found')
      else {
        await moveDB(`candidate/${id}`, `participant/${id}`, { status: status.INIT })
        res.json({ status: status.INIT })
      }
    }
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
    await Promise.all([moveStatusAsync, setBigfiveAsync])
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
    const setMailMethodAsync = updateDB(`participant/${id}`, { mailMethod })
    await Promise.all([moveStatusAsync, setMailMethodAsync])
    res.json({ status: status.CONSENT_SENT })
  } catch (err) {
    console.error(err)
    res.status(500).send('error')
  }
})

// https://stackoverflow.com/questions/47242340/how-to-perform-an-http-file-upload-using-express-on-cloud-functions-for-firebase
router.post('/done/compensation', async (req, res) => {
  try {
    const payload = req.body
    const busboy = new Busboy({ headers: req.headers })
    // This object will accumulate all the uploaded files, keyed by their name
    const uploads = {}

    // This callback will be invoked for each file uploaded
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype)
      file.on('data', function (data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes')
      })
      file.on('end', function () {
        console.log('File [' + fieldname + '] Finished')
      })
    })

    // This callback will be invoked after all uploaded files are saved.
    busboy.on('finish', () => {
      console.log('Done parsing form!')
      res.writeHead(303, { Connection: 'close', Location: '/' })
      res.end()
    })

    // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
    // a callback when it's finished.
    busboy.end(req.rawBody)
    const { id, payInfo } = payload
    console.log(id)
    // return res.json({ id })
  //   const result = await fetchParticipantDetailById(id)
  //   if (result === null || result.status !== status.RESEARCH_DONE || result.payInfo !== undefined) {
  //     return res.status(400).send('unauth')
  //   }
  //   const moveStatusAsync = moveStauts(id, status.PAYMENT_REQUIRED)
  //   const setPayInfoAsync = updateDB(`participant/${id}`, { payInfo })
  //   await Promise.all([moveStatusAsync, setPayInfoAsync])
  //   res.json({ status: status.PAYMENT_REQUIRED })
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
