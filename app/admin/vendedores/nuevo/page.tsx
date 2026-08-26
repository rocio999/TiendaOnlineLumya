"use client";

import styles from "./CrearVendedor.module.css";
import { useEffect, useState, Suspense } from "react";
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
  whatsapp?: string;
  qrUrl?: string;
  qrDeUnaUrl?: string;
  aceptaTerminos?: boolean;
  estado: string;
}

function RevisarSolicitudVendedorContenido() {
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
        const res = await fetch(`http://brown-lark-804410.hostingersite.com/vendedores/${id}`);
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
      const res = await fetch(`http://brown-lark-804410.hostingersite.com/vendedores/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": "lumya-admin-2026" },
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
        {solicitud.whatsapp && (
          <input type="text" className={styles.full} value={`WhatsApp: ${solicitud.whatsapp}`} disabled />
        )}

        {(solicitud.qrUrl || solicitud.qrDeUnaUrl) && (
          <div style={{ marginTop: "20px" }}>
            <p style={{ fontWeight: "bold", color: "#1e3a8a", marginBottom: "10px" }}>Códigos QR de pago</p>
            <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
              {solicitud.qrUrl && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "5px" }}>QR de pago</p>
                  <img src={solicitud.qrUrl} alt="QR de pago" style={{ width: "150px", height: "150px", objectFit: "contain", border: "1px solid #e2e8f0", borderRadius: "10px" }} />
                </div>
              )}
              {solicitud.qrDeUnaUrl && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "5px" }}>QR &quot;De una&quot;</p>
                  <img src={solicitud.qrDeUnaUrl} alt="QR De una" style={{ width: "150px", height: "150px", objectFit: "contain", border: "1px solid #e2e8f0", borderRadius: "10px" }} />
                </div>
              )}
            </div>
          </div>
        )}
        {solicitud.aceptaTerminos && (
          <div style={{ marginTop: "15px", padding: "12px", borderRadius: "10px", background: "#dcfce7", textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: "bold", color: "#15803d" }}>
              ✅ El vendedor aceptó los Términos y Condiciones
            </p>
          </div>
        )}
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
export default function RevisarSolicitudVendedor() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "40px" }}>Cargando...</div>}>
      <RevisarSolicitudVendedorContenido />
    </Suspense>
  );
}
