"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "María García", email: "maria@gmail.com", rol: "Cliente", estado: "Activo", fecha: "15/01/2026" },
    { id: 2, nombre: "Carlos López", email: "carlos@gmail.com", rol: "Vendedor", estado: "Activo", fecha: "20/01/2026" },
    { id: 3, nombre: "Ana Martínez", email: "ana@gmail.com", rol: "Cliente", estado: "Activo", fecha: "25/01/2026" },
    { id: 4, nombre: "Pedro Rodríguez", email: "pedro@gmail.com", rol: "Vendedor", estado: "Suspendido", fecha: "01/02/2026" },
    { id: 5, nombre: "Laura Sánchez", email: "laura@gmail.com", rol: "Cliente", estado: "Activo", fecha: "05/02/2026" },
    { id: 6, nombre: "Juan Torres", email: "juan@gmail.com", rol: "Cliente", estado: "Suspendido", fecha: "10/02/2026" },
  ]);

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const toggleEstado = (id: number) => {
    setUsuarios(usuarios.map((u) =>
      u.id === id
        ? { ...u, estado: u.estado === "Activo" ? "Suspendido" : "Activo" }
        : u
    ));
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideFiltro = filtro === "Todos" || u.rol === filtro || u.estado === filtro;
    const coincideBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

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
            <span className="text-xl font-bold text-white">Gestión de Usuarios</span>
          </div>
          <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ADMIN
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 shadow-sm"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["Todos", "Cliente", "Vendedor", "Activo", "Suspendido"].map((f) => (
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

        {/* Stats rápidos */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-blue-700">{usuarios.length}</p>
            <p className="text-gray-400 text-sm">Total</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{usuarios.filter(u => u.estado === "Activo").length}</p>
            <p className="text-gray-400 text-sm">Activos</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-red-500">{usuarios.filter(u => u.estado === "Suspendido").length}</p>
            <p className="text-gray-400 text-sm">Suspendidos</p>
          </div>
        </div>

        {/* Lista de usuarios */}
        <div className="flex flex-col gap-3">
          {usuariosFiltrados.map((usuario) => (
            <div
              key={usuario.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg ${
                usuario.rol === "Vendedor" ? "bg-cyan-100 text-cyan-700" : "bg-blue-100 text-blue-700"
              }`}>
                {usuario.nombre.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-bold text-gray-800">{usuario.nombre}</p>
                <p className="text-gray-400 text-sm">{usuario.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    usuario.rol === "Vendedor"
                      ? "bg-cyan-100 text-cyan-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {usuario.rol}
                  </span>
                  <span className="text-xs text-gray-400">Desde {usuario.fecha}</span>
                </div>
              </div>

              {/* Estado y acción */}
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                  usuario.estado === "Activo"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                  {usuario.estado}
                </span>
                <button
                  onClick={() => toggleEstado(usuario.id)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition whitespace-nowrap ${
                    usuario.estado === "Activo"
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {usuario.estado === "Activo" ? "Suspender" : "Activar"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}