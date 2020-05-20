import firebase from 'firebase'
const config = {
  apiKey: 'AIzaSyAFjPm3moByALBKFZjQw7-J1OKhuj64Chg',
  authDomain: 'noti-aboutness-firebase-48728.firebaseapp.com',
  databaseURL: 'https://noti-aboutness-firebase-48728.firebaseio.com',
  projectId: 'noti-aboutness-firebase-48728',
  storageBucket: 'noti-aboutness-firebase-48728.appspot.com',
  messagingSenderId: '565872836833',
  appId: '1:565872836833:web:799242f1c774cda9daf7a0',
  measurementId: 'G-Z3H54HV5DM'
}
firebase.initializeApp(config)
export const firebaseAuth = firebase.auth()
export const firebaseDB = firebase.database()
