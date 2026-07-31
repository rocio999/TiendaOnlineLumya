"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function MisPagos() {
  const [pagos, setPagos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("Todos");
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPagos = async () => {
      const vendedorId = localStorage.getItem("vendedorId");
      if (!vendedorId) {
        setCargando(false);
        return;
      }
      try {
        const res = await fetch("http://localhost:3001/pagos");
        const data = await res.json();
        if (!res.ok) {
          setError("No se pudieron cargar los pagos");
          return;
        }
        const misPagos = data.filter((p: any) => p.vendedorId === vendedorId);
        setPagos(misPagos);
      } catch (err) {
        console.error("Error al cargar pagos:", err);
        setError("No se pudo conectar con el servidor.");
      } finally {
        setCargando(false);
      }
    };
    cargarPagos();
  }, []);

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    setActualizandoId(id);
    try {
      const res = await fetch(`http://localhost:3001/pagos/${id}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) return;
      setPagos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    } finally {
      setActualizandoId(null);
    }
  };

  const pagosFiltrados = pagos.filter((p) =>
    filtro === "Todos" || p.estado === filtro.toLowerCase()
  );

  const totalPendiente = pagos.filter((p) => p.estado === "pendiente").reduce((acc, p) => acc + p.monto, 0);
  const totalAprobado = pagos.filter((p) => p.estado === "aprobado").reduce((acc, p) => acc + p.monto, 0);

  const estiloEstado: Record<string, string> = {
    pendiente: "bg-yellow-100 text-yellow-700",
    aprobado: "bg-green-100 text-green-700",
    rechazado: "bg-red-100 text-red-600",
  };

  const textoEstado: Record<string, string> = {
    pendiente: "Pendiente",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
  };

  const formatearFecha = (fecha: any) => {
    if (!fecha) return "Sin fecha";
    if (fecha._seconds) {
      return new Date(fecha._seconds * 1000).toLocaleDateString("es-EC");
    }
    return "Sin fecha";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">

      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/vendedor">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold text-white">Mis Pagos</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-5 text-center font-semibold text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-yellow-500">{pagos.filter((p) => p.estado === "pendiente").length}</p>
            <p className="text-slate-400 text-sm">Pendientes</p>
            <p className="text-yellow-500 font-bold text-sm">${totalPendiente}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-green-600">{pagos.filter((p) => p.estado === "aprobado").length}</p>
            <p className="text-slate-400 text-sm">Aprobados</p>
            <p className="text-green-600 font-bold text-sm">${totalAprobado}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-red-500">{pagos.filter((p) => p.estado === "rechazado").length}</p>
            <p className="text-slate-400 text-sm">Rechazados</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6 flex-wrap">
          {["Todos", "Pendiente", "Aprobado", "Rechazado"].map((f) => (
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

        {cargando ? (
          <div className="text-center py-16 text-slate-400">Cargando pagos...</div>
        ) : pagosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No tienes pagos que coincidan.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {pagosFiltrados.map((pago) => (
              <div key={pago.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{pago.producto}</p>
                    <p className="text-slate-400 text-sm">Cliente: {pago.clienteNombreResuelto}</p>
                    <p className="text-slate-400 text-sm">Fecha: {formatearFecha(pago.fecha)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900">${pago.monto}</p>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${estiloEstado[pago.estado]}`}>
                      {textoEstado[pago.estado]}
                    </span>
                  </div>
                </div>

                {pago.estado === "pendiente" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => cambiarEstado(pago.id, "aprobado")}
                      disabled={actualizandoId === pago.id}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl transition disabled:opacity-50"
                    >
                      {actualizandoId === pago.id ? "..." : "✓ Aprobar Pago"}
                    </button>
                    <button
                      onClick={() => cambiarEstado(pago.id, "rechazado")}
                      disabled={actualizandoId === pago.id}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl transition disabled:opacity-50"
                    >
                      {actualizandoId === pago.id ? "..." : "✗ Rechazar Pago"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
