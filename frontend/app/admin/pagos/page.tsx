"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

interface Pago {
  id: string;
  producto: string;
  monto: number;
  metodo: string;
  estado: string;
  comprobante?: string;
  vendedorNombreResuelto?: string;
  clienteNombreResuelto?: string;
  fecha?: Timestamp;
}

export default function PagosAdmin() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPagos = async () => {
      try {
        const res = await fetch("http://localhost:3001/pagos");
        const data = await res.json();
        setPagos(data);
      } catch (error) {
        console.error("Error al cargar pagos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarPagos();
  }, []);

  const estiloEstado: Record<string, string> = {
    pendiente: "background:#fef3c7;color:#b45309;",
    aprobado: "background:#d1fae5;color:#047857;",
    rechazado: "background:#fee2e2;color:#b91c1c;",
  };

  const formatearFecha = (fecha: Timestamp | null | undefined) => {
    if (!fecha) return "Sin fecha";
    if (fecha._seconds) {
      return new Date(fecha._seconds * 1000).toLocaleDateString("es-EC");
    }
    return "Sin fecha";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ background: "linear-gradient(90deg, #1e3a8a, #1e40af)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} style={{ borderRadius: "10px" }} />
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}>Pagos</span>
        </div>
        <Link href="/admin">
          <button style={{ color: "#fff", background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 14px", borderRadius: "10px", cursor: "pointer" }}>
            ← Volver
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
        <p style={{ color: "#64748b", marginBottom: "20px", fontSize: "14px" }}>
          Aquí puedes ver todos los pagos. Recuerda que aprobarlos o rechazarlos se hace desde el panel del vendedor.
        </p>

        {cargando ? (
          <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>Cargando pagos...</p>
        ) : pagos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px" }}>No hay pagos registrados.</p>
        ) : (
          <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(90deg, #2563eb, #06b6d4)", color: "#fff", textAlign: "left" }}>
                  <th style={{ padding: "12px" }}>Producto</th>
                  <th style={{ padding: "12px" }}>Cliente</th>
                  <th style={{ padding: "12px" }}>Vendedor</th>
                  <th style={{ padding: "12px" }}>Método</th>
                  <th style={{ padding: "12px" }}>Comprobante</th>
                  <th style={{ padding: "12px" }}>Estado</th>
                  <th style={{ padding: "12px" }}>Monto</th>
                  <th style={{ padding: "12px" }}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px", color: "#1e293b" }}>{pago.producto}</td>
                    <td style={{ padding: "12px", color: "#1e293b" }}>
                     {pago.clienteNombreResuelto
                     ? pago.clienteNombreResuelto.split(" ").slice(0, 2).join(" ")
                       : "Cliente"}
                      </td>              
                        <td style={{ padding: "12px", color: "#1e293b" }}>{pago.vendedorNombreResuelto || "Vendedor"}</td>
                    <td style={{ padding: "12px" }}>
                      {pago.metodo === "Transferencia" ? "🏦 Transferencia" : "📲 DeUna"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {pago.comprobante && pago.comprobante !== "sin_comprobante.jpg" ? (
                        <a href={pago.comprobante} target="_blank" rel="noopener noreferrer">
                          <img src={pago.comprobante} alt="Comprobante" style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                        </a>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#d97706", fontWeight: "600" }}>Sin comprobante</span>
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: "bold", ...Object.fromEntries((estiloEstado[pago.estado] || "").split(";").filter(Boolean).map(s => s.split(":"))) }}>
                        {pago.estado}
                      </span>
                    </td>
                    <td style={{ padding: "12px", fontWeight: "bold", color: "#1e3a8a" }}>${pago.monto}</td>
                    <td style={{ padding: "12px", fontSize: "13px", color: "#64748b" }}>{formatearFecha(pago.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
