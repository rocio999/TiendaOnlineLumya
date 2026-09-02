"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./vendedores.css";

interface Vendedor {
  id: string;
  nombreNegocio: string;
  nombre: string;
  correo: string;
  estado: string;
}

const estiloEstado: Record<string, string> = {
  activo: "bg-emerald-100 text-emerald-700",
  pendiente: "bg-yellow-100 text-yellow-700",
  suspendido: "bg-red-100 text-red-700",
};

const textoEstado: Record<string, string> = {
  activo: "Activo",
  pendiente: "Pendiente",
  suspendido: "Suspendido",
};

export default function GestionVendedores() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const cargarVendedores = async () => {
    try {
      const res = await fetch("http://brown-lark-804410.hostingersite.com/vendedores");
      const data = await res.json();
      if (!res.ok) {
        setError("No se pudieron cargar los vendedores");
        return;
      }
      setVendedores(data);
    } catch (err) {
      console.error("Error al cargar vendedores:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarVendedores();
  }, []);

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    setActualizandoId(id);
    try {
      const res = await fetch(`http://brown-lark-804410.hostingersite.com/vendedores/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": "lumya-admin-2026" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) {
        console.error("Error al cambiar estado");
        return;
      }

      setVendedores((prev) =>
        prev.map((v) => (v.id === id ? { ...v, estado: nuevoEstado } : v))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    } finally {
      setActualizandoId(null);
    }
  };

 return (
  <div className="vendedores-page">

    {/* HEADER */}
    <header className="vendedores-header">
      <div className="vendedores-header-inner">

        <Link href="/admin" className="btn-volver">
          <span>←</span>
          Volver al administrador
        </Link>

        <div className="header-brand">
          <Image
            src="/logo-lumya.png"
            alt="Lumya"
            width={42}
            height={42}
            className="header-logo"
          />

          <div>
            <h1>Gestión de Vendedores</h1>
            <p>Panel de administración</p>
          </div>
        </div>

        <div className="admin-badge">
          <span>●</span>
          ADMIN
        </div>

      </div>
    </header>

    {/* CONTENIDO */}
    <main className="vendedores-content">

      <div className="page-title">
        <div>
          <div className="title-icon">🏪</div>

          <div>
            <h2>Vendedores</h2>
            <p>
              Administra las tiendas y solicitudes de vendedores de Lumya.
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="error-box">
          <span>⚠️</span>
          <div>
            <strong>Ocurrió un problema</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* ESTADÍSTICAS */}
      {!cargando && (
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon blue">
              👥
            </div>

            <div>
              <span>Total vendedores</span>
              <strong>{vendedores.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <span>Tiendas activas</span>
              <strong>
                {vendedores.filter((v) => v.estado === "activo").length}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon yellow">
              ⏳
            </div>

            <div>
              <span>Solicitudes pendientes</span>
              <strong>
                {vendedores.filter((v) => v.estado === "pendiente").length}
              </strong>
            </div>
          </div>

        </div>
      )}

      {/* ENCABEZADO LISTA */}
      {!cargando && vendedores.length > 0 && (
        <div className="list-header">
          <div>
            <h3>Listado de vendedores</h3>
            <p>
              Consulta y administra el estado de cada vendedor.
            </p>
          </div>

          <span className="total-badge">
            {vendedores.length} registrados
          </span>
        </div>
      )}

      {/* CARGANDO */}
      {cargando ? (
        <div className="loading-card">
          <div className="spinner"></div>
          <h3>Cargando vendedores</h3>
          <p>Estamos obteniendo la información...</p>
        </div>

      ) : vendedores.length === 0 ? (

        /* SIN VENDEDORES */
        <div className="empty-card">
          <div className="empty-icon">
            🏪
          </div>

          <h3>Aún no hay vendedores</h3>

          <p>
            Cuando un vendedor se registre, aparecerá aquí para que
            puedas administrar su tienda.
          </p>

          <Link href="/admin" className="empty-button">
            Volver al administrador
          </Link>
        </div>

      ) : (

        <>
          {/* TABLA DESKTOP */}
          <div className="vendedores-table-container">

            <table className="vendedores-table">

              <thead>
                <tr>
                  <th>NEGOCIO</th>
                  <th>PROPIETARIO</th>
                  <th>CORREO ELECTRÓNICO</th>
                  <th>ESTADO</th>
                  <th className="acciones-header">ACCIONES</th>
                </tr>
              </thead>

              <tbody>

                {vendedores.map((vendedor) => (

                  <tr key={vendedor.id}>

                    {/* NEGOCIO */}
                    <td>
                      <div className="negocio-cell">

                        <div className="negocio-avatar">
                          {vendedor.nombreNegocio
                            ? vendedor.nombreNegocio.charAt(0).toUpperCase()
                            : "L"}
                        </div>

                        <div>
                          <strong>{vendedor.nombreNegocio}</strong>
                          <span>Tiendas Lumya</span>
                        </div>

                      </div>
                    </td>

                    {/* PROPIETARIO */}
                    <td>
                      <div className="propietario-cell">
                        <div className="person-icon">
                          👤
                        </div>

                        <span>{vendedor.nombre}</span>
                      </div>
                    </td>

                    {/* CORREO */}
                    <td>
                      <span className="correo-cell">
                        ✉ {vendedor.correo}
                      </span>
                    </td>

                    {/* ESTADO */}
                    <td>
                      <span
                        className={`estado-badge estado-${vendedor.estado}`}
                      >
                        <span className="estado-dot"></span>

                        {textoEstado[vendedor.estado] ||
                          vendedor.estado}
                      </span>
                    </td>

                    {/* ACCIONES */}
                    <td>

                      <div className="acciones-cell">

                        {vendedor.estado === "pendiente" ? (

                          <Link
                            href={`/admin/vendedores/nuevo?id=${vendedor.id}`}
                            className="btn-revisar"
                          >
                            <span>👁</span>
                            Revisar solicitud
                          </Link>

                        ) : (

                          <>
                            <Link
                              href={`/admin/vendedores/editar?id=${vendedor.id}`}
                              className="btn-editar"
                            >
                              ✏ Editar
                            </Link>

                            <button
                              onClick={() =>
                                cambiarEstado(
                                  vendedor.id,
                                  vendedor.estado === "activo"
                                    ? "suspendido"
                                    : "activo"
                                )
                              }
                              disabled={
                                actualizandoId === vendedor.id
                              }
                              className={
                                vendedor.estado === "activo"
                                  ? "btn-suspender"
                                  : "btn-reactivar"
                              }
                            >
                              {actualizandoId === vendedor.id
                                ? "..."
                                : vendedor.estado === "activo"
                                ? "⏸ Suspender"
                                : "▶ Reactivar"}
                            </button>
                          </>

                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* CARDS MOBILE */}
          <div className="vendedores-mobile">

            {vendedores.map((vendedor) => (

              <div
                className="vendedor-mobile-card"
                key={vendedor.id}
              >

                <div className="mobile-card-top">

                  <div className="negocio-cell">

                    <div className="negocio-avatar">
                      {vendedor.nombreNegocio
                        ? vendedor.nombreNegocio.charAt(0).toUpperCase()
                        : "L"}
                    </div>

                    <div>
                      <strong>{vendedor.nombreNegocio}</strong>
                      <span>Tiendas Lumya</span>
                    </div>

                  </div>

                  <span
                    className={`estado-badge estado-${vendedor.estado}`}
                  >
                    <span className="estado-dot"></span>

                    {textoEstado[vendedor.estado] ||
                      vendedor.estado}
                  </span>

                </div>

                <div className="mobile-info">

                  <div>
                    <span>Propietario</span>
                    <strong>{vendedor.nombre}</strong>
                  </div>

                  <div>
                    <span>Correo</span>
                    <strong>{vendedor.correo}</strong>
                  </div>

                </div>

                <div className="mobile-actions">

                  {vendedor.estado === "pendiente" ? (

                    <Link
                      href={`/admin/vendedores/nuevo?id=${vendedor.id}`}
                      className="btn-revisar mobile-button"
                    >
                      👁 Revisar solicitud
                    </Link>

                  ) : (

                    <>
                      <Link
                        href={`/admin/vendedores/editar?id=${vendedor.id}`}
                        className="btn-editar mobile-button"
                      >
                        ✏ Editar
                      </Link>

                      <button
                        onClick={() =>
                          cambiarEstado(
                            vendedor.id,
                            vendedor.estado === "activo"
                              ? "suspendido"
                              : "activo"
                          )
                        }
                        disabled={
                          actualizandoId === vendedor.id
                        }
                        className={
                          vendedor.estado === "activo"
                            ? "btn-suspender mobile-button"
                            : "btn-reactivar mobile-button"
                        }
                      >
                        {actualizandoId === vendedor.id
                          ? "..."
                          : vendedor.estado === "activo"
                          ? "⏸ Suspender"
                          : "▶ Reactivar"}
                      </button>
                    </>

                  )}

                </div>

              </div>

            ))}

          </div>
        </>

      )}

    </main>

  </div>
);
}