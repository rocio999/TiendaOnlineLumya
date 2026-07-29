"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
}

const estiloEstado: Record<string, string> = {
  activo: "bg-green-100 text-green-700",
  pendiente: "bg-yellow-100 text-yellow-700",
  suspendido: "bg-red-100 text-red-600",
  rechazado: "bg-slate-200 text-slate-600",
};

const textoEstado: Record<string, string> = {
  activo: "Activo",
  pendiente: "Pendiente",
  suspendido: "Suspendido",
  rechazado: "Rechazado",
};

const estiloRol: Record<string, string> = {
  vendedor: "bg-cyan-100 text-cyan-700",
  cliente: "bg-blue-100 text-blue-700",
  admin: "bg-purple-100 text-purple-700",
};

const textoRol: Record<string, string> = {
  vendedor: "Vendedor",
  cliente: "Cliente",
  admin: "Admin",
};

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:3001/usuarios");
        const data = await res.json();
        if (!res.ok) {
          setError("No se pudieron cargar los usuarios");
          return;
        }
        const lista: Usuario[] = data.map((d: any) => ({
          id: d.id,
          nombre: d.nombre || d.nombreNegocio || "Sin nombre",
          correo: d.correo || "",
          rol: d.rol || "cliente",
          estado: d.estado || "activo",
        }));
        setUsuarios(lista);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    };
    cargarUsuarios();
  }, []);

  const toggleEstado = async (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === "activo" ? "suspendido" : "activo";
    setActualizandoId(id);
    try {
      const res = await fetch(`http://localhost:3001/usuarios/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": "lumya-admin-2026" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) {
        console.error("Error al cambiar estado");
        return;
      }

      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, estado: nuevoEstado } : u))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    } finally {
      setActualizandoId(null);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideFiltro =
      filtro === "Todos" ||
      (filtro === "Cliente" && u.rol === "cliente") ||
      (filtro === "Vendedor" && u.rol === "vendedor") ||
      (filtro === "Activo" && u.estado === "activo") ||
      (filtro === "Suspendido" && u.estado === "suspendido");
    const coincideBusqueda =
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image src="/logo-lumya.png" alt="Lumya" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold text-white">Gestión de Usuarios</span>
          </div>
          <span className="bg-cyan-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ADMIN
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-5 text-center font-semibold text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-sm"
          />
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {["Todos", "Cliente", "Vendedor", "Activo", "Suspendido"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${
                filtro === f
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-cyan-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-blue-800">{usuarios.length}</p>
            <p className="text-slate-400 text-sm">Total</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-green-600">{usuarios.filter(u => u.estado === "activo").length}</p>
            <p className="text-slate-400 text-sm">Activos</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-red-500">{usuarios.filter(u => u.estado === "suspendido").length}</p>
            <p className="text-slate-400 text-sm">Suspendidos</p>
          </div>
        </div>

        {cargando ? (
          <div className="text-center py-16 text-slate-400">Cargando usuarios...</div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No hay usuarios que coincidan.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {usuariosFiltrados.map((usuario) => (
              <div
                key={usuario.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg ${
                  estiloRol[usuario.rol] || "bg-slate-100 text-slate-600"
                }`}>
                  {usuario.nombre.charAt(0)}
                </div>

                <div className="flex-1">
                  <p className="font-bold text-slate-800">{usuario.nombre}</p>
                  <p className="text-slate-400 text-sm">{usuario.correo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      estiloRol[usuario.rol] || "bg-slate-100 text-slate-600"
                    }`}>
                      {textoRol[usuario.rol] || usuario.rol}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                    estiloEstado[usuario.estado] || "bg-slate-100 text-slate-600"
                  }`}>
                    {textoEstado[usuario.estado] || usuario.estado}
                  </span>
                  {(usuario.estado === "activo" || usuario.estado === "suspendido") && (
                    <button
                      onClick={() => toggleEstado(usuario.id, usuario.estado)}
                      disabled={actualizandoId === usuario.id}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg transition whitespace-nowrap disabled:opacity-50 ${
                        usuario.estado === "activo"
                          ? "bg-red-50 text-red-500 hover:bg-red-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {actualizandoId === usuario.id ? "..." : usuario.estado === "activo" ? "Suspender" : "Activar"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}