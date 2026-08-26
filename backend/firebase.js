import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import serviceAccount from "./lumya-cd461-firebase-adminsdk-fbsvc-7a3ad4cc66.json" assert { type: "json" };

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export { db, FieldValue };