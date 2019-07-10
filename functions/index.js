const functions = require('firebase-functions').region('asia-east2');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.api = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
