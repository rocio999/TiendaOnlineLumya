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
    const [imagen, setImagen] = useState<File | null>(null);
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje(`Producto "${nombre}" publicado correctamente`);
        setTimeout(() => router.push("/vendedor/productos"), 2000);
    };

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
                <div className="absolute inset-0 bg-black/70" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 max-w-xl mx-auto px-8 py-10">

                {/* Título */}
                <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
                    Subir Producto
                </h1>
                <p className="text-yellow-300 font-medium mb-8">
                    Completa los datos de tu nuevo producto
                </p>

                {/* Mensaje éxito */}
                {mensaje && (
                    <div className="bg-cyan-500/20 border border-cyan-400 text-cyan-300 p-4 rounded-xl mb-6 text-center font-semibold">
                        ✅ {mensaje}
                    </div>
                )}

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <div>
                        <label className="text-cyan-300 font-semibold block mb-1">
                            Nombre del producto
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-slate-800/80 border-2 border-cyan-500/50 text-white rounded-xl p-3 placeholder-slate-400 focus:outline-none focus:border-cyan-300 transition"
                            placeholder="Ej: Camiseta deportiva"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-cyan-300 font-semibold block mb-1">
                            Precio ($)
                        </label>
                        <input
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            className="w-full bg-slate-800/80 border-2 border-cyan-500/50 text-white rounded-xl p-3 placeholder-slate-400 focus:outline-none focus:border-cyan-300 transition"
                            placeholder="Ej: 29.99"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-cyan-300 font-semibold block mb-1">
                            Categoría
                        </label>
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="w-full bg-slate-800/80 border-2 border-cyan-500/50 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-300 transition"
                            required
                        >
                            <option value="" className="bg-slate-800">Selecciona una categoría</option>
                            <option value="ropa" className="bg-slate-800">👕 Ropa</option>
                            <option value="electronica" className="bg-slate-800">📱 Electrónica</option>
                            <option value="calzado" className="bg-slate-800">👟 Calzado</option>
                            <option value="hogar" className="bg-slate-800">🏠 Hogar</option>
                            <option value="deportes" className="bg-slate-800">⚽ Deportes</option>
                            <option value="accesorios" className="bg-slate-800">👜 Accesorios</option>
                            <option value="otros" className="bg-slate-800">📦 Otros</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-cyan-300 font-semibold block mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full bg-slate-800/80 border-2 border-cyan-500/50 text-white rounded-xl p-3 placeholder-slate-400 focus:outline-none focus:border-cyan-300 transition"
                            placeholder="Describe tu producto"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-cyan-300 font-semibold block mb-1">
                            Imagen del producto
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImagen(e.target.files?.[0] || null)}
                            className="w-full bg-slate-800/80 border-2 border-cyan-500/50 text-white rounded-xl p-3 file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-white file:font-semibold hover:file:bg-cyan-400 transition cursor-pointer"
                        />
                    </div>

                    <div className="flex gap-4 mt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/30"
                        >
                            Publicar Producto
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push("/vendedor")}
                            className="flex-1 bg-slate-700 border border-slate-500 text-white py-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}