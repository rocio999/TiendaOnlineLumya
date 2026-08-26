import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leemos el archivo JSON original directamente como texto y lo convertimos con JSON.parse
// Esto evita cualquier problema con las variables de entorno de Hostinger y con la palabra 'assert'
const jsonPath = path.join(__dirname, "lumya-cd461-firebase-adminsdk-fbsvc-7a3ad4cc66.json");
const fileContent = fs.readFileSync(jsonPath, "utf8");
const serviceAccount = JSON.parse(fileContent);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

export { db, FieldValue };