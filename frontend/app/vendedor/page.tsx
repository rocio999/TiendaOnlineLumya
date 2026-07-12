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
    <div className="min-h-screen relative">
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondo-lumya.png"
          alt="Fondo"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-10">
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-wide">
              Mis Productos
            </h1>
            <p className="text-yellow-300 mt-1 font-medium">
              Gestiona tu catálogo de productos
            </p>
          </div>
          <Link href="/vendedor/productos/nuevo">
            <button className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30">
              + Nuevo Producto
            </button>
          </Link>
        </div>

        {/* Lista de productos */}
        {productos.length > 0 ? (
          <div className="flex flex-col gap-4">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="bg-slate-800/70 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0 font-bold text-xl text-cyan-300">
                  {producto.nombre.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-lg">{producto.nombre}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                      {producto.categoria}
                    </span>
                    <span className="text-xs text-slate-300">Stock: {producto.stock}</span>
                    <span className="text-sm font-bold text-yellow-300">${producto.precio}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-32">
            <span className="text-7xl mb-6">🛍️</span>
            <p className="text-white text-xl font-semibold mb-2">
              Aún no tienes productos publicados
            </p>
            <p className="text-cyan-300 text-sm mb-8">
              Comienza subiendo tu primer producto
            </p>
            <Link href="/vendedor/productos/nuevo">
              <button className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/30">
                + Subir mi primer producto
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}