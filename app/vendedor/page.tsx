"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./panel-vendedor.css";

interface Notificacion {
  id: string;
  usuarioId: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
}

import { useRouter } from "next/navigation";

export default function PanelVendedor() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mostrarNotis, setMostrarNotis] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");
  const [sesionActiva, setSesionActiva] = useState(false);

  useEffect(() => {
    const cargarNotis = async () => {
      const vendedorId = localStorage.getItem("vendedorId");

      if (!vendedorId) {
        setSesionActiva(false);
        setCargando(false);
        return;
      }

      setSesionActiva(true);

      try {
        const res = await fetch(
          `http://brown-lark-804410.hostingersite.com/notificaciones/${vendedorId}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (res.ok) setNotificaciones(data);

        setUltimaActualizacion(new Date().toLocaleTimeString());
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        setCargando(false);
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

  const cerrarSesion = () => {
    localStorage.removeItem("vendedorId");
    setSesionActiva(false);
    router.push("/vendedor/login");
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

 return (
  <div className="panel-vendedor">

    {/* HEADER */}
    <header className="pv-header">
      <div className="pv-header-content">

        <div className="pv-brand">
          <Image
            src="/logo-lumya.png"
            alt="Lumya"
            width={45}
            height={45}
            className="pv-logo"
          />

          <div>
            <h1>Panel de Vendedor</h1>
            <span>Administración de tu tienda</span>
          </div>
        </div>

        <div className="pv-header-actions">

          {/* NOTIFICACIONES */}
          <div className="pv-notification-wrapper">

            <button
              onClick={() => setMostrarNotis(!mostrarNotis)}
              className="pv-notification-button"
            >
              <span className="pv-bell">🔔</span>

              {noLeidas > 0 && (
                <span className="pv-notification-count">
                  {noLeidas}
                </span>
              )}
            </button>

            <p className="pv-update">
              Ult. {ultimaActualizacion}
            </p>

            {mostrarNotis && (
              <div className="pv-notifications">

                <div className="pv-notifications-header">
                  <div>
                    <strong>Notificaciones</strong>
                    <span>
                      {noLeidas > 0
                        ? `${noLeidas} sin leer`
                        : "Todo al día"}
                    </span>
                  </div>

                  <span className="pv-notification-icon">
                    🔔
                  </span>
                </div>

                {cargando ? (
                  <div className="pv-notification-empty">
                    <div className="pv-mini-spinner"></div>
                    <p>Cargando...</p>
                  </div>
                ) : notificaciones.length === 0 ? (
                  <div className="pv-notification-empty">
                    <div className="pv-empty-bell">
                      🔕
                    </div>
                    <strong>No tienes notificaciones</strong>
                    <p>Te avisaremos cuando tengas novedades.</p>
                  </div>
                ) : (
                  <div className="pv-notification-list">

                    {notificaciones.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => marcarLeida(n.id)}
                        className={`pv-notification ${
                          !n.leida ? "pv-notification-unread" : ""
                        }`}
                      >
                        <div className="pv-notification-status">
                          {!n.leida ? "●" : "✓"}
                        </div>

                        <div className="pv-notification-content">
                          <p>{n.mensaje}</p>

                          {!n.leida && (
                            <span>● Nueva notificación</span>
                          )}
                        </div>
                      </div>
                    ))}

                  </div>
                )}

              </div>
            )}

          </div>

          {/* SESIÓN */}
          {sesionActiva ? (
            <button
              onClick={cerrarSesion}
              type="button"
              className="pv-logout"
            >
              <span>↪</span>
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={() => router.push("/vendedor/login")}
              type="button"
              className="pv-login"
            >
              Iniciar sesión
            </button>
          )}

        </div>

      </div>
    </header>

    {/* CONTENIDO */}
    <main className="pv-main">

      <section className="pv-welcome">

        <div>
          <span className="pv-welcome-label">
            PANEL DE CONTROL
          </span>

          <h2>Bienvenido 👋</h2>

          <p>
            Gestiona fácilmente los productos y la información
            de tu tienda en Lumya.
          </p>
        </div>

        <div className="pv-welcome-decoration">
          🏪
        </div>

      </section>

      {/* TARJETAS */}
      <section className="pv-cards">

        <Link
          href="/vendedor/productos"
          className="pv-card-link"
        >
          <div className="pv-card">

            <div className="pv-card-icon pv-blue">
              📦
            </div>

            <div className="pv-card-text">
              <h3>Mis Productos</h3>

              <p>
                Consulta y gestiona todos los productos
                publicados en tu tienda.
              </p>
            </div>

            <div className="pv-card-arrow">
              →
            </div>

          </div>
        </Link>

        <Link
          href="/vendedor/productos/nuevo"
          className="pv-card-link"
        >
          <div className="pv-card">

            <div className="pv-card-icon pv-cyan">
              ＋
            </div>

            <div className="pv-card-text">
              <h3>Subir Producto</h3>

              <p>
                Publica un nuevo producto para que
                tus clientes puedan encontrarlo.
              </p>
            </div>

            <div className="pv-card-arrow">
              →
            </div>

          </div>
        </Link>

        <Link
          href="/vendedor/perfil"
          className="pv-card-link"
        >
          <div className="pv-card">

            <div className="pv-card-icon pv-purple">
              👤
            </div>

            <div className="pv-card-text">
              <h3>Mi Perfil</h3>

              <p>
                Consulta y actualiza la información
                de tu cuenta de vendedor.
              </p>
            </div>

            <div className="pv-card-arrow">
              →
            </div>

          </div>
        </Link>

      </section>

      {/* ACCESO AL PANEL */}
      <section className="pv-admin-section">

        <div className="pv-admin-info">
          <div className="pv-admin-icon">
            ⚙️
          </div>

          <div>
            <h3>Administración de la tienda</h3>
            <p>
              Accede al panel completo para administrar
              tu negocio.
            </p>
          </div>
        </div>

        <Link
          href="/vendedor/panel"
          className="pv-admin-button"
        >
          Ir al panel
          <span>→</span>
        </Link>

      </section>

    </main>

    <footer className="pv-footer">
      <span>© {new Date().getFullYear()} Lumya</span>
      <span>Panel de Vendedor</span>
    </footer>

  </div>
);
} 