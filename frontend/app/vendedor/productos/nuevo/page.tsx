"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoProducto() {
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagen, setImagen] = useState<File | null>(null);
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje(`Producto "${nombre}" publicado correctamente`);
        setTimeout(() => router.push("/vendedor/productos"), 2000);
    };

    return (
        <div className="max-w-xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Subir Producto</h1>

            {mensaje && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {mensaje}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="font-semibold">Nombre del producto</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                        placeholder="Ej: Camiseta deportiva"
                        required
                    />
                </div>

                <div>
                    <label className="font-semibold">Precio ($)</label>
                    <input
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                        placeholder="Ej: 29.99"
                        required
                    />
                </div>

                <div>
                    <label className="font-semibold">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                        placeholder="Describe tu producto"
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label className="font-semibold">Imagen del producto</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagen(e.target.files?.[0] || null)}
                        className="w-full border rounded p-2 mt-1"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-semibold"
                    >
                        Publicar Producto
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/vendedor")}
                        className="flex-1 border py-3 rounded-lg hover:bg-gray-100 font-semibold"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}