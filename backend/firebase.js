import "dotenv/config";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else if (process.env.FIREBASE_KEY) {
  serviceAccount = JSON.parse(
    fs.readFileSync(process.env.FIREBASE_KEY, "utf8")
  );
} else {
  // Como respaldo local para tu archivo actual si no usas variables de entorno aún
  try {
    serviceAccount = JSON.parse(
      fs.readFileSync('./lumya-cd461-firebase-adminsdk-fbsvc-7a3ad4cc66.json', 'utf8')
    );
  } catch (error) {
    throw new Error(
      "No se encontró FIREBASE_SERVICE_ACCOUNT_JSON, FIREBASE_KEY ni el archivo JSON local."
    );
  }
}

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export { db, FieldValue };