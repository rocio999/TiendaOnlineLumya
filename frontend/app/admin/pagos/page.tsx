"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { registrarAuditoria } from "@/lib/auditoria";

interface Pago {
  id: string;
  cliente: string;
  vendedor: string;
  producto: string;
  monto: number;
  fecha: string;
  comprobante: string;
  estado: string;
  usuarioId: string;
}

export default function AprobarPagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    const cargarPagos = async () => {
      try {
        const pagosSnap = await getDocs(collection(db, "pagos"));

        const usuariosSnap = await getDocs(collection(db, "usuarios"));
        const mapaUsuarios: Record<string, string> = {};
        usuariosSnap.docs.forEach((u) => {
          mapaUsuarios[u.id] = u.data().nombreNegocio || u.data().nombre || "Desconocido";
        });

        const lista: Pago[] = pagosSnap.docs.map((p) => {
          const data = p.data();
          const fechaTexto = data.fecha?.toDate
            ? data.fecha.toDate().toLocaleDateString("es-EC")
            : (data.fecha || "Sin fecha");

          return {
            id: p.id,
            cliente: mapaUsuarios[data.usuarioId] || data.clienteNombre || "Cliente desconocido",
            vendedor: mapaUsuarios[data.vendedorId] || data.vendedorNombre || "Vendedor desconocido",
            producto: data.producto || data.productoNombre || "Producto",
            monto: data.monto || 0,
            fecha: fechaTexto,
            comprobante: data.comprobante || "sin_comprobante.jpg",
            estado: data.estado || "pendiente",
            usuarioId: data.usuarioId || "",
          };
        });

        setPagos(lista);
      } catch (error) {
        console.error("Error al cargar pagos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarPagos();
  }, []);

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    setActualizandoId(id);
    try {
      await updateDoc(doc(db, "pagos", id), { estado: nuevoEstado });
      const pago = pagos.find((p) => p.id === id);
      const accion =
        nuevoEstado === "aprobado" ? "Aprobó" :
        nuevoEstado === "rechazado" ? "Rechazó" :
        "Revirtió a pendiente";
      await registrarAuditoria(
        pago?.usuarioId || "admin",
        `${accion} el pago de ${pago?.producto} - $${pago?.monto} (${pago?.cliente})`,
        "pago"
      );
      setPagos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (error) {
      console.error("Error al cambiar estado del pago:", error);
    } finally {
      setActualizandoId(null);
    }
  };

  const pagosFiltrados = pagos.filter((p) =>
    filtro === "Todos" || p.estado === filtro.toLowerCase()
  );

  const totalPendiente = pagos.filter(p => p.estado === "pendiente").reduce((acc, p) => acc + p.monto, 0);
  const totalAprobado = pagos.filter(p => p.estado === "aprobado").reduce((acc, p) => acc + p.monto, 0);

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

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image src="/logo-lumya.png" alt="Lumya" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold text-white">Aprobar Pagos</span>
          </div>
          <span className="bg-cyan-400 text-blue-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ADMIN
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-yellow-500">{pagos.filter(p => p.estado === "pendiente").length}</p>
            <p className="text-slate-400 text-sm">Pendientes</p>
            <p className="text-yellow-500 font-bold text-sm">${totalPendiente}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-green-600">{pagos.filter(p => p.estado === "aprobado").length}</p>
            <p className="text-slate-400 text-sm">Aprobados</p>
            <p className="text-green-600 font-bold text-sm">${totalAprobado}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-red-500">{pagos.filter(p => p.estado === "rechazado").length}</p>
            <p className="text-slate-400 text-sm">Rechazados</p>
          </div>
        </div>

        {/* Filtros */}
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

        {/* Lista pagos */}
        {cargando ? (
          <div className="text-center py-16 text-slate-400">Cargando pagos...</div>
        ) : pagosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No hay pagos que coincidan.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {pagosFiltrados.map((pago) => (
              <div
                key={pago.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{pago.producto}</p>
                    <p className="text-slate-400 text-sm">Cliente: {pago.cliente}</p>
                    <p className="text-slate-400 text-sm">Vendedor: {pago.vendedor}</p>
                    <p className="text-slate-400 text-sm">Fecha: {pago.fecha}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900">${pago.monto}</p>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${estiloEstado[pago.estado]}`}>
                      {textoEstado[pago.estado]}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 mb-3 flex items-center gap-2">
                  <span className="text-xl">📄</span>
                  <p className="text-sm text-slate-600 font-medium">{pago.comprobante}</p>
                  <button className="ml-auto text-blue-500 text-sm font-semibold hover:text-blue-700 transition">
                    Ver comprobante
                  </button>
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

                {pago.estado !== "pendiente" && (
                  <button
                    onClick={() => cambiarEstado(pago.id, "pendiente")}
                    disabled={actualizandoId === pago.id}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 rounded-xl transition text-sm disabled:opacity-50"
                  >
                    {actualizandoId === pago.id ? "..." : "Revertir a Pendiente"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}