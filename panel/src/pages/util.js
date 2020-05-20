import { firebaseDB } from '../firebaseInit'

const restructure = (objs) => {
  return Object.keys(objs).map((uid) => {
    return {
      uid,
      ...objs[uid]
    }
  })
}

export const dbRef = (colloection, cb, filterFunc = () => true) =>
  firebaseDB.ref(colloection).on('value', function (snapshot) {
    const data = restructure(snapshot.val()).filter(filterFunc)
    cb(data)
  })
