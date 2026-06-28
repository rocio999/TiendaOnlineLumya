"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Auditoria() {
  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const registros = [
    { id: 1, usuario: "Carlos López", rol: "Vendedor", accion: "Subió producto", detalle: "Mochila Urbana - $55", fecha: "28/06/2026", hora: "09:15", tipo: "Producto" },
    { id: 2, usuario: "Admin", rol: "Admin", accion: "Suspendió usuario", detalle: "Juan Torres - Cliente", fecha: "28/06/2026", hora: "09:30", tipo: "Usuario" },
    { id: 3, usuario: "María García", rol: "Cliente", accion: "Realizó compra", detalle: "Mochila Urbana - $55", fecha: "28/06/2026", hora: "10:00", tipo: "Pago" },
    { id: 4, usuario: "Admin", rol: "Admin", accion: "Aprobó pago", detalle: "Transferencia #003 - $90", fecha: "28/06/2026", hora: "10:15", tipo: "Pago" },
    { id: 5, usuario: "Pedro Rodríguez", rol: "Vendedor", accion: "Subió producto", detalle: "Reloj Inteligente - $199", fecha: "27/06/2026", hora: "14:00", tipo: "Producto" },
    { id: 6, usuario: "Admin", rol: "Admin", accion: "Rechazó pago", detalle: "Transferencia #004 - $199", fecha: "27/06/2026", hora: "14:30", tipo: "Pago" },
    { id: 7, usuario: "Ana Martínez", rol: "Cliente", accion: "Realizó compra", detalle: "Cámara Digital - $350", fecha: "27/06/2026", hora: "15:00", tipo: "Pago" },
    { id: 8, usuario: "Carlos López", rol: "Vendedor", accion: "Actualizó producto", detalle: "Zapatillas Runner - stock actualizado", fecha: "26/06/2026", hora: "11:00", tipo: "Producto" },
  ];

  const registrosFiltrados = registros.filter((r) => {
    const coincideFiltro = filtro === "Todos" || r.tipo === filtro;
    const coincideBusqueda =
      r.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.accion.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.detalle.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  const getColor = (tipo: string) => {
    switch (tipo) {
      case "Pago": return "bg-green-100 text-green-700";
      case "Producto": return "bg-blue-100 text-blue-700";
      case "Usuario": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getEmoji = (tipo: string) => {
    switch (tipo) {
      case "Pago": return "💳";
      case "Producto": return "📦";
      case "Usuario": return "👤";
      default: return "📋";
    }
  };

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
            <span className="text-xl font-bold text-white">Historial de Actividad</span>
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
            <p className="text-2xl font-bold text-blue-700">{registros.length}</p>
            <p className="text-gray-400 text-sm">Total Registros</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{registros.filter(r => r.tipo === "Pago").length}</p>
            <p className="text-gray-400 text-sm">Pagos</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-purple-600">{registros.filter(r => r.tipo === "Producto").length}</p>
            <p className="text-gray-400 text-sm">Productos</p>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por usuario, acción o detalle..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 shadow-sm"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["Todos", "Pago", "Producto", "Usuario"].map((f) => (
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

        {/* Lista registros */}
        <div className="flex flex-col gap-3">
          {registrosFiltrados.map((registro) => (
            <div
              key={registro.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              {/* Icono */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getColor(registro.tipo)}`}>
                <span className="text-2xl">{getEmoji(registro.tipo)}</span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-800">{registro.accion}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getColor(registro.tipo)}`}>
                    {registro.tipo}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{registro.detalle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">Por: {registro.usuario}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    registro.rol === "Admin"
                      ? "bg-yellow-100 text-yellow-700"
                      : registro.rol === "Vendedor"
                      ? "bg-cyan-100 text-cyan-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {registro.rol}
                  </span>
                </div>
              </div>

              {/* Fecha */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-600">{registro.fecha}</p>
                <p className="text-xs text-gray-400">{registro.hora}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}