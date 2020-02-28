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

const fetchDB = async (refPath, orderByKey = true) => {
  const ref = orderByKey ? db.ref(refPath).orderByKey() : db.ref(refPath)
  const res = await ref.once('value')
  return res.val()
}

const findDB = async (refPath, key, value) => {
  const ref = db.ref(refPath)
  const res = await ref.orderByChild(key).equalTo(value).once('value')
  return res.val()
}

module.exports = { setDB, pushDB, fetchDB, findDB }
