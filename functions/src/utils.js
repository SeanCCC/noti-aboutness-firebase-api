const admin = require('firebase-admin')
var serviceAccount = require('../serviceAccountKey')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
})

var db = admin.database()

const appendToCollection = async (refPath, data) => {
  const ref = db.ref(refPath)
  await ref.set(data)
}

module.exports = { appendToCollection }
