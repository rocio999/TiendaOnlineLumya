require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS_JSON) {
  // En Render: lee las credenciales desde una variable de entorno (texto)
  serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);
} else {
  // En tu computadora: lee el archivo .json local
  serviceAccount = require(process.env.FIREBASE_KEY);
}

const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);
module.exports = { db, FieldValue };
