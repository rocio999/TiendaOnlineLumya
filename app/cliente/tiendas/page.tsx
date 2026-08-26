"use client";
import "./tiendas.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Vendedor {
  id: string;
  nombre?: string;
  nombreNegocio?: string;
  descripcion?: string;
  estado: string;
}

interface Tienda {
  id: string;
  nombreNegocio: string;
  descripcion: string;
}
interface Notificacion {
  id: string;
  usuarioId: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
}

export default function Tiendas() {
  const router = useRouter();
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [cargando, setCargando] = useState(true);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mostrarNotis, setMostrarNotis] = useState(false);
  const [cargandoNotis, setCargandoNotis] = useState(true);

  useEffect(() => {
    const cargarTiendas = async () => {
      try {
        const res = await fetch("http://brown-lark-804410.hostingersite.com/vendedores");
        const data = await res.json();
        const activos = data
          .filter((v: Vendedor) => v.estado === "activo")
          .map((v: Vendedor) => ({
            id: v.id,
            nombreNegocio: v.nombreNegocio || v.nombre || "Tienda",
            descripcion: v.descripcion || "Tienda en Lumya",
          }));
        setTiendas(activos);
      } catch (error) {
        console.error("Error al cargar tiendas:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarTiendas();
  }, []);

  useEffect(() => {
    const cargarNotis = async () => {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (!usuarioGuardado) {
        setCargandoNotis(false);
        return;
      }
      try {
        const usuario = JSON.parse(usuarioGuardado);
        const res = await fetch(`http://brown-lark-804410.hostingersite.com/notificaciones/${usuario.id}`);
        const data = await res.json();
        if (res.ok) setNotificaciones(data);
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        setCargandoNotis(false);
      }
    };
    cargarNotis();
    const intervalo = setInterval(cargarNotis, 10000);
    return () => clearInterval(intervalo);
  }, []);

  const marcarLeida = async (id: string) => {
    try {
      await fetch(`http://brown-lark-804410.hostingersite.com/notificaciones/${id}/leida`, {
        method: "PUT",
      });
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch (error) {
      console.error("Error al marcar notificacion:", error);
    }
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="tiendas-page contenedor">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <h1 className="titulo" style={{ margin: 0 }}>Tiendas Disponibles</h1>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMostrarNotis(!mostrarNotis)}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "28px",
            }}
          >
            🔔
            {noLeidas > 0 && (
              <span style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "#ef4444",
                color: "white",
                fontSize: "11px",
                fontWeight: "bold",
                borderRadius: "9999px",
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {noLeidas}
              </span>
            )}
          </button>

          {mostrarNotis && (
            <div style={{
              position: "absolute",
              right: 0,
              marginTop: "8px",
              width: "320px",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              border: "1px solid #e2e8f0",
              zIndex: 50,
              maxHeight: "384px",
              overflowY: "auto",
            }}>
              <div style={{ padding: "16px", borderBottom: "1px solid #f1f5f9" }}>
                <p style={{ fontWeight: "bold", color: "#1e3a8a", margin: 0 }}>Notificaciones</p>
              </div>
              {cargandoNotis ? (
                <p style={{ padding: "16px", color: "#94a3b8", fontSize: "14px" }}>Cargando...</p>
              ) : notificaciones.length === 0 ? (
                <p style={{ padding: "16px", color: "#94a3b8", fontSize: "14px" }}>No tienes notificaciones.</p>
              ) : (
                notificaciones.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => marcarLeida(n.id)}
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #f8fafc",
                      cursor: "pointer",
                      background: !n.leida ? "#ecfeff" : "white",
                    }}
                  >
                    <p style={{ fontSize: "14px", color: "#334155", margin: 0 }}>{n.mensaje}</p>
                    {!n.leida && (
                      <span style={{ fontSize: "12px", color: "#0891b2", fontWeight: "600" }}>● Nueva</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {cargando ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Cargando tiendas...
        </p>
      ) : tiendas.length === 0 ? (
        <p style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
          Aún no hay tiendas disponibles.
        </p>
      ) : (
        <div className="gridTiendas">
          {tiendas.map((tienda) => (
            <div
              key={tienda.id}
              className="card"
              onClick={() => router.push(`/cliente/tiendas/${tienda.id}`)}
            >
              <div
                className="portada"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                  height: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "48px",
                }}
              >
                🏪
              </div>
              <div className="contenido">
                <h2>{tienda.nombreNegocio}</h2>
                <p>{tienda.descripcion}</p>
                <button className="boton">Entrar a la tienda</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
