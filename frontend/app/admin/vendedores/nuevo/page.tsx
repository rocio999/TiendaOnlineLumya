"use client";

import "./CrearVendedor.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { registrarAuditoria } from "@/lib/auditoria";

interface Solicitud {
  nombre: string;
  nombreNegocio: string;
  correo: string;
  telefono: string;
  descripcion: string;
  cedula: string;
  banco: string;
  numeroCuenta: string;
  estado: string;
}

export default function RevisarSolicitudVendedor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [solicitud, setSolicitud] = useState<Solicitud | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarSolicitud = async () => {
      if (!id) {
        setCargando(false);
        return;
      }
      try {
        const docRef = doc(db, "usuarios", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSolicitud(docSnap.data() as Solicitud);
        }
      } catch (error) {
        console.error("Error al cargar solicitud:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarSolicitud();
  }, [id]);

  const aprobar = async () => {
    if (!id) return;
    setProcesando(true);
    try {
      await updateDoc(doc(db, "usuarios", id), { estado: "activo" });
      await registrarAuditoria(id, `Aprobó al vendedor ${solicitud?.nombreNegocio || solicitud?.nombre}`, "vendedor");
      setMensaje("Vendedor aprobado. Ya puede iniciar sesión.");
      setTimeout(() => router.push("/admin/vendedores"), 2000);
    } catch (error) {
      console.error("Error al aprobar:", error);
      setMensaje("Ocurrió un error al aprobar. Intenta de nuevo.");
    } finally {
      setProcesando(false);
    }
  };

  const rechazar = async () => {
    if (!id) return;
    setProcesando(true);
    try {
      await updateDoc(doc(db, "usuarios", id), { estado: "rechazado" });
      await registrarAuditoria(id, `Rechazó al vendedor ${solicitud?.nombreNegocio || solicitud?.nombre}`, "vendedor");
      setMensaje("Solicitud rechazada.");
      setTimeout(() => router.push("/admin/vendedores"), 2000);
    } catch (error) {
      console.error("Error al rechazar:", error);
      setMensaje("Ocurrió un error al rechazar. Intenta de nuevo.");
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center" }}>Cargando solicitud...</div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: "center" }}>No se encontró la solicitud.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="avatar">🏪</div>

        <div className="titulo">
          <div className="linea"></div>
          <h2>SOLICITUD DE VENDEDOR</h2>
          <div className="linea"></div>
        </div>

        {mensaje && (
          <div style={{
            background: "#dcfce7",
            color: "#15803d",
            padding: "12px 16px",
            borderRadius: "12px",
            marginBottom: "20px",
            fontWeight: "bold",
            textAlign: "center"
          }}>
            ✅ {mensaje}
          </div>
        )}

        <div className="fila">
          <input type="text" value={solicitud.nombre} disabled />
          <input type="text" value={solicitud.nombreNegocio} disabled />
        </div>

        <input type="email" className="full" value={solicitud.correo} disabled />
        <input type="text" className="full" value={solicitud.telefono} disabled />

        <textarea
          className="full"
          value={solicitud.descripcion}
          disabled
          rows={3}
          style={{
            width: "100%",
            borderRadius: "20px",
            border: "2px solid #bcbcbc",
            padding: "14px 18px",
            fontSize: "15px",
            color: "black",
            resize: "none",
          }}
        />

        <div className="separador">Información de pago</div>

        <input type="text" className="full" value={solicitud.cedula} disabled />
        <input type="text" className="full" value={solicitud.banco} disabled />
        <input type="text" className="full" value={solicitud.numeroCuenta} disabled />

        <div className="separador">Decisión</div>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "10px" }}>
          <button
            type="button"
            onClick={aprobar}
            disabled={procesando}
            style={{ background: "#059669", width: "180px" }}
          >
            ✓ Aprobar
          </button>
          <button
            type="button"
            onClick={rechazar}
            disabled={procesando}
            style={{ background: "#dc2626", width: "180px" }}
          >
            ✕ Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}