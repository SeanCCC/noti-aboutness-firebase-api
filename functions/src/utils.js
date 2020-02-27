const admin = require('firebase-admin')
const serviceAccount = require('../serviceAccountKey')
const nodemailer = require('nodemailer')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
})

var db = admin.database()

const setDB = async (refPath, data) => {
  const ref = db.ref(refPath)
  await ref.set(data)
}

const pushDB = async (refPath, data) => {
  const ref = db.ref(refPath)
  await ref.push(data)
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    user: 'notiatmuilab@gmail.com',
    clientId: '565872836833-65pu6hjk8ro591l2a3kp2leun7omqtqm.apps.googleusercontent.com',
    clientSecret: 'D0BlAebCEWqXUa2sIGIi-e-s',
    refreshToken: '1//04L8W328tcK3ACgYIARAAGAQSNwF-L9IrGL_iahZCsKcR6x5DMyXMJkuIVji8DFd268AwAJ3Z6U3Gh7QUkmVSlKPMwMQmN3cA7g4'
  }
})

module.exports = { setDB, pushDB }
