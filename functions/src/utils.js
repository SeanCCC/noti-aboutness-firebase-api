const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey')
const Busboy = require('busboy')
// const Stream = require('stream')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  storageBucket: 'noti-aboutness-firebase-48728.appspot.com'
})

var db = admin.database()

const setDB = async (refPath, data) => {
  const ref = db.ref(refPath)
  const res = await ref.set(data)
  return res
}

const updateDB = async (refPath, data) => {
  const ref = db.ref(refPath)
  const res = await ref.update(data)
  return res
}

const pushDB = async (refPath, data) => {
  const ref = db.ref(refPath)
  const res = await ref.push(data)
  return res
}

const moveDB = async (src, dest, payload = {}) => {
  const srcRes = await fetchDB(src)
  if (srcRes === null) return false
  const moveAsync = setDB(dest, { ...srcRes, ...payload })
  const removeAsync = setDB(src, null)
  await moveAsync
  await removeAsync
  return true
}

const fetchDB = async (refPath, orderByKey = true) => {
  const ref = orderByKey ? db.ref(refPath).orderByKey() : db.ref(refPath)
  const res = await ref.once('value')
  return res.val()
}

const findDB = async (refPath, attr, value) => {
  const ref = db.ref(refPath)
  const res = await ref.orderByChild(attr).equalTo(value).once('value')
  return res.val()
}

const busboyMiddleWare = (req, res, next) => {
  const busboy = new Busboy({
    headers: req.headers,
    limits: {
      fileSize: 1 * 1024 * 1024
    }
  })
  // This object will accumulate all the uploaded files, keyed by their name
  let upload = {}
  const body = {}
  // This callback will be invoked for each file uploaded
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    upload = { filename, mimetype, uploadStream: file }
    // const dest = bucket.file('test.jpeg')
    // file.pipe(dest.createWriteStream({
    //   metadata: {
    //     contentType: mimetype,
    //     metadata: {
    //       cacheControl: 'public, max-age=3600'
    //     }
    //   }
    // }))
    // .on('error', function (err) {
    //   console.error(err)
    // })
    // .on('finish', function () {
    //   console.log('finished')
    // })
  })
  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
    console.log(fieldname, val)
    body[fieldname] = val
  })

  // This callback will be invoked after all uploaded files are saved.
  busboy.on('finish', () => {
    console.log('Done parsing form!')
    req.body = body
    req.file = upload
    next()
  })

  // The raw bytes of the upload will be in req.rawBody.  Send it to busboy, and get
  // a callback when it's finished.
  busboy.end(req.rawBody)
}

const bucket = admin.storage().bucket()

async function uploadFile (srcStream, prefix, filename, mimetype) {
  const dest = bucket.file('test.jpeg')
  srcStream.pipe(dest.createWriteStream({
    metadata: {
      contentType: mimetype,
      metadata: {
        cacheControl: 'public, max-age=3600'
      }
    }
  }))
    .on('error', function (err) {
      console.error(err)
    })
    .on('finish', function () {
      console.log('finished')
    })
}

module.exports = {
  busboyMiddleWare,
  uploadFile,
  setDB,
  pushDB,
  moveDB,
  fetchDB,
  findDB,
  updateDB
}
