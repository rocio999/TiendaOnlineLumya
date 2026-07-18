"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
}

export default function InicioCliente() {
  const [agregado, setAgregado] = useState<string | null>(null);
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch("http://localhost:3001/productos");
        const data = await res.json();
        setProductos(data.filter((p: any) => p.stock > 0));
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  const categorias = [
    { nombre: "Ropa", emoji: "👕" },
    { nombre: "Calzado", emoji: "👟" },
    { nombre: "Electrónica", emoji: "📱" },
    { nombre: "Accesorios", emoji: "👜" },
  ];

  const productosFiltrados = categoriaActiva
    ? productos.filter((p) => p.categoria === categoriaActiva)
    : productos;

  const handleAgregar = (producto: Producto) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existe = carritoActual.find((p: any) => p.id === producto.id);

    if (existe) {
      const actualizado = carritoActual.map((p: any) =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      localStorage.setItem("carrito", JSON.stringify(actualizado));
    } else {
      localStorage.setItem("carrito", JSON.stringify([...carritoActual, { ...producto, cantidad: 1 }]));
    }

    setAgregado(producto.id);
    setTimeout(() => setAgregado(null), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo-lumya.png" alt="Lumya" width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold text-white">lumya</span>
          </div>
          <Link href="/cliente/carrito">
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl font-semibold transition-all text-sm">
              🛒 Carrito
            </button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto mt-3">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full bg-white rounded-xl px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none shadow-md"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        <h2 className="text-xl font-bold text-blue-900 mb-3">Categorías Populares</h2>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {categorias.map((cat) => (
            <div
              key={cat.nombre}
              onClick={() => setCategoriaActiva(categoriaActiva === cat.nombre ? null : cat.nombre)}
              className={`bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm hover:shadow-md border-2 transition cursor-pointer ${
                categoriaActiva === cat.nombre
                  ? "border-blue-500 bg-blue-50"
                  : "border-transparent hover:border-blue-300"
              }`}
            >
              <span className="text-3xl mb-1">{cat.emoji}</span>
              <p className={`text-xs font-semibold ${categoriaActiva === cat.nombre ? "text-blue-600" : "text-blue-800"}`}>
                {cat.nombre}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-blue-900">
            {categoriaActiva ? `Categoría: ${categoriaActiva}` : "Productos para ti"}
          </h2>
          {categoriaActiva && (
            <button
              onClick={() => setCategoriaActiva(null)}
              className="text-sm text-blue-500 hover:text-blue-700 transition"
            >
              Ver todos
            </button>
          )}
        </div>

        {cargando ? (
          <div className="text-center py-20 text-gray-400">Cargando productos...</div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No hay productos disponibles.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-24">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-100"
              >
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 h-32 flex items-center justify-center">
                  <span className="text-6xl">📦</span>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-800 text-sm">{producto.nombre}</p>
                  <p className="text-xs text-gray-400 mb-1">{producto.categoria}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-blue-700 font-bold">${producto.precio}</p>
                    <button
                      onClick={() => handleAgregar(producto)}
                      className={`text-white text-xs px-3 py-1 rounded-lg transition font-semibold ${
                        agregado === producto.id
                          ? "bg-green-500"
                          : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90"
                      }`}
                    >
                      {agregado === producto.id ? "✓ Agregado" : "+ Carrito"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-2">
          <button
            onClick={() => setCategoriaActiva(null)}
            className="flex flex-col items-center text-blue-700"
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs font-semibold">Inicio</span>
          </button>
          <button
            onClick={() => setCategoriaActiva(null)}
            className="flex flex-col items-center text-gray-400 hover:text-blue-600 transition"
          >
            <span className="text-xl">📦</span>
            <span className="text-xs">Categorías</span>
          </button>
          <Link href="/cliente/carrito" className="flex flex-col items-center text-gray-400 hover:text-blue-600 transition">
            <span className="text-xl">🛒</span>
            <span className="text-xs">Carrito</span>
          </Link>
          <Link href="/cliente/perfil" className="flex flex-col items-center text-gray-400 hover:text-blue-600 transition">
            <span className="text-xl">👤</span>
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </div>

    </div>
  );
}