const admin = require('firebase-admin');
var serviceAccount = require("../serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const db = admin.firestore();

const appendToCollection = async (collectionName, data) => {
    const testCollection = db.collection(collectionName);
    return await testCollection.add(data);
}

module.exports = {appendToCollection};