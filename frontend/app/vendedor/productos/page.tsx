"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function MisProductos() {
  const [productos] = useState([
    { id: 1, nombre: "Mochila Urbana", precio: 55, stock: 12, categoria: "Accesorios" },
    { id: 2, nombre: "Cámara Digital", precio: 350, stock: 3, categoria: "Electrónica" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-bold text-white">Mis Productos</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Mis Productos</h1>
            <p className="text-slate-500 mt-1">Gestiona tu catálogo</p>
          </div>
          <Link href="/vendedor/productos/nuevo">
            <button className="bg-blue-800 hover:bg-blue-900 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition">
              + Nuevo Producto
            </button>
          </Link>
        </div>

        {productos.length > 0 ? (
          <div className="flex flex-col gap-3">
            {productos.map((producto) => (
              <div key={producto.id} className="bg-white rounded-2xl p-4 shadow-md border border-slate-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center flex-shrink-0 font-bold text-lg text-blue-800">
                  {producto.nombre.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{producto.nombre}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">{producto.categoria}</span>
                    <span className="text-xs text-slate-500">Stock: {producto.stock}</span>
                    <span className="text-xs font-bold text-blue-900">${producto.precio}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            Aún no tienes productos publicados.
          </div>
        )}
      </div>
    </div>
  );
}