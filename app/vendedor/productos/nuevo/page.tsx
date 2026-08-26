"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


export default function NuevoProducto() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [peso, setPeso] = useState(""); 
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [imagen, setImagen] = useState<File | null>(null);

  interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  emoji: string;
  estado: string;
}

const [categorias, setCategorias] = useState<Categoria[]>([]);

useEffect(() => {
  const cargarCategorias = async () => {
    try {
      const res = await fetch("http://localhost:3001/categorias");

      if (!res.ok) {
        throw new Error("No se pudieron cargar las categorías");
      }

      const data = await res.json();

      const categoriasActivas = data.filter(
        (categoria: Categoria) => categoria.estado === "Activa"
      );

      setCategorias(categoriasActivas);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  cargarCategorias();
}, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const vendedorId = localStorage.getItem("vendedorId");
    if (!vendedorId) {
      setMensaje("Debes iniciar sesión para subir productos.");
      return;
    }

    if (!imagen) {
      setMensaje("Debes seleccionar una imagen.");
      return;
    }

    setCargando(true);
    try {
      // 1. Subir imagen
      const formData = new FormData();
      formData.append("imagen", imagen);

      const resImg = await fetch("http://localhost:3001/imagenes", {
        method: "POST",
        body: formData,
      });

      const dataImg = await resImg.json();
      const imagenUrl = dataImg.url;

      console.log("Imagen subida, URL recibida:", imagenUrl);

      // 2. Crear producto con la URL y el peso
      const res = await fetch("http://localhost:3001/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          peso: Number(peso), 
          descripcion,
          categoria,
          stock: Number(stock),
          vendedorId,
          imagenUrl
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensaje(data.message || "Ocurrió un error al publicar el producto");
        setCargando(false);
        return;
      }

      setMensaje(`Producto "${nombre}" publicado correctamente`);
      setTimeout(() => router.push("/vendedor/productos"), 2000);
    } catch (error) {
      console.error("Error al publicar producto:", error);
      setMensaje("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-slate-50">
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-4 py-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-lumya.png" alt="Lumya" width={36} height={36} className="rounded-xl" />
            <span className="text-lg font-bold text-white">Subir Producto</span>
          </div>
          <Link href="/vendedor">
            <button className="text-white hover:bg-white/20 px-3 py-2 rounded-xl text-sm transition">
              ← Volver
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          {mensaje && (
            <div className={`p-3 rounded-xl mb-5 text-center font-semibold text-sm ${
              mensaje.includes("error") || mensaje.includes("Debes") || mensaje.includes("conectar")
                ? "bg-red-100 border border-red-300 text-red-700"
                : "bg-emerald-100 border border-emerald-300 text-emerald-700"
            }`}>
              {mensaje.includes("error") || mensaje.includes("Debes") || mensaje.includes("conectar") ? "⚠️" : "✅"} {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-blue-800 font-semibold text-sm block mb-1">Nombre del producto</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Camiseta deportiva"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-blue-800 font-semibold text-sm block mb-1">Precio ($)</label>
                <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)}
                  placeholder="Ej: 29.99"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />
              </div>

              <div>
                <label className="text-blue-800 font-semibold text-sm block mb-1">Peso (Kg)</label>
                <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)}
                  placeholder="Ej: 1.5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />
              </div>
            </div>

            <div>
              <label className="text-blue-800 font-semibold text-sm block mb-1">Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                placeholder="Ej: 10"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400" required />
            </div>

            <div>
  <label className="text-blue-800 font-semibold text-sm block mb-1">
    Categoría
  </label>

  <select
    value={categoria}
    onChange={(e) => setCategoria(e.target.value)}
    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-cyan-400"
    required
  >
    <option value="">Selecciona una categoría</option>

    {categorias.map((cat) => (
      <option key={cat.id} value={cat.nombre}>
        {cat.emoji} {cat.nombre}
      </option>
    ))}
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
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImagen(e.target.files?.[0] || null)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-blue-800 file:text-white file:font-semibold hover:file:bg-blue-900 transition cursor-pointer" 
              />
            </div>

            <div className="flex gap-4 mt-2">
              <button type="submit" disabled={cargando}
                className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition shadow-lg disabled:opacity-50">
                {cargando ? "Publicando..." : "Publicar Producto"}
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