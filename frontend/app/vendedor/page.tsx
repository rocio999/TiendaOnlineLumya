"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

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
          `http://localhost:3001/notificaciones/${vendedorId}`,
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
      await fetch(`http://localhost:3001/notificaciones/${id}/leida`, {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-lumya.png"
              alt="Lumya"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-white">
              Panel de Vendedor
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setMostrarNotis(!mostrarNotis)}
                className="relative text-white hover:bg-white/20 p-2 rounded-xl transition"
              >
                <span className="text-2xl">🔔</span>

                {noLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {noLeidas}
                  </span>
                )}
              </button>

              <p
                style={{
                  fontSize: "10px",
                  color: "white",
                  marginTop: "4px",
                }}
              >
                Ult: {ultimaActualizacion}
              </p>

              {mostrarNotis && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-slate-100">
                    <p className="font-bold text-blue-900">
                      Notificaciones
                    </p>
                  </div>

                  {cargando ? (
                    <p className="p-4 text-slate-400 text-sm">
                      Cargando...
                    </p>
                  ) : notificaciones.length === 0 ? (
                    <p className="p-4 text-slate-400 text-sm">
                      No tienes notificaciones.
                    </p>
                  ) : (
                    notificaciones.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => marcarLeida(n.id)}
                        className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition ${
                          !n.leida ? "bg-cyan-50" : ""
                        }`}
                      >
                        <p className="text-sm text-slate-700">
                          {n.mensaje}
                        </p>

                        {!n.leida && (
                          <span className="text-xs text-cyan-600 font-semibold">
                            ● Nueva
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Botón de sesión */}
            {sesionActiva ? (
              <button
                onClick={cerrarSesion}
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold z-10 relative cursor-pointer"
              >
                Cerrar sesión
              </button>
            ) : (
              <button
                onClick={() => router.push("/vendedor/login")}
                type="button"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold z-10 relative cursor-pointer"
              >
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Resto del contenido */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">
            Bienvenido
          </h1>
          <p className="text-slate-500 mt-1">
            Aquí puedes gestionar tus productos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/vendedor/productos">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition cursor-pointer flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">📦</span>
              </div>

              <h2 className="text-lg font-bold text-blue-900 mb-1">
                Mis Productos
              </h2>

              <p className="text-slate-400 text-sm">
                Ver y gestionar tus productos
              </p>
            </div>
          </Link>

          <Link href="/vendedor/productos/nuevo">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition cursor-pointer flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">➕</span>
              </div>

              <h2 className="text-lg font-bold text-blue-900 mb-1">
                Subir Producto
              </h2>

              <p className="text-slate-400 text-sm">
                Publicar un nuevo producto
              </p>
            </div>
          </Link>

          <Link href="/vendedor/perfil">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-slate-200 hover:shadow-lg hover:border-cyan-300 transition cursor-pointer flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-3xl">👤</span>
              </div>

              <h2 className="text-lg font-bold text-blue-900 mb-1">
                Mi Perfil
              </h2>

              <p className="text-slate-400 text-sm">
                Ver y editar tu información
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/vendedor/panel">
            <button className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 font-semibold">
              Panel del administracion
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}