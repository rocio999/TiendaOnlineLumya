"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NuevoProducto() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(`Producto "${nombre}" publicado correctamente`);
    setTimeout(() => router.push("/vendedor/productos"), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-bold text-white">Subir Producto</span>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          {mensaje && (
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 p-3 rounded-xl mb-5 text-center font-semibold text-sm">
              ✅ {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-blue-800 font-semibold text-sm block mb-1">Nombre del producto</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Camiseta deportiva"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />
            </div>

            <div>
              <label className="text-blue-800 font-semibold text-sm block mb-1">Precio ($)</label>
              <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej: 29.99"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />
            </div>

            <div>
              <label className="text-blue-800 font-semibold text-sm block mb-1">Categoría</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required>
                <option value="">Selecciona una categoría</option>
                <option value="ropa">👕 Ropa</option>
                <option value="electronica">📱 Electrónica</option>
                <option value="calzado">👟 Calzado</option>
                <option value="hogar">🏠 Hogar</option>
                <option value="deportes">⚽ Deportes</option>
                <option value="accesorios">👜 Accesorios</option>
                <option value="otros">📦 Otros</option>
              </select>
            </div>

            <div>
              <label className="text-blue-800 font-semibold text-sm block mb-1">Descripción</label>
              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe tu producto" rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />
            </div>

            <div>
              <label className="text-blue-800 font-semibold text-sm block mb-1">Imagen del producto</label>
              <input type="file" accept="image/*"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-blue-800 file:text-white file:font-semibold hover:file:bg-blue-900 transition cursor-pointer" />
            </div>

            <div className="flex gap-4 mt-2">
              <button type="submit"
                className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition shadow-lg">
                Publicar Producto
              </button>
              <button type="button" onClick={() => router.push("/vendedor")}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}