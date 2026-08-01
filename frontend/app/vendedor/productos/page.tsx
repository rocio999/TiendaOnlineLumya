"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  vendedorId: string;
  estado: string;
  imagenUrl: string
}

export default function MisProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      const vendedorId = localStorage.getItem("vendedorId");
      if (!vendedorId) {
        setCargando(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3001/productos");
        const data = await res.json();

        if (!res.ok) {
          setError("No se pudieron cargar los productos");
          setCargando(false);
          return;
        }

        const misProductos = data.filter((p: Producto) => p.vendedorId === vendedorId);
        setProductos(misProductos);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold text-white">Mis Productos</span>
          </div>
          <Link href="/vendedor">
            <button className="text-white hover:bg-white/20 px-3 py-2 rounded-xl text-sm transition">
              ← Volver
            </button>
          </Link>
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

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl mb-5 text-center font-semibold text-sm">
            ⚠️ {error}
          </div>
        )}

        {cargando ? (
          <div className="text-center py-20 text-slate-400">Cargando productos...</div>
        ) : productos.length > 0 ? (
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
                <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                  producto.estado === "activo" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}>
                  {producto.estado === "activo" ? "Activo" : "Suspendido"}
                </span>
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