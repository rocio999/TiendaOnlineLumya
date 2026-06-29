"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function AprobarPagos() {
  const [pagos, setPagos] = useState([
    { id: 1, cliente: "María García", vendedor: "Carlos López", producto: "Mochila Urbana", monto: 55, fecha: "25/06/2026", comprobante: "transferencia_001.jpg", estado: "Pendiente" },
    { id: 2, cliente: "Ana Martínez", vendedor: "Carlos López", producto: "Cámara Digital", monto: 350, fecha: "25/06/2026", comprobante: "transferencia_002.jpg", estado: "Pendiente" },
    { id: 3, cliente: "Laura Sánchez", vendedor: "Pedro Rodríguez", producto: "Zapatillas Runner", monto: 90, fecha: "24/06/2026", comprobante: "transferencia_003.jpg", estado: "Aprobado" },
    { id: 4, cliente: "Juan Torres", vendedor: "Pedro Rodríguez", producto: "Reloj Inteligente", monto: 199, fecha: "24/06/2026", comprobante: "transferencia_004.jpg", estado: "Rechazado" },
    { id: 5, cliente: "María García", vendedor: "Carlos López", producto: "Camiseta Deportiva", monto: 25, fecha: "23/06/2026", comprobante: "transferencia_005.jpg", estado: "Aprobado" },
  ]);

  const [filtro, setFiltro] = useState("Todos");

  const cambiarEstado = (id: number, nuevoEstado: string) => {
    setPagos(pagos.map((p) =>
      p.id === id ? { ...p, estado: nuevoEstado } : p
    ));
  };

  const pagosFiltrados = pagos.filter((p) =>
    filtro === "Todos" || p.estado === filtro
  );

  const totalPendiente = pagos.filter(p => p.estado === "Pendiente").reduce((acc, p) => acc + p.monto, 0);
  const totalAprobado = pagos.filter(p => p.estado === "Aprobado").reduce((acc, p) => acc + p.monto, 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-4 py-4 sticky top-0 z-50 shadow-lg">
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
          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ADMIN
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-yellow-500">{pagos.filter(p => p.estado === "Pendiente").length}</p>
            <p className="text-gray-400 text-sm">Pendientes</p>
            <p className="text-yellow-500 font-bold text-sm">${totalPendiente}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{pagos.filter(p => p.estado === "Aprobado").length}</p>
            <p className="text-gray-400 text-sm">Aprobados</p>
            <p className="text-green-600 font-bold text-sm">${totalAprobado}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-red-500">{pagos.filter(p => p.estado === "Rechazado").length}</p>
            <p className="text-gray-400 text-sm">Rechazados</p>
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
                  ? "bg-blue-700 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Lista pagos */}
        <div className="flex flex-col gap-4">
          {pagosFiltrados.map((pago) => (
            <div
              key={pago.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              {/* Info principal */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800 text-lg">{pago.producto}</p>
                  <p className="text-gray-400 text-sm">Cliente: {pago.cliente}</p>
                  <p className="text-gray-400 text-sm">Vendedor: {pago.vendedor}</p>
                  <p className="text-gray-400 text-sm">Fecha: {pago.fecha}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-900">${pago.monto}</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                    pago.estado === "Pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : pago.estado === "Aprobado"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {pago.estado}
                  </span>
                </div>
              </div>

              {/* Comprobante */}
              <div className="bg-gray-50 rounded-xl p-3 mb-3 flex items-center gap-2">
                <span className="text-xl">📄</span>
                <p className="text-sm text-gray-600 font-medium">{pago.comprobante}</p>
                <button className="ml-auto text-blue-500 text-sm font-semibold hover:text-blue-700 transition">
                  Ver comprobante
                </button>
              </div>

              {/* Botones acción */}
              {pago.estado === "Pendiente" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => cambiarEstado(pago.id, "Aprobado")}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl transition"
                  >
                    ✓ Aprobar Pago
                  </button>
                  <button
                    onClick={() => cambiarEstado(pago.id, "Rechazado")}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl transition"
                  >
                    ✗ Rechazar Pago
                  </button>
                </div>
              )}

              {pago.estado !== "Pendiente" && (
                <button
                  onClick={() => cambiarEstado(pago.id, "Pendiente")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-xl transition text-sm"
                >
                  Revertir a Pendiente
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}