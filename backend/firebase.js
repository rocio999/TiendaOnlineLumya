require("dotenv").config();

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const fs = require("fs");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else if (process.env.FIREBASE_KEY) {
  serviceAccount = JSON.parse(
    fs.readFileSync(process.env.FIREBASE_KEY, "utf8")
  );
} else {
  throw new Error(
    "No se encontró FIREBASE_SERVICE_ACCOUNT_JSON ni FIREBASE_KEY"
  );
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

module.exports = { db, FieldValue };
