"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function GestionProductos() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Mochila Urbana", precio: 55, stock: 12, categoria: "Accesorios", vendedor: "Carlos López", estado: "Activo" },
    { id: 2, nombre: "Zapatillas Runner", precio: 90, stock: 8, categoria: "Calzado", vendedor: "Pedro Rodríguez", estado: "Activo" },
    { id: 3, nombre: "Cámara Digital", precio: 350, stock: 3, categoria: "Electrónica", vendedor: "Carlos López", estado: "Activo" },
    { id: 4, nombre: "Auriculares BT", precio: 110, stock: 0, categoria: "Electrónica", vendedor: "Pedro Rodríguez", estado: "Suspendido" },
    { id: 5, nombre: "Camiseta Deportiva", precio: 25, stock: 20, categoria: "Ropa", vendedor: "Carlos López", estado: "Activo" },
    { id: 6, nombre: "Reloj Inteligente", precio: 199, stock: 5, categoria: "Electrónica", vendedor: "Pedro Rodríguez", estado: "Activo" },
  ]);

  const [filtro, setFiltro] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const toggleEstado = (id: number) => {
    setProductos(productos.map((p) =>
      p.id === id
        ? { ...p, estado: p.estado === "Activo" ? "Suspendido" : "Activo" }
        : p
    ));
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideFiltro = filtro === "Todos" || p.categoria === filtro || p.estado === filtro;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.vendedor.toLowerCase().includes(busqueda.toLowerCase());
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
            <span className="text-xl font-bold text-white">Gestión de Productos</span>
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
            placeholder="Buscar por producto o vendedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 shadow-sm"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["Todos", "Ropa", "Calzado", "Electrónica", "Accesorios", "Activo", "Suspendido"].map((f) => (
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-blue-700">{productos.length}</p>
            <p className="text-gray-400 text-sm">Total Productos</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{productos.filter(p => p.stock > 0).length}</p>
            <p className="text-gray-400 text-sm">Con Stock</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-red-500">{productos.filter(p => p.stock === 0).length}</p>
            <p className="text-gray-400 text-sm">Sin Stock</p>
          </div>
        </div>

        {/* Lista productos */}
        <div className="flex flex-col gap-3">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center flex-shrink-0 font-bold text-lg text-blue-700">
                {producto.nombre.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-bold text-gray-800">{producto.nombre}</p>
                <p className="text-gray-400 text-sm">Vendedor: {producto.vendedor}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {producto.categoria}
                  </span>
                  <span className={`text-xs font-semibold ${producto.stock === 0 ? "text-red-500" : "text-green-600"}`}>
                    Stock: {producto.stock}
                  </span>
                  <span className="text-xs font-bold text-blue-900">${producto.precio}</span>
                </div>
              </div>

              {/* Estado y acción */}
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                  producto.estado === "Activo"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                  {producto.estado}
                </span>
                <button
                  onClick={() => toggleEstado(producto.id)}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg transition whitespace-nowrap ${
                    producto.estado === "Activo"
                      ? "bg-red-50 text-red-500 hover:bg-red-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {producto.estado === "Activo" ? "Suspender" : "Activar"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}