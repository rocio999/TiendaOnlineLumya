"use client";

import "./CrearVendedor.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Datos de ejemplo — luego vendrá de Firestore según el id de la solicitud
const solicitudMock = {
  nombrePropietario: "María Jiménez",
  nombreNegocio: "Artesanías María",
  correo: "maria.tienda@lumya.com",
  telefono: "0987654321",
  descripcion: "Venta de artesanías hechas a mano, bolsos y accesorios tejidos.",
  estado: "pendiente",
};

export default function RevisarSolicitudVendedor() {
  const router = useRouter();
  const [solicitud] = useState(solicitudMock);
  const [mensaje, setMensaje] = useState("");

  const aprobar = () => {
    // Aquí luego conectamos con el backend: actualizar estado a "activo"
    console.log("Vendedor aprobado:", solicitud.correo);
    setMensaje("Vendedor aprobado. Ya puede iniciar sesión.");
    setTimeout(() => router.push("/admin/vendedores"), 2000);
  };

  const rechazar = () => {
    // Aquí luego conectamos con el backend: actualizar estado a "rechazado"
    console.log("Vendedor rechazado:", solicitud.correo);
    setMensaje("Solicitud rechazada.");
    setTimeout(() => router.push("/admin/vendedores"), 2000);
  };

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
          <input type="text" value={solicitud.nombrePropietario} disabled />
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

        <div className="separador">Decisión</div>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "10px" }}>
          <button
            type="button"
            onClick={aprobar}
            style={{ background: "#059669", width: "180px" }}
          >
            ✓ Aprobar
          </button>
          <button
            type="button"
            onClick={rechazar}
            style={{ background: "#dc2626", width: "180px" }}
          >
            ✕ Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}