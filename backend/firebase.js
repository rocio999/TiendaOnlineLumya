const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const serviceAccount = require("./lumya-cd461-firebase-adminsdk-fbsvc-940730b394.json");

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

module.exports = { db, FieldValue };
