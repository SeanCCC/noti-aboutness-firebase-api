const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
})

var db = admin.database()

const setDB = async (refPath, data) => {
  const ref = db.ref(refPath)
  const res = await ref.set(data)
  return res
}

const pushDB = async (refPath, data) => {
  const ref = db.ref(refPath)
  const res = await ref.push(data)
  return res
}

module.exports = { setDB, pushDB }
