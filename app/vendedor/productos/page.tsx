"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  peso: number;
  stock: number;
  categoria: string;
  vendedorId: string;
  estado: string;
  imagenUrl: string;
}

export default function MisProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  // Estados para el modal de edición
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [nombreEdit, setNombreEdit] = useState("");
  const [precioEdit, setPrecioEdit] = useState(0);
  const [pesoEdit, setPesoEdit] = useState(0);
  const [stockEdit, setStockEdit] = useState(0);
  const [imagenUrlEdit, setImagenUrlEdit] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      const vendedorId = localStorage.getItem("vendedorId");
      if (!vendedorId) {
        setCargando(false);
        return;
      }

      try {
        const res = await fetch("http://brown-lark-804410.hostingersite.com/productos");
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

  // Función para abrir el modal de edición con los datos actuales
  const abrirEdicion = (producto: Producto) => {
    setProductoEditando(producto);
    setNombreEdit(producto.nombre);
    setPrecioEdit(producto.precio);
    setPesoEdit(producto.peso || 0);
    setStockEdit(producto.stock);
    setImagenUrlEdit(producto.imagenUrl || "");
  };

  // Función para guardar los cambios del producto
  const guardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoEditando) return;

    try {
      const productoActualizado = {
        ...productoEditando,
        nombre: nombreEdit,
        precio: Number(precioEdit),
        peso: Number(pesoEdit),
        stock: Number(stockEdit),
        imagenUrl: imagenUrlEdit,
      };

      const res = await fetch(`http://brown-lark-804410.hostingersite.com/productos/${productoEditando.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productoActualizado),
      });

      if (!res.ok) {
        throw new Error("No se pudo actualizar el producto");
      }

      // Actualizar estado local
      setProductos(
        productos.map((p) => (p.id === productoEditando.id ? productoActualizado : p))
      );

      setProductoEditando(null);
      setMensajeExito("¡Producto editado correctamente!");
      setTimeout(() => setMensajeExito(""), 4000);
    } catch (err) {
      console.error("Error al actualizar:", err);
      setError("Error al actualizar el producto");
    }
  };

  // Función para eliminar producto
  const eliminarProducto = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    try {
      const res = await fetch(`http://brown-lark-804410.hostingersite.com/productos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el producto");
      }

      setProductos(productos.filter((p) => p.id !== id));
      setMensajeExito("¡Producto eliminado correctamente!");
      setTimeout(() => setMensajeExito(""), 4000);
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError("No se pudo eliminar el producto");
    }
  };

  const inputClasses = "w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400";

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

        {mensajeExito && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 p-3 rounded-xl mb-5 text-center font-semibold text-sm">
            ✅ {mensajeExito}
          </div>
        )}

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
                
                {/* 🟢 IMAGEN OPTIMIZADA CON SIZES */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center flex-shrink-0 overflow-hidden relative border border-slate-100">
                  {producto.imagenUrl && producto.imagenUrl.startsWith("http") ? (
                    <Image 
                      src={producto.imagenUrl} 
                      alt={producto.nombre} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 64px"
                      className="object-cover" 
                    />
                  ) : (
                    <span className="font-bold text-lg text-blue-800">{producto.nombre.charAt(0)}</span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-bold text-slate-800">{producto.nombre}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">{producto.categoria}</span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Stock: <strong>{producto.stock}</strong></span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">Peso: <strong>{producto.peso || 0} Kg</strong></span>
                    <span className="text-xs font-bold text-blue-900">${producto.precio}</span>
                  </div>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                  producto.estado === "activo" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                }`}>
                  {producto.estado === "activo" ? "Activo" : "Suspendido"}
                </span>

                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => abrirEdicion(producto)}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    🗑️ Eliminar
                  </button>
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

      {/* MODAL DE EDICIÓN */}
      {productoEditando && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-fade-in">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Editar Producto</h2>
            <form onSubmit={guardarEdicion} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  value={nombreEdit}
                  onChange={(e) => setNombreEdit(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={precioEdit}
                    onChange={(e) => setPrecioEdit(Number(e.target.value))}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Peso (Kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pesoEdit}
                    onChange={(e) => setPesoEdit(Number(e.target.value))}
                    className={inputClasses}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Stock</label>
                  <input
                    type="number"
                    value={stockEdit}
                    onChange={(e) => setStockEdit(Number(e.target.value))}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">URL de la Foto</label>
                <input
                  type="text"
                  value={imagenUrlEdit}
                  onChange={(e) => setImagenUrlEdit(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className={inputClasses}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setProductoEditando(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}