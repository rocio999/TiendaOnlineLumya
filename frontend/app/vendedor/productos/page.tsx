import Link from "next/link";

export default function MisProductos() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Mis Productos</h1>
                <Link href="/vendedor/productos/nuevo">
                    <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                        + Nuevo Producto
                    </button>
                </Link>
            </div>

            <p className="text-gray-500">Aún no tienes productos publicados.</p>
        </div>
    );
}