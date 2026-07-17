import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function registrarAuditoria(
  usuarioId: string,
  accion: string,
  tipo: "producto" | "pago" | "usuario" | "vendedor" | "categoria"
) {
  try {
    await addDoc(collection(db, "historial"), {
      usuarioId,
      accion,
      tipo,
      fecha: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al registrar auditoría:", error);
  }
}
