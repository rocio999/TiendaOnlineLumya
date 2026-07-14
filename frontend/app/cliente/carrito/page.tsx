"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria?: string;
  emoji?: string;
  cantidad: number;
}
export default function Carrito() {
const [productos, setProductos] = useState<Producto[]>([]);
 
const guardar = (nuevos: Producto[]) => {    setProductos(nuevos);
    localStorage.setItem("carrito", JSON.stringify(nuevos));
  };
useEffect(() => {

  const cargarCarrito = () => {

    const guardado = localStorage.getItem("carrito");

    if (guardado) {

      const datos: Producto[] = JSON.parse(guardado);

      setProductos(datos);

    }

  };


  cargarCarrito();

}, []);
  const eliminar = (id: number) => {
    guardar(productos.filter((p) => p.id !== id));
  };

  const cambiarCantidad = (id: number, delta: number) => {
    guardar(productos.map((p) =>
      p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad + delta) } : p
    ));
  };

  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/cliente/tiendas/id">
              <button className="text-white hover:bg-white/20 p-2 rounded-xl transition">
                ← Volver
              </button>
            </Link>
            <Image
              src="/logo-lumya.png"
              alt="Lumya"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <span className="text-xl font-bold text-white">Mi Carrito</span>
          </div>
          <span className="bg-white/20 text-white px-3 py-1 rounded-xl text-sm font-semibold">
            {productos.length} items
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 pb-40">

        {productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <span className="text-8xl mb-6">🛒</span>
            <p className="text-xl font-bold text-blue-900 mb-2">
              Tu carrito está vacío
            </p>
            <p className="text-blue-400 text-sm mb-8">
              Agrega productos para continuar
            </p>
            <Link href="/cliente/tiendas/id">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg">
                Ver Productos
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 mb-6">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl w-20 h-20 flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">{producto.emoji}</span>
                  </div>

                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{producto.nombre}</p>
                    <p className="text-blue-700 font-semibold">${producto.precio}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => cambiarCantidad(producto.id, -1)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 w-7 h-7 rounded-lg font-bold transition"
                      >
                        -
                      </button>
                      <span className="font-semibold text-gray-700 w-4 text-center">
                        {producto.cantidad}
                      </span>
                      <button
                        onClick={() => cambiarCantidad(producto.id, 1)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 w-7 h-7 rounded-lg font-bold transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-blue-900">
                      ${producto.precio * producto.cantidad}
                    </p>
                    <button
                      onClick={() => eliminar(producto.id)}
                      className="text-red-400 hover:text-red-600 text-sm transition"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                Resumen del pedido
              </h3>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Envío</span>
                <span className="text-green-500 font-semibold">Gratis</span>
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
                <span className="font-bold text-blue-900 text-lg">Total</span>
                <span className="font-bold text-blue-900 text-lg">${total}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {productos.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-2xl text-lg shadow-lg hover:opacity-90 transition">
              Proceder al Pago — ${total}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}