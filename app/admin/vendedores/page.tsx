"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">

      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold text-white">Gestión de Vendedores</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Gestión de Vendedores</h1>
          <p className="text-slate-500 mt-1">Revisa solicitudes y administra las tiendas de Lumya</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-5 text-center font-semibold text-sm">
            ⚠️ {error}
          </div>
        )}

        {cargando ? (
          <div className="text-center py-16 text-slate-400">Cargando vendedores...</div>
        ) : vendedores.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Aún no hay vendedores registrados.</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-cyan-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-blue-900">Negocio</th>
                  <th className="px-6 py-4 text-sm font-semibold text-blue-900">Propietario</th>
                  <th className="px-6 py-4 text-sm font-semibold text-blue-900">Correo</th>
                  <th className="px-6 py-4 text-sm font-semibold text-blue-900">Estado</th>
                  <th className="px-6 py-4 text-sm font-semibold text-blue-900 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vendedores.map((vendedor, index) => (
                  <tr
                    key={vendedor.id}
                    className={index !== vendedores.length - 1 ? "border-b border-slate-100" : ""}
                  >
                    <td className="px-6 py-4 font-medium text-blue-900">{vendedor.nombreNegocio}</td>
                    <td className="px-6 py-4 text-slate-500">{vendedor.nombre}</td>
                    <td className="px-6 py-4 text-slate-500">{vendedor.correo}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${estiloEstado[vendedor.estado]}`}>
                        {textoEstado[vendedor.estado]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {vendedor.estado === "pendiente" ? (
                        <Link href={`/admin/vendedores/nuevo?id=${vendedor.id}`}>
                          <button className="text-cyan-700 hover:text-cyan-900 text-sm font-semibold">
                            Revisar solicitud
                          </button>
                        </Link>
                      ) : (
                        <>
                          <Link href={`/admin/vendedores/editar?id=${vendedor.id}`}>
                           
                          </Link>
                          <button
                            onClick={() =>
                              cambiarEstado(
                                vendedor.id,
                                vendedor.estado === "activo" ? "suspendido" : "activo"
                              )
                            }
                            disabled={actualizandoId === vendedor.id}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold disabled:opacity-50"
                          >
                            {actualizandoId === vendedor.id
                              ? "..."
                              : vendedor.estado === "activo"
                              ? "Suspender"
                              : "Reactivar"}
                          </button>
                        </>
                      )}
                    </td>
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