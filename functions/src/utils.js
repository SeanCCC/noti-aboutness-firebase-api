const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey')
const Busboy = require('busboy')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  storageBucket: 'noti-aboutness-firebase-48728.appspot.com'
})

var db = admin.database()

const bucket = admin.storage().bucket()

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
  const body = {}
  busboy.on('field', function (fieldname, val) {
    body[fieldname] = val
  })

  busboy.on('finish', () => {
    req.body = body
    next()
  })

  busboy.end(req.rawBody)
}

function uploadFile (req, prefix, filename) {
  return new Promise((resolve, reject) => {
    try {
      const destName = `${prefix}${filename}`
      const dest = bucket.file(destName)
      const busboy = new Busboy({
        headers: req.headers,
        limits: {
          fileSize: 1 * 1024 * 1024
        }
      })
      let result = null
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log(fieldname)
        file.pipe(dest.createWriteStream({
          metadata: {
            contentType: mimetype,
            metadata: {
              cacheControl: 'public, max-age=3600'
            }
          }
        }))
          .on('error', function (err) {
            console.error(err)
            throw err
          })
          .on('finish', function () {
            result = destName
            resolve(result)
          })
      })
      busboy.end(req.rawBody)
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

function fetchParticipantDetailById (id) {
  return fetchDB(`participant/${id}`)
}
function fetchCandidateDetailById (id) {
  return fetchDB(`candidate/${id}`)
}

const moveStauts = (id, status) => {
  return updateDB(`participant/${id}`, { status })
}

module.exports = {
  busboyMiddleWare,
  uploadFile,
  setDB,
  pushDB,
  moveDB,
  fetchDB,
  findDB,
  updateDB,
  fetchParticipantDetailById,
  fetchCandidateDetailById,
  moveStauts
}
