"use client";

import styles from "./CrearVendedor.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
        const res = await fetch(`http://localhost:3001/vendedores/${id}`);
        const data = await res.json();
        if (res.ok) {
          setSolicitud(data);
        }
      } catch (error) {
        console.error("Error al cargar solicitud:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarSolicitud();
  }, [id]);

  const cambiarEstado = async (nuevoEstado: string) => {
    if (!id) return;
    setProcesando(true);
    try {
      const res = await fetch(`http://localhost:3001/vendedores/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) {
        setMensaje("Ocurrió un error al procesar la solicitud.");
        setProcesando(false);
        return;
      }

      setMensaje(
        nuevoEstado === "activo"
          ? "Vendedor aprobado. Ya puede iniciar sesión."
          : "Solicitud rechazada."
      );
      setTimeout(() => router.push("/admin/vendedores"), 2000);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setMensaje("No se pudo conectar con el servidor.");
    } finally {
      setProcesando(false);
    }
  };

  if (cargando) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ textAlign: "center" }}>Cargando solicitud...</div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className={styles.container}>
        <div className={styles.card} style={{ textAlign: "center" }}>No se encontró la solicitud.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.avatar}>🏪</div>

        <div className={styles.titulo}>
          <div className={styles.linea}></div>
          <h2>SOLICITUD DE VENDEDOR</h2>
          <div className={styles.linea}></div>
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

        <div className={styles.fila}>
          <input type="text" value={solicitud.nombre} disabled />
          <input type="text" value={solicitud.nombreNegocio} disabled />
        </div>

        <input type="email" className={styles.full} value={solicitud.correo} disabled />
        <input type="text" className={styles.full} value={solicitud.telefono} disabled />

        <textarea
          className={styles.full}
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

        <div className={styles.separador}>Información de pago</div>

        <input type="text" className={styles.full} value={solicitud.cedula} disabled />
        <input type="text" className={styles.full} value={solicitud.banco} disabled />
        <input type="text" className={styles.full} value={solicitud.numeroCuenta} disabled />

        <div className={styles.separador}>Decisión</div>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "10px" }}>
          <button
            type="button"
            onClick={() => cambiarEstado("activo")}
            disabled={procesando}
            style={{ background: "#059669", width: "180px" }}
          >
            ✓ Aprobar
          </button>
          <button
            type="button"
            onClick={() => cambiarEstado("rechazado")}
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